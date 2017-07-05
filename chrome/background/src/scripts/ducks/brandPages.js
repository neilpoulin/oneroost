import {fromJS} from "immutable"
import {
    LOAD_PAGES_ERROR,
    LOAD_PAGES_SUCCESS,
    LOAD_PAGES_REQUEST
} from "actions/brandPage"

const initialState = {
    isLoading: false,
    hasLoaded: false,
    pages: []
}

export default function reducer(state=initialState, action){
    switch (action.type) {
        case LOAD_PAGES_REQUEST:
            state.isLoading = true
            break;
        case LOAD_PAGES_SUCCESS:
            state.isLoading = false
            state.pages = action.payload
            break;
        case LOAD_PAGES_ERROR:
            state.isLoading = false
            break;
        default:
            break;
    }
    return state;
}
