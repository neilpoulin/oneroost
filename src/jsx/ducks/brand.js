import Parse from "parse"
import * as BrandPage from "models/BrandPage"
import {Map} from "immutable"
import * as log from "LoggingUtil"

export const LOAD_PAGE_REQUEST = "oneroost/brand/LOAD_PAGE_REQUEST"
export const LOAD_PAGE_SUCCESS = "oneroost/brand/LOAD_PAGE_SUCCESS"
export const LOAD_PAGE_ERROR = "oneroost/brand/LOAD_PAGE_ERROR"

export const initialState = Map({
    vanityUrl: null,
    isLoading: false,
    hasLoaded: false,
    lastLoaded: null,
    brandPageId: null,
    companyName: null,
    description: null,
    descriptionLabel: null,
    logoUrl: null,
    pageTitle: null,
    showOneRoostLink: true,
    showRoostNav: false,
    error: null,
    templates: [],
    templateIds: [],
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
            state = state.set("pageTitle", payload.pageTitle)
            state = state.set("logoUrl", payload.logoUrl)
            state = state.set("brandPageId", payload.objectId)
            state = state.set("showOneRoostLink", !!payload.showOneRoostLink)
            state = state.set("showRoostNav", !!payload.showRoostNav)
            state = state.set("templates", payload.templates)
            state = state.set("companyName", payload.companyName)
            state = state.set("templateIds", payload.templateIds || [])
            state = state.set("description", payload.description)
            state = state.set("descriptionLabel", payload.descriptionLabel)
            break;
        case LOAD_PAGE_ERROR:
            state = state.set("error", action.error)
            state = state.set("isLoading", false)
            break;
        default:
            break;
    }
    return state;
}
// Queries
export const getBrandPageByUrl = (vanityUrl) => {
    let query = new Parse.Query(BrandPage.className)
    query.include("templateIds")
    query.equalTo("vanityUrl", vanityUrl)
    return query.first()
}

export const loadPage = (vanityUrl) => (dispatch, getState) => {
    const currentState = getState().brandsByUrl.get(vanityUrl, initialState)
    if (currentState.isLoading){
        return null;
    }
    dispatch({
        type: LOAD_PAGE_REQUEST,
        vanityUrl,
    });

    getBrandPageByUrl(vanityUrl)
        .then(page => {
            if (!page){
                log.warn("No page found for " + vanityUrl)
                dispatch({
                    type: LOAD_PAGE_ERROR,
                    vanityUrl,
                    error: {
                        level: "ERROR",
                        message: "No page found for url " + vanityUrl
                    }
                })
                return;
            }
            page = page.toJSON()
            dispatch({
                type: LOAD_PAGE_SUCCESS,
                vanityUrl,
                payload: page,
            })
        })
        .catch(error => {
            log.error(error);
            // TODO: handle not found errors, present a friendly page
            dispatch({
                type: LOAD_PAGE_ERROR,
                vanityUrl,
                error: {
                    level: "ERROR",
                    message: "Failed to load brand page",
                    error,
                }
            })
        });
}
