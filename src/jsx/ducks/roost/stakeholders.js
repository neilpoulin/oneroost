import * as Stakeholder from "models/Stakeholder"
import * as Deal from "models/Deal"
import {normalize} from "normalizr"
import Parse from "parse"
import * as RoostUtil from "RoostUtil"
import {Map, List} from "immutable"
import {createComment} from "ducks/roost/comments"
import * as log from "LoggingUtil"

export const ADD_STAKEHOLDER = "oneroost/stakeholder/ADD_STAKEHOLDER"
export const STAKEHOLDER_LOAD_REQUEST = "oneroost/stakeholder/STAKEHOLDER_LOAD_REQUEST"
export const STAKEHOLDER_LOAD_SUCCESS = "oneroost/stakeholder/STAKEHOLDER_LOAD_SUCCESS"
export const STAKEHOLDER_LOAD_ERROR = "oneroost/stakeholder/STAKEHOLDER_LOAD_ERROR"
export const UPDATE_STAKEHOLDER = "oneroost/stakeholder/UPDATE_STAKEHOLDER"

export const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    ids: List([]),
})

export default function reducer(state=initialState, action){
    switch (action.type) {
        case STAKEHOLDER_LOAD_REQUEST:
            state = state.set("isLoading", true)
            break;
        case STAKEHOLDER_LOAD_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("hasLoaded", true)
            state = state.set("ids", List(action.payload.map(stakeholder => stakeholder.get("objectId"))))
            break;
        case STAKEHOLDER_LOAD_ERROR:
            state = state.set("isLoading", false);
            break;
        case ADD_STAKEHOLDER:
            state = state.set("ids", state.get("ids").push(action.payload.get("objectId")))
            break;
        case UPDATE_STAKEHOLDER:
            break;
        default:
            break;
    }
    return state;
}

// Actions
export const removeStakeholder = (json) => (dispatch, getState) => {
    let currentUser = Parse.User.current()
    let stakeholder = Stakeholder.fromJSON(json)
    stakeholder.set({
        active: false,
        modifiedBy: currentUser,
    })
    stakeholder.save().then().catch(log.error)

    let entities = normalize(stakeholder.toJSON(), Stakeholder.Schema).entities
    dispatch({
        type: UPDATE_STAKEHOLDER,
        entities: entities,
        dealId: stakeholder.get("deal").id
    })

    var fullName = RoostUtil.getFullName(currentUser)
    var message = fullName + " removed " + RoostUtil.getFullName(json.user) + " from the opportunity.";
    dispatch(createComment({
        deal: stakeholder.get("deal"),
        message: message,
        author: null,
        username: "OneRoost Bot",
        navLink: {type: "participant"}
    }))
}

export const createStakeholder = (json, message) => (dispatch, getState) => {
    if (!json.hasOwnProperty("active")){
        json["active"] = true;
    }
    let stakeholder = Stakeholder.fromJSON(json);
    stakeholder.save().then(saved => {
        let savedJSON = saved.toJSON()
        savedJSON.user = {
            ...savedJSON.user,
            ...json.user
        }
        let entities = normalize(savedJSON, Stakeholder.Schema).entities

        if (message){
            dispatch(createComment({
                deal: json.deal,
                message,
                author: null,
                username: "OneRoost Bot",
                navLink: {type: "participant"}
            }))
        }

        dispatch({
            type: ADD_STAKEHOLDER,
            dealId: saved.get("deal").id,
            payload: savedJSON,
            entities: entities,
        })
    }).catch(log.error)
}

export const inviteUser = (userInfo, deal) => (dispatch, getState) => {
    const state = getState()
    let currentUser = RoostUtil.getCurrentUser(state)

    Parse.Cloud.run("addStakeholder", {
        dealId: deal.objectId,
        stakeholder: userInfo,
    }).then(function(result) {
        if (result.exists){
            alert("this user is already a stakeholder on this opportunity.");
            return;
        }
        var createdUser = result.user
        const stakeholderToCreate = {
            user: createdUser.toJSON(),
            deal,
            role: userInfo.role,
            invitedBy: currentUser,
            inviteAccepted: false,
            active: true,
        }
        const message = RoostUtil.getFullName(currentUser) + " invited " + RoostUtil.getFullName(createdUser) + " to the opportunity.";
        dispatch(createStakeholder(stakeholderToCreate, message))
    }).catch(error => {
        alert("this user is already a stakeholder on this opportunity.");
        log.error(error);
    });
}

export const loadStakeholders = (dealId, force=false) => (dispatch, getState) => {
    let {roosts} = getState();
    if (roosts.has(dealId) && roosts.get(dealId).get("stakeholders").get("hasLoaded") && !roosts.get(dealId).get("stakeholders").get("isLoading") && !force){
        log.warn("not loading stakeholders as it has been loaded before")
        return null
    }
    dispatch({
        type: STAKEHOLDER_LOAD_REQUEST,
        dealId: dealId
    });

    var stakeholderQuery = new Parse.Query("Stakeholder");
    stakeholderQuery.equalTo("deal", Deal.Pointer(dealId));
    stakeholderQuery.include("user");
    stakeholderQuery.find().then(stakeholders => {
        let json = stakeholders.map(stakeholder => stakeholder.toJSON())
        // let AccountSchema = Account.Schema;
        // let deal = Deal.fromJS(json[0].deal)
        let entities = normalize(json, [Stakeholder.Schema]).entities || {}
        dispatch({
            type: STAKEHOLDER_LOAD_SUCCESS,
            dealId: dealId,
            payload: json,
            entities: Map(entities)
        })
    }).catch(error => {
        log.error(error)
        dispatch({
            type: STAKEHOLDER_LOAD_ERROR,
            error: {
                error: error,
                message: "Failed to load stakeholders",
                level: "ERROR"
            }
        })
    });
}
