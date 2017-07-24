
import Parse from "parse"
import * as RoostUtil from "RoostUtil"
import {Map, Set} from "immutable"
import * as Requirement from "models/Requirement"
import {normalize} from "normalizr"
import {createComment} from "ducks/roost/comments"
import {addSubscription, handler} from "ducks/subscriptions"
import {Pointer as DealPointer} from "models/Deal"
import {LOADED_ENTITIES} from "ducks/entities"
import * as log from "LoggingUtil"

export const REQUIREMENT_LOAD_REQUEST = "oneroost/requirements/REQUIREMENT_LOAD_REQUEST"
export const REQUIREMENT_LOAD_SUCCESS = "oneroost/requirements/REQUIREMENT_LOAD_SUCCESS"
export const REQUIREMENT_LOAD_ERROR = "oneroost/requirements/REQUIREMENT_LOAD_ERROR"
export const REQUIREMENT_UPDATED = "oneroost/requirements/REQUIREMENT_UPDATED"
export const REQUIREMENT_COMPLETED = "oneroost/requirements/REQUIREMENT_COMPLETED"
export const REQUIREMENT_NOT_COMPLETED = "oneroost/requirements/REQUIREMENT_NOT_COMPLETED"

export const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    ids: Set([]),
})

export default function reducer(state=initialState, action){
    switch (action.type) {
        case REQUIREMENT_LOAD_REQUEST:
            state = state.set("isLoading", true)
            break;
        case REQUIREMENT_LOAD_ERROR:
            state = state.set("isLoading", false)
            break;
        case REQUIREMENT_LOAD_SUCCESS:
            state = state.set("isLoading", false)
            state= state.set("ids", Set(action.payload.map(requirement => requirement.get("objectId"))))
            break;
        case REQUIREMENT_UPDATED:
            var requirement = action.payload;
            state = state.set("ids", state.get("ids").add(requirement.get("objectId")))
            break;
    }
    return state
}

const requirementsForDealQuery = (dealId) => {
    let query = new Parse.Query(Requirement.className)
    query.equalTo("deal", DealPointer(dealId))
    query.ascending("displayOrder")
    return query;
}

const requirementsForDealsQuery = (dealIds) => {
    let pointers = dealIds.map(dealId => DealPointer(dealId))
    let query = new Parse.Query(Requirement.className)
    query.containedIn("deal", pointers)
    return query
}

export const requirmentUpdatedAction = (requirement) => {
    let requirementJSON = RoostUtil.toJSON(requirement)
    let entities = normalize(requirementJSON, Requirement.Schema).entities
    return {
        type: REQUIREMENT_UPDATED,
        entities: entities,
        payload: requirement,
        dealId: requirementJSON.deal.objectId,
    }
}

export const updateRequirement = (requirement, changes, message) => (dispatch, getState) => {
    log.info("TODO: update requirement")
    requirement = Requirement.fromJS(requirement);
    requirement.set(changes);
    requirement.save().then(saved => {
        try{
            let intercomMetadata = {
                completed: !!saved.get("completedDate"),
                title: saved.get("title"),
                deal_id: saved.get("deal").id
            }
            window.Intercom("trackEvent", "requirement-updated", intercomMetadata);
        }
        catch(e){
            log.error("failed to notify intercom of ready roost creation")
        }
    }).catch(log.error)

    dispatch(requirmentUpdatedAction(requirement))

    dispatch(createComment({
        deal: requirement.get("deal"),
        message: message,
        author: null,
        username: "OneRoost Bot",
        navLink: {type: "requirement"}
    }))
}

export const loadRequirementsForDealIds = (dealIds=[]) => (dispatch, getState) => {
    let {roosts} = getState()
    let dealIdsToLoad = dealIds.filter(dealId => {
        // no roost exists OR it does exist and requirements have NOT been loaded
        return !roosts.has(dealId)
            || !roosts.get(dealId).get("requirements").get("hasLoaded")
            && !roosts.get(dealId).get("requirements").get("isLoading")
    })

    if (dealIdsToLoad.length === 0){
        return null
    }

    let query = requirementsForDealsQuery(dealIdsToLoad)
    let findResults = query.find()
    // notify that we're loading requirements for deals
    dealIdsToLoad.forEach(id => {
        dispatch({
            type: REQUIREMENT_LOAD_REQUEST,
            dealId: id
        })
    })
    findResults.then(results => {
        let json = results.map(requirement => requirement.toJSON())
        let entities = normalize(json, [Requirement.Schema]).entities || {}
        json.forEach(req => {
            dispatch({
                type: [req],
                payload: json,
                dealId: req.deal.objectId
            })
        })

        dispatch({
            type: LOADED_ENTITIES,
            entities,
        })
    }).catch(log.error)
}

export const loadRequirements = (dealId, force=false) => (dispatch, getState) => {
    let {roosts} = getState()
    if (roosts.has(dealId) && roosts.get(dealId).get("requirements").get("hasLoaded") && !roosts.get(dealId).get("stakeholders").get("isLoading") && !force){
        log.warn("not loading requirements as it has been loaded before")
        return null
    }
    dispatch({
        type: REQUIREMENT_LOAD_REQUEST,
        dealId: dealId
    })
    var query = requirementsForDealQuery(dealId)
    query.find().then(requirements => {
        let json = requirements.map(requirement => requirement.toJSON())
        let entities = normalize(json, [Requirement.Schema]).entities
        dispatch({
            type: REQUIREMENT_LOAD_SUCCESS,
            payload: json,
            dealId: dealId,
            entities: entities
        })
    }).catch(error => {
        log.error(error)
        dispatch({
            type: REQUIREMENT_LOAD_ERROR,
            error: {
                error: error,
                message: "Failed to load requirements for deal" + dealId,
                level: "ERROR"
            }
        })
    });
}

export const subscribeRequirements = (dealId) => (dispatch, getState) => {
    log.info("requiesting subscription to requirements for deal")
    const query = requirementsForDealQuery(dealId)
    dispatch(addSubscription("REQUIREMENTS", dealId, query, handler({
        update: (requirement) => dispatch(requirmentUpdatedAction(requirement)),
    })))
}
