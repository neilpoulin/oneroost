import {Map} from "immutable"

export const LOAD_PAGE_REQUEST = "oneroost/companyPage/LOAD_PAGE_REQUEST"
export const LOAD_PAGE_SUCCESS = "oneroost/companyPage/LOAD_PAGE_SUCCESS"

export const initialState = Map({
    vanityUrl: null,
    isLoading: false,
    hasLoaded: false,
    lastLoaded: null,
    companyPageId: null,
    logoUrl: null,
    title: null,
    showOneRoostLink: true,
    showRoostNav: false,
})

export default function reducer(state=initialState, action){
    const payload = action.payload ? action.payload.toJS() : {};
    switch (action.type) {
        case LOAD_PAGE_REQUEST:
            state = state.set("isLoading", true);
            break;
        case LOAD_PAGE_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("hasLoaded", true)
            state = state.set("lastLoaded", new Date())
            state = state.set("title", payload.title)
            state = state.set("logoUrl", payload.logoUrl)
            state = state.set("showOneRoostLink", !!payload.showOneRoostLink)
            state = state.set("showRoostNav", !!payload.showRoostNav)
        default:
            break;
    }
    return state;
}

export const loadPage = (vanityUrl) => (dispatch, getState) => {
    const currentState = getState().companyPagesByUrl.get(vanityUrl, initialState)
    if (currentState.isLoading){
        return null;
    }
    dispatch({
        type: LOAD_PAGE_REQUEST,
        vanityUrl,
    });

    setTimeout(() => {
        dispatch({
            type: LOAD_PAGE_SUCCESS,
            vanityUrl,
            payload: {
                title: "Test Title",
                logoUrl: "http://www.google.com"
            }
        })
    }, 4000)
}
