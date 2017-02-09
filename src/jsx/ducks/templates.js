import Parse from "parse"
import {Map, Set} from "immutable"
import * as User from "models/User"
import * as Template from "models/Template"
import {normalize} from "normalizr"

export const LOAD_TEMPLATES_REQUEST = "oneroost/templates/LOAD_TEMPLATES_REQUEST"
export const LOAD_TEMPLATES_SUCCESS = "oneroost/templates/LOAD_TEMPLATES_SUCCESS"
export const LOAD_TEMPLATES_ERROR = "oneroost/templates/LOAD_TEMPLATES_ERROR"
export const ADD_TEMPLATE = "oneroost/templates/ADD_TEMPLATE"
export const ARCHIVE_TEMPLATE = "oneroost/templates/ARCHIVE_TEMPLATE"
export const UNARCHIVE_TEMPLATE = "oneroost/templates/UNARCHIVE_TEMPLATE"

const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    lastLoaded: null,
    archivedVisible: false,
    templateIds: Set([]),
    archivedTemplateIds: Set([]),
});

export default function reducer(state=initialState, action){
    switch (action.type) {
        case LOAD_TEMPLATES_REQUEST:
            state = state.set("isLoading", true);
            break;
        case LOAD_TEMPLATES_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("hasLoaded", true)
            var activeIds = action.payload.filter(template => template.get("active") !== false ).map(template => template.get("objectId") || template.id)
            var archivedIds = action.payload.filter(template => template.get("active") === false ).map(template => template.get("objectId") || template.id)
            state = state.set("templateIds", Set(activeIds))
            state = state.set("archivedDeals", Set(archivedIds))
            break;
        case LOAD_TEMPLATES_ERROR:
            state = state.set("isLoading", true);
            break;
        default:
            break
    }
    return state;
}

// Queries
const templatesByUserQuery = (userId) => {
    let query = new Parse.Query(Template.className)
    query.include("createdBy")
    query.include("modifiedBy")
    query.equalTo("createdBy", User.Pointer(userId))
    return query
}

// Action creators
export const loadTemplates = (userId, force=false) => (dispatch, getState) =>{
    let {templatesByUser} = getState();
    if ( templatesByUser.has(userId) && templatesByUser.get(userId).get("hasLoaded") && !force ){
        console.warn("not loading templates as they are already loaded.")
        return null
    }
    dispatch({
        type: LOAD_TEMPLATES_REQUEST,
        userId: userId
    })

    let query = templatesByUserQuery(userId)
    query.find().then(templates => {
        templates = templates.map(template => template.toJSON())
        let entities = normalize(templates, [Template.Schema]).entities || {}

        dispatch({
            type: LOAD_TEMPLATES_SUCCESS,
            userId,
            entities,
            payload: templates,
        })
    }).catch(error => {
        console.error(error);
        dispatch({
            type: LOAD_TEMPLATES_ERROR,
            userId,
            error: {
                message: "Failed to fetch templates",
                level: "ERROR",
                error: error,
            }
        })
    });

}
