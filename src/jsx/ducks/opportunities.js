import Parse from "parse"
import * as User from "models/User"
import * as Deal from "models/Deal"
import {normalize} from "normalizr"
import {Map, List} from "immutable"
import RoostUtil from "RoostUtil"
import {addSubscription, handler} from "ducks/subscriptions"

export const OPPORTUNITY_LOAD_REQUEST = "oneroost/opportunity/OPPORTUNITY_LOAD_REQUEST"
export const OPPORTUNITY_LOAD_SUCCESS = "oneroost/opportunity/OPPORTUNITY_LOAD_SUCCESS"
export const OPPORTUNITY_LOAD_ERROR = "oneroost/opportunity/OPPORTUNITY_LOAD_ERROR"
export const ADD_OPPORTUNITY = "oneroost/opportunity/ADD_OPPORTUNITY"

const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    deals: List([]),
    archivedDeals: List([])
})
export default function reducer(state=initialState, action){
    switch (action.type) {
        case OPPORTUNITY_LOAD_REQUEST:
            state = state.set("isLoading", true);
            break;
        case OPPORTUNITY_LOAD_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("hasLoaded", true)
            state = state.set("deals", List(action.payload.get("deals").map(deal => deal.get("objectId")|| deal.id)))
            state = state.set("archivedDeals", List(action.payload.get("archivedDeals").map(deal => deal.get("objectId") || deal.id)))
            break;
        case OPPORTUNITY_LOAD_ERROR:
            state = state.set("isLoading", true);
            break;
        case ADD_OPPORTUNITY:
            let stakeholder = action.payload;
            if ( stakeholder.get("active") !== false ){
                state = state.set("deals", state.get("deals").push(stakeholder.get("deal").get("objectId")))
            }
            else {
                state = state.set("archivedDeals", state.get("archivedDeals").push(stakeholder.get("deal").get("objectId")))
            }
            break;
        default:
            break;
    }
    return state;
}

// Queries
const opportunitiesQuery = (userId) => {
    let query = new Parse.Query("Stakeholder");
    query.include("deal");
    query.include(["deal.account"]);
    query.include("deal.createdBy");
    query.include("deal.readyRoostUser");
    query.equalTo("user", User.Pointer(userId) );
    query.equalTo("inviteAccepted", true);
    return query
}

//Actions
export const addOpportunity = (userId, stakeholder) => (dispatch, getState) => {
    let entities = normalize(RoostUtil.toJSON(stakeholder.get("deal")), Deal.Schema).entities
    dispatch({
        type: ADD_OPPORTUNITY,
        userId: userId,
        payload: stakeholder,
        entities: entities,
    })
}

export const subscribeOpportunities = (userId) => (dispatch, getState)=> {
    console.log("subscribing to comments")
    let query = opportunitiesQuery(userId)
    dispatch(addSubscription("OPPORTUNITIES", userId, query, handler({
        create: (result) => dispatch(addOpportunity(userId, result))
    })))
}

export const loadOpportunities = (userId, force=false) => (dispatch, getState) => {
    let {opportunitiesByUser} = getState();
    if ( opportunitiesByUser.has(userId) && opportunitiesByUser.get(userId).get("hasLoaded") && !opportunitiesByUser.get(userId).get("isLoading") && !force ){
        console.warn("not loading opportunities as they were already fetched")
        return null
    }

    dispatch({
        type: OPPORTUNITY_LOAD_REQUEST,
        userId: userId,
    })

    let query = opportunitiesQuery(userId)

    query.find().then(stakeholders => {
        let active = stakeholders.filter( obj => obj.get("active") !== false );
        let archived = stakeholders.filter( obj => obj.get("active") === false );

        let deals = List(active.map(stakeholder => Map(stakeholder.get("deal").toJSON())));
        let archivedDeals = List(archived.map(stakeholder => Map(stakeholder.get("deal").toJSON())));

        let allDeals = deals.concat(archivedDeals);
        let entities = normalize(allDeals.toJS(), [Deal.Schema]).entities || {};
        dispatch({
            type: OPPORTUNITY_LOAD_SUCCESS,
            userId: userId,
            entities: entities,
            payload: Map({
                deals,
                archivedDeals
            })
        })
    }).catch(error => {
        console.error(error);
        dispatch({
            type: OPPORTUNITY_LOAD_ERROR,
            userId: userId,
            error: {
                message: "Failed to fetch opportunities",
                level: "ERROR",
                error: error
            }
        })
    })
}
