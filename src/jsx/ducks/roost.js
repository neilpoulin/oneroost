import { normalize } from "normalizr"
import {getActions} from "DuckUtil"
import * as comments from "ducks/comments"
import * as nextSteps from "ducks/nextSteps"
import * as documents from "ducks/documents"
import * as stakeholders from "ducks/stakeholders"
import Parse from "parse"
import * as Deal from "models/Deal"
import { Map } from "immutable"

export const DEAL_LOAD_REQUEST = "oneroost/roost/DEAL_LOAD_REQUSET"
export const DEAL_LOAD_SUCCESS = "oneroost/roost/DEAL_LOAD_SUCCESS"
export const DEAL_LOAD_ERROR = "oneroost/roost/DEAL_LOAD_ERROR"
export const DEAL_UPDATED = "oneroost/roost/DEAL_UPDATED"

export const roostActions = [
    ...getActions(comments),
    ...getActions(nextSteps),
    ...getActions(stakeholders),
    ...getActions(documents),
    DEAL_LOAD_REQUEST,
    DEAL_LOAD_SUCCESS,
    DEAL_LOAD_ERROR,

];


const initialState = Map({
    dealLoading: false,
    hasLoaded: false,
    error: null,
    comments: comments.initialState,
    nextSteps: nextSteps.initialState,
    documents: documents.initialState,
    stakeholders: stakeholders.initialState,
})

export const updateDeal = (dealJSON, changes, message, type) => (dispatch, getState) => {
    let deal = Deal.fromJS(dealJSON);
    deal.set(changes);
    deal.save().then(saved => {}).catch(console.error)
    let entities = normalize(deal.toJSON(), Deal.Schema).entities
    dispatch({
        type: DEAL_UPDATED,
        entities: entities,
        dealId: dealJSON.objectId
    });

    dispatch(comments.createComment({
        deal: deal,
        message: message,
        author: null,
        username: "OneRoost Bot",
        navLink: {type: type}
    }))
}

export const loadDeal = (dealId, force=false) => {
    return (dispatch, getState) => {
        let {roosts} = getState();
        if ( roosts.has(dealId) && roosts.get(dealId).get("hasLoaded") && !roosts.get(dealId).get("isLoading") && !force ){
            console.warn("not loading deal, already loaded")
            return null
        }
        dispatch({
            type: DEAL_LOAD_REQUEST,
            dealId: dealId
        });

        let dealQuery = new Parse.Query(Deal.className);
        dealQuery.include("readyRoostUser");
        dealQuery.include("createdBy");
        dealQuery.include("account");
        dealQuery.get(dealId).then(deal => {
            let json = deal.toJSON()
            let normalized = normalize(json, Deal.Schema);
            dispatch({
                type: DEAL_LOAD_SUCCESS,
                payload: json,
                dealId: dealId,
                entities: normalized.entities || {}
            })
        }).catch(error => {
            console.error(error);
            dispatch({
                type:DEAL_LOAD_ERROR,
                error: error,
                dealId: dealId
            })
        });
    }
}

const roostReducer = (state=initialState, action) => {
    switch (action.type) {
        case DEAL_LOAD_REQUEST:
            state = state.set("dealLoading", true)
            break;
        case DEAL_LOAD_SUCCESS:
            state = state.set("dealLoading", false);
            state = state.set("hasLoaded", true);
            state = state.set("error", null);
            break;
        case DEAL_LOAD_ERROR:
            let error = action.payload;
            state = state.set("dealLoading", false);
            state = state.set("error", {
                level: "ERROR",
                message: "Failed to fetch the roost",
                error: error
            })
            break;
        case DEAL_UPDATED:
        default:
            return state;
    }
    return state;
}
const roost = (state=initialState, action) => {
    state = roostReducer(state, action)

    state = state.set("comments", comments.default(state.get("comments"), action))
    state = state.set("nextSteps", nextSteps.default(state.get("nextSteps"), action))
    state = state.set("documents",documents.default(state.get("documents"), action))
    state = state.set("stakeholders", stakeholders.default(state.get("stakeholders"), action))
    return state;
}
export default roost;
