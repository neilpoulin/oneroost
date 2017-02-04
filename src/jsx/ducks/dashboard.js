import {Map} from "immutable"
import {LOGOUT} from "ducks/user"

export const SHOW_ARCHIVED = "oneroost/dashboard/SHOW_ARCHIVED"
export const HIDE_ARCHIVED = "oneroost/dashboard/HIDE_ARCHIVED"
export const RESET = "oneroost/dashboard/RESET"

const initialState = Map({
    isLoading: false,
    sortBy: null,
    sortDirection: null,
    showArchived: false,
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
        default:
            break;
    }
    return state;
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
