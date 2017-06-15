import {fromJS} from "immutable"
import * as brandPageSettings from "ducks/brandPageSettings"
import {getActions} from "DuckUtil"
import Parse from "parse"
import BrandPage from "models/BrandPage"
import * as Account from "models/Account"
import {getCurrentAccountId} from "ducks/user"
import {LOAD_PAGE_SUCCESS} from "ducks/brandPageSettings"
import * as log from "LoggingUtil"

const pageSettingsActions = getActions(brandPageSettings)
const pageSettingsActionList = [...pageSettingsActions]

export const LOAD_BRAND_PAGES_REQUEST = "oneroost/brandPageSettings/LOAD_BRAND_PAGES_REQUEST"
export const LOAD_BRAND_PAGES_SUCCESS = "oneroost/brandPageSettings/LOAD_BRAND_PAGES_SUCCESS"
export const LOAD_BRAND_PAGES_ERROR = "oneroost/brandPageSettings/LOAD_BRAND_PAGES_ERROR"

const initialState = fromJS({
    isLoading: false,
    hasLoaded: false,
    brandPageSettingsById: {}
})

export default function reducer(state=initialState, action){
    // const payload = action.payload
    switch (action.type) {
        case LOAD_BRAND_PAGES_REQUEST:
            state = state.set("isLoading", true)
            break;
        case LOAD_BRAND_PAGES_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("hasLoaded", true)
            break;
        case LOAD_BRAND_PAGES_ERROR:
            state = state.set("isLoading", false)
            break;
        default:
            if (pageSettingsActionList.indexOf(action.type) !== -1){
                let pageId = action.brandPageId || action.payload.get("objectId") || action.payload.getIn(["brandPage", "objectId"])
                state = state.setIn(["brandPageSettingsById", pageId], brandPageSettings.default(state.getIn(["brandPageSettingsById", pageId]), action))
            }
            break
    }

    return state
}

//queries
const fetchBrandPagesForAccount = (accountId) => {
    let query = new Parse.Query(BrandPage.className)
    query.equalTo("account", Account.Pointer(accountId))
    return query.find()
}

// Action creators
export const loadPages = () => (dispatch, getState) => {
    const state = getState()
    const accountId = getCurrentAccountId(state)
    if (!accountId){
        return
    }
    dispatch({
        type: LOAD_BRAND_PAGES_REQUEST
    })
    fetchBrandPagesForAccount(accountId).then(results => {
        let pages = results.map(result => result.toJSON())
        dispatch({
            type: LOAD_BRAND_PAGES_SUCCESS,
            payload: pages
        })
        pages.forEach(page => dispatch({
            type: LOAD_PAGE_SUCCESS,
            payload: page,
            brandPageId: page.objectId
        }))
        log.info("Success!", pages)
    }).catch(error => {
        log.error("Failed to fetch brand pages for account " + accountId, error)
    })
}
