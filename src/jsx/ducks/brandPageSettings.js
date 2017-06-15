import {fromJS} from "immutable"

export const SAVE_BRAND_REQUEST = "oneroost/brandPageSettings/SAVE_BRAND_REQUEST"
export const SAVE_BRAND_SUCCESS = "oneroost/brandPageSettings/SAVE_BRAND_SUCCESS"
export const SAVE_BRAND_ERROR = "oneroost/brandPageSettings/SAVE_BRAND_ERROR"

export const LOAD_PAGE_SUCCESS = "oneroost/brandPageSettings/LOAD_PAGE_SUCCESS"

const initialState = fromJS({
    isLoading: false,
    hasLoaded: false,
    vanityUrl: null,
    logoUrl: null,
    companyName: null, //not needed?
    templates: [],
    brandPageId: null,
})

export default function reducer(state=initialState, action){
    const payload = action.payload
    switch (action.type) {
        case SAVE_BRAND_REQUEST:
            break
        case SAVE_BRAND_SUCCESS:
            break;
        case SAVE_BRAND_ERROR:
            break
        case LOAD_PAGE_SUCCESS:
            state = state.set("hasLoaded", true)
            state = state.set("isLoading", false)
            state = state.set("vanityUrl", payload.get("vanityUrl"))
                .set("logoUrl", payload.get("logoUrl"))
                .set("companyName", payload.get("companyName"))
                .set("templates", payload.get("templates"))
                .set("brandPageId", payload.get("objectId"))
            break
        default:
            break
    }
    return state
}
