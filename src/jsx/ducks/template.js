import Parse from "parse"
import {Map} from "immutable"
import * as Template from "models/Template"
import {normalize} from "normalizr"
import * as log from "LoggingUtil"

export const LOAD_TEMPLATE_REQUEST = "oneroost/template/LOAD_TEMPLATE_REQUEST"
export const LOAD_TEMPLATE_SUCCESS = "oneroost/template/LOAD_TEMPLATE_SUCCESS"
export const LOAD_TEMPLATE_ERROR = "oneroost/template/LOAD_TEMPLATE_ERROR"

export const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    lastLoaded: null,
    error: null,
});

export default function reducer(state=initialState, action){
    switch (action.type) {
        case LOAD_TEMPLATE_REQUEST:
            state = state.set("isLoading", true);
            break;
        case LOAD_TEMPLATE_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("hasLoaded", true)
            state = state.set("lastLoaded", new Date())
            break;
        case LOAD_TEMPLATE_ERROR:
            state = state.set("isLoading", false)
            state = state.set("error", action.error)
            break;
        default:
            break
    }
    return state;
}

// Queries
const getTemplateById = (templateId) => {
    let query = new Parse.Query(Template.className)
    query.include("createdBy")
    query.include("modifiedBy")
    return query.get(templateId)
}

//Actions

export const loadTemplate = (templateId, force=false) => (dispatch, getState) => {
    let {templates} = getState();
    if (templates.has(templateId) && templates.get(templateId).get("hasLoaded") && !force){
        return null
    }
    dispatch({
        type: LOAD_TEMPLATE_REQUEST,
        templateId: templateId
    })

    getTemplateById(templateId)
        .then(template => {
            template = template.toJSON()
            let entities = normalize(template, Template.Schema).entities || {}
            dispatch({
                type: LOAD_TEMPLATE_SUCCESS,
                templateId,
                entities,
                payload: template,
            })
        })
        .catch(error => {
            let level = "SEVERE"
            let message = "Failed to load the template"
            log.warn(error)
            if (error && error.code){
                switch (error.code) {
                    case 101:
                    // not found
                        level = "INFO"
                        message = "Cound not find the proposal"
                        break;
                    default:
                        break;
                }
            }
            dispatch({
                type: LOAD_TEMPLATE_ERROR,
                templateId,
                error: {
                    error: error,
                    message,
                    level,
                }
            })
        })
}
