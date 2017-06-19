import {fromJS} from "immutable"
import {getBrandPageByUrl} from "ducks/brand"
import * as BrandPage from "models/BrandPage"
import {normalize} from "normalizr"

export const SAVE_BRAND_REQUEST = "oneroost/brandPageSettings/SAVE_BRAND_REQUEST"
export const SAVE_BRAND_SUCCESS = "oneroost/brandPageSettings/SAVE_BRAND_SUCCESS"
export const SAVE_BRAND_ERROR = "oneroost/brandPageSettings/SAVE_BRAND_ERROR"

export const LOAD_PAGE_SUCCESS = "oneroost/brandPageSettings/LOAD_PAGE_SUCCESS"

const initialState = fromJS({
    isLoading: false,
    hasLoaded: false,
    errors: {},
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

export const isUrlAvailable = (vanityUrl) => {
    return getBrandPageByUrl(vanityUrl)
        .then(results => results ? results.length > 0 : true)
        .catch(err => false)
}

export const saveBrandPage = (changes) => (dispatch, getState) => {
    let page = BrandPage.fromJS(changes)
    dispatch({
        type: SAVE_BRAND_REQUEST,
        payload: changes,
    })
    page.save().then(saved => {
        let entities = normalize(saved.toJSON(), BrandPage.Schema).entities
        dispatch({
            type: SAVE_BRAND_SUCCESS,
            payload: saved,
            entities,
        })
    }).catch(err => {
        dispatch({
            type: SAVE_BRAND_ERROR,
            payload: changes,
            error: {
                level: "error",
                message: "Failed to save the brand page",
                error: err,
            }
        })
    })
}
