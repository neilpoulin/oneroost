import { normalize } from "normalizr"
import {getActions} from "DuckUtil"
import * as comments from "./comments"
import * as nextSteps from "./nextSteps"
import * as documents from "./documents"
import * as stakeholders from "./stakeholders"
import Parse from "parse"
import * as Deal from "models/Deal"

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

const roostReducer = (state, action) => {
    switch (action.type) {
        case DEAL_LOAD_REQUEST:
            return {
                ...state,
                dealLoading: true,
            }
        case DEAL_LOAD_SUCCESS:
            return {
                ...state,
                dealLoading: false,
                error: null
            }
        case DEAL_LOAD_ERROR:
            let error = action.payload;

            return {
                ...state,
                dealLoading: false,
                error: {
                    level: "ERROR",
                    message: "Failed to fetch the roost",
                    error: error
                }
            }
        default:
            return state;
    }
}
const initialState = {
    dealLoading: false,
    error: null,
    comments: {},
    nextSteps: {},
    documents: {},
    stakeholders: {},
}
const roost = (state=initialState, action) => {
    const nextState = roostReducer(state, action)
    return {
        ...nextState,
        comments: comments.default(nextState.comments, action),
        nextSteps: nextSteps.default(nextState.nextSteps, action),
        documents: documents.default(nextState.documents, action),
        stakeholders: stakeholders.default(nextState.stakeholders, action),
    }
}
export default roost;
