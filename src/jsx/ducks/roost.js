import { normalize } from "normalizr"
import {getActions} from "DuckUtil"
import * as comments from "./comments"
import * as nextSteps from "./nextSteps"
import * as documents from "./documents"
import * as stakeholders from "./stakeholders"
import Parse from "parse"
import * as Deal from "models/Deal"
import { Map } from "immutable";

export const DEAL_LOAD_REQUEST = "DEAL_LOAD_REQUSET"
export const DEAL_LOAD_SUCCESS = "DEAL_LOAD_SUCCESS"
export const DEAL_LOAD_ERROR = "DEAL_LOAD_ERROR"

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
    error: null,
    comments: comments.initialState,
    nextSteps: nextSteps.initialState,
    documents: documents.initialState,
    stakeholders: stakeholders.initialState,
})

export const loadDeal = (dealId) => {
    return (dispatch) => {
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
