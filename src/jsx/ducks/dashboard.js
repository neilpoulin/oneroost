import {Map} from "immutable"
import {LOGOUT} from "ducks/user"

export const SHOW_ARCHIVED = "oneroost/dashboard/SHOW_ARCHIVED"
export const HIDE_ARCHIVED = "oneroost/dashboard/HIDE_ARCHIVED"
export const SET_SEARCH_TERM = "oneroost/dashboard/SET_SEARCH_TERM"
export const RESET = "oneroost/dashboard/RESET"
export const SET_TEMPALTE_ID = "oneroost/dashboard/SET_TEMPALTE_ID"

const initialState = Map({
    isLoading: false,
    sortBy: null,
    searchTerm: "",
    sortDirection: null,
    showArchived: false,
    selectedTemplateId: null,
});
export default function reducer(state=initialState,action) {
    switch (action.type) {
        case SHOW_ARCHIVED:
            state = state.set("showArchived", true)
            break;
        case HIDE_ARCHIVED:
            state = state.set("showArchived", false)
            break;
        case LOGOUT:
        case RESET:
            state = initialState;
        case SET_SEARCH_TERM:
            state = state.set("searchTerm", action.payload)
            break;
        case SET_TEMPALTE_ID:
            state = state.set("selectedTemplateId", action.payload.get("templateId"))
            break;
        default:
            break;
    }
    return state;
}

export const searchOpportunities = (query) => (dispatch, getState) => {
    dispatch({
        type: SET_SEARCH_TERM,
        payload: query
    });
}

export const setShowArchived = (showArchived) => (dispatch, getState) => {
    if ( showArchived ){
        dispatch({
            type: SHOW_ARCHIVED
        })
    }
    else {
        dispatch({
            type: HIDE_ARCHIVED
        })
    }
}

export const setTemplateId = (templateId) => {
    return {
        type: SET_TEMPALTE_ID,
        payload: {
            templateId,
        }
    }
}
