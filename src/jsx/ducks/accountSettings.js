import {fromJS, Map, Set, List} from "immutable"
import {getConfigValue} from "ducks/config"
import * as log from "LoggingUtil"
import Parse from "parse"
import * as Account from "models/Account"
import * as Template from "models/Template"
import {normalize} from "normalizr"
import {SAVE_TEMPLATE_SUCCESS} from "ducks/template"

const DEPARTMENT_MAP_KEY = "departmentMap"
export const LOAD_SETTINGS_REQUEST = "oneroost/accountSettings/LOAD_SETTINGS_REQUEST"
export const LOAD_SETTINGS_SUCCESS = "oneroost/accountSettings/LOAD_SETTINGS_SUCCESS"
export const LOAD_SETTINGS_ERROR = "oneroost/accountSettings/LOAD_SETTINGS_ERROR"
export const SET_ACCOUNT_ID = "oneroost/accountSettings/SET_ACCOUNT_ID"
const initialState = Map({
    templateIds: Set(),
    archivedTemplateIds: Set(),
    isLoading: false,
    accountId: null,
    seatIds: List([]),
    userIds: List([]),
    departmentMap: Map({})
});

export default function reducer(state=initialState, action){
    const payload = action.payload
    switch (action.type) {
        case LOAD_SETTINGS_REQUEST:
            state = state.set("isLoading", true)
            break
        case LOAD_SETTINGS_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("departmentMap", payload.get("departmentMap", Map()))
            state = state.set("templateIds", payload.get("templateIds", Set()).toSet())
            state = state.set("archivedTemplateIds", payload.get("archivedTemplateIds", Set()).toSet())
            state = state.set("error", null)
            break;
        case LOAD_SETTINGS_ERROR:
            state = state.set("isLoading", false)
            state = state.set("error", action.error)
            break;
        case SET_ACCOUNT_ID:
            state = state.set("accountId", payload.get("accountId"))
            break;
        case SAVE_TEMPLATE_SUCCESS:
            var template = action.payload;
            var templateId = template.get("objectId")
            if (template.get("active")){
                state = state.updateIn(["templateIds"], list => list.toSet().add(templateId))
            }
            else {
                state = state.updateIn(["archivedTemplateIds"], list => list.toSet().add(templateId))
            }
            break;
        default:
    }

    return state;
}

// queries
const fetchAccount = (accountId) => {
    let query = new Parse.Query(Account.className)
    query.include("createdBy")
    return query.get(accountId)
}

const findTemplates = (accountId) => {
    let query = new Parse.Query(Template.className)
    query.include("createdBy")
    query.include("modifiedBy")
    query.include("ownedBy")
    query.equalTo("account", Account.Pointer(accountId))
    return query.find()
}

const handleTemplateResponse = (allTemplates) => {
    let templateIdsByStatus = allTemplates.reduce((templateMap, template) => {
        if(template.get("active")){
            templateMap = templateMap.updateIn(["templateIds"], set => set.add(template.id || template.objectId))
        }
        else {
            templateMap = templateMap.updateIn(["archivedTemplateIds"], arr => arr.add(template.id || template.objectId))
        }
        return templateMap;
    }, fromJS({
        templateIds: Set(),
        archivedTemplateIds: Set()
    }))
    return templateIdsByStatus.toJS()
}

export const loadSettings = () => (dispatch, getState) => {
    dispatch({
        type: LOAD_SETTINGS_REQUEST
    })
    const state = getState()
    const accountId = state.user.get("accountId")

    if (!accountId){
        log.warn("No account ID was found for the current user")
        return null
    }
    dispatch({type: SET_ACCOUNT_ID, payload: {accountId}})

    let promises = [
        dispatch(getConfigValue(DEPARTMENT_MAP_KEY, Map())),
        fetchAccount(accountId),
        findTemplates(accountId),
    ]
    Promise.all(promises).then(([departmentMap, account, allTemplates]) => {
        let entities = Map({})
        entities = entities.merge(normalize(account.toJSON(), Account.Schema).entities)
        entities = entities.merge(normalize(allTemplates.map(template => template.toJSON()), [Template.Schema]).entities)
        dispatch({
            type: LOAD_SETTINGS_SUCCESS,
            payload: {
                departmentMap,
                ...handleTemplateResponse(allTemplates)
            },
            entities,
        })
    }).catch(error => {
        log.error("Something unexpected went wrong when loading account settings", error)
        dispatch({
            type: LOAD_SETTINGS_ERROR,
            error: {
                level: "ERROR",
                error: error,
                message: "Failed to load account settings"
            }
        })
    })
}
