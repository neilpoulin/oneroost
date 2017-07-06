import {fromJS, List} from "immutable"
import * as brandPageSettings from "ducks/brandPageSettings"
import {getActions} from "DuckUtil"
import {normalize} from "normalizr"
import Parse from "parse"
import * as BrandPage from "models/BrandPage"
import * as Account from "models/Account"
import {getCurrentAccountId} from "ducks/user"
import {LOAD_PAGE_SUCCESS, DELETE_PAGE_SUCCESS} from "ducks/brandPageSettings"
import * as log from "LoggingUtil"

const pageSettingsActions = getActions(brandPageSettings)
const pageSettingsActionList = [...pageSettingsActions]

export const LOAD_BRAND_PAGES_REQUEST = "oneroost/brandPageSettings/LOAD_BRAND_PAGES_REQUEST"
export const LOAD_BRAND_PAGES_SUCCESS = "oneroost/brandPageSettings/LOAD_BRAND_PAGES_SUCCESS"
export const LOAD_BRAND_PAGES_ERROR = "oneroost/brandPageSettings/LOAD_BRAND_PAGES_ERROR"

export const CREATE_BRAND_PAGE_REQUEST = "oneroost/brandPageSettings/CREATE_BRAND_PAGE_REQUEST"
export const CREATE_BRAND_PAGE_SUCCESS = "oneroost/brandPageSettings/CREATE_BRAND_PAGE_SUCCESS"
export const CREATE_BRAND_PAGE_ERROR = "oneroost/brandPageSettings/CREATE_BRAND_PAGE_ERROR"

export const TOGGLE_PAGE_ID_OPEN = "oneroost/brandSettingsAdmin/TOGGLE_PAGE_ID_OPEN"
export const SET_OPEN_PAGE_IDS = "oneroost/brandSettingsAdmin/SET_OPEN_PAGE_IDS"

const initialState = fromJS({
    isLoading: false,
    hasLoaded: false,
    openPageIds: [],
    brandPageIds: [],
    brandPageSettingsById: {},
    error: {},
})

const getPageIdFromAction = (action) => {
    try{
        let pageId = action.brandPageId || action.payload.get("objectId") || action.payload.getIn(["brandPage", "objectId"])
        return pageId
    }
    catch (e){
        return null
    }
}

export default function reducer(state=initialState, action){
    const payload = action.payload
    const pageId = getPageIdFromAction(action)
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
        case CREATE_BRAND_PAGE_ERROR:
            state = state.set("error", payload.error)
            break;
        case CREATE_BRAND_PAGE_SUCCESS:
            state = state.setIn(["brandPageSettingsById", pageId], brandPageSettings.default(state.getIn(["brandPageSettingsById", pageId]), action))
            state = state.set("openPageIds", List([pageId]))
            break
        case DELETE_PAGE_SUCCESS:
            state = state.deleteIn(["brandPageSettingsById", pageId])
            break;
        case SET_OPEN_PAGE_IDS:
            state = state.set("openPageIds", fromJS(payload))
            break
        case TOGGLE_PAGE_ID_OPEN:
            let openIds = state.get("openPageIds", List()).toJS()

            if (openIds.indexOf(pageId) === -1){
                openIds.push(pageId)
            }
            else {
                openIds = openIds.filter(id => id !== pageId)
            }
            state = state.set("openPageIds", fromJS(openIds))
            break;
        default:
            if (pageSettingsActionList.indexOf(action.type) !== -1){
                let pageId = getPageIdFromAction(action)
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
        let entities = normalize(pages, [BrandPage.Schema]).entities
        dispatch({
            type: LOAD_BRAND_PAGES_SUCCESS,
            payload: pages,
            entities,
        })

        pages.forEach(page => dispatch({
            type: LOAD_PAGE_SUCCESS,
            payload: page,
            brandPageId: page.objectId
        }))
        if (pages.length === 1){
            dispatch({
                type: SET_OPEN_PAGE_IDS,
                payload: pages.map(page => page.objectId)
            })
        }
        log.info("Success!", pages)
    }).catch(error => {
        log.error("Failed to fetch brand pages for account " + accountId, error)
    })
}

export const createPage = () => (dispatch, getState) => {
    dispatch({
        type: CREATE_BRAND_PAGE_REQUEST
    })
    const state = getState();

    let page = BrandPage.fromJS({
        account: Account.Pointer(state.user.get("accountId")),
        templates: [],
        templateIds: []
    })
    page.save().then(saved => {
        saved = saved.toJSON()
        let entities = normalize(page, BrandPage.Schema).entities
        dispatch({
            type: CREATE_BRAND_PAGE_SUCCESS,
            payload: saved,
            entities,
        })
    }).catch(error => {
        dispatch({
            type: CREATE_BRAND_PAGE_ERROR,
            error: {
                level: "error",
                message: "Failed to create brand page",
                error,
            }
        })
    })
}

export const togglePageOpen = (pageId) => {
    return {
        type: TOGGLE_PAGE_ID_OPEN,
        brandPageId: pageId
    }
}
