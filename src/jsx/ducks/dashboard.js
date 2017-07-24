import {fromJS, Set} from "immutable"
import {LOGOUT} from "ducks/user"
import * as User from "models/User"
import * as Account from "models/Account"
import * as Stakeholder from "models/Stakeholder"
import Parse from "parse"
import {normalize} from "normalizr"
import {loadRequirementsForDealIds} from "ducks/roost/requirements"

export const SHOW_ARCHIVED = "oneroost/dashboard/SHOW_ARCHIVED"
export const HIDE_ARCHIVED = "oneroost/dashboard/HIDE_ARCHIVED"
export const SET_SEARCH_TERM = "oneroost/dashboard/SET_SEARCH_TERM"
export const RESET = "oneroost/dashboard/RESET"
export const SET_TEMPALTE_ID = "oneroost/dashboard/SET_TEMPALTE_ID"
export const SET_EXPORT_CSV_DATA = "oneroost/dashboard/SET_EXPORT_CSV_DATA"

export const LOAD_DASHBOARD_REQUEST = "oneroost/dashboard/LOAD_DASHBOARD_REQUEST"
export const LOAD_DASHBOARD_SUCCESS = "oneroost/dashboard/LOAD_DASHBOARD_SUCCESS"
export const LOAD_DASHBOARD_ERROR = "oneroost/dashboard/LOAD_DASHBOARD_ERROR"

const initialState = fromJS({
    isLoading: false,
    sortBy: null,
    searchTerm: "",
    sortDirection: null,
    showArchived: false,
    selectedTemplateId: null,
    roosts: {},
    templateIds: [],
    csvData: null,
    error: null,
});
export default function reducer(state=initialState, action) {
    switch (action.type) {
        case LOAD_DASHBOARD_REQUEST:
            state = state.set("isLoading", true);
            break;
        case LOAD_DASHBOARD_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("stakeholders", action.payload.get("stakeholders"))
            state = state.set("roosts", action.payload.get("roosts"))
            state = state.set("templateIds", action.payload.get("templateIds"))
            break;
        case LOAD_DASHBOARD_ERROR:
            state = state.set("isLoading", false)
            state = state.set("error", action.error)
            break;
        case SHOW_ARCHIVED:
            state = state.set("showArchived", true)
            break;
        case HIDE_ARCHIVED:
            state = state.set("showArchived", false)
            break;
        case LOGOUT:
        case RESET:
            state = initialState;
        case SET_SEARCH_TERM:
            state = state.set("searchTerm", action.payload)
            break;
        case SET_TEMPALTE_ID:
            state = state.set("selectedTemplateId", action.payload.get("templateId"))
            break;
        case SET_EXPORT_CSV_DATA:
            let data = action.payload
            if(data){
                data = "data:text/csv;charset=utf-8," + data
            }
            state = state.set("csvData", data)
            break;
        default:
            break;
    }
    return state;
}

// Queries
function getRoostsForAccount(accountId){
    let accountUserQuery = new Parse.Query(User.className)
    accountUserQuery.equalTo("account", Account.Pointer(accountId))

    let query = new Parse.Query("Stakeholder")
    query.matchesQuery("user", accountUserQuery)
        .include("deal.template")
        .include("user")
        .include("template")
        .include("invitedBy.account")
    return query.find()
}

export const searchOpportunities = (query) => (dispatch, getState) => {
    dispatch({
        type: SET_SEARCH_TERM,
        payload: query
    });
}

export const setShowArchived = (showArchived) => (dispatch, getState) => {
    if (showArchived){
        dispatch({
            type: SHOW_ARCHIVED
        })
    }
    else {
        dispatch({
            type: HIDE_ARCHIVED
        })
    }
}

export const setTemplateId = (templateId) => {
    return {
        type: SET_TEMPALTE_ID,
        payload: {
            templateId,
        }
    }
}

export const setExportCsvData = (data) => {
    return {
        type: SET_EXPORT_CSV_DATA,
        payload: data
    }
}

export function loadDashboard(){
    return (dispatch, getState) => {
        dispatch({type: LOAD_DASHBOARD_REQUEST})
        const state = getState()
        let accountId = state.user.get("accountId");
        let currentUserId = state.user.get("userId");
        if (!accountId){
            throw new Error("No account ID Oh my!!!")
        }
        getRoostsForAccount(accountId).then(stakeholders => {
            stakeholders = stakeholders.map(p => p.toJSON())
            let templateIds = Set([])
            let dealIds = stakeholders.map(stakeholder => stakeholder.deal.objectId)
            dispatch(loadRequirementsForDealIds(dealIds))
            let roosts = stakeholders.reduce((map, stakeholder) => {
                let dealId = stakeholder.deal.objectId;
                templateIds = templateIds.add(stakeholder.deal.template.objectId)
                if (!map.hasOwnProperty(dealId)){
                    let {
                        dealName,
                        budget: {low: budgetLow, budgetHigh},
                        lastActiveAt,
                        readyRoostSubmitted,
                        department,
                        departmentCategory,
                        departmentSubCategory,
                    } = stakeholder.deal

                    let roost = {
                        dealId,
                        templateId: stakeholder.deal.template.objectId,
                        templateOwner: stakeholder.deal.template ? stakeholder.deal.template.ownedBy : null,
                        dealName,
                        budgetLow,
                        budgetHigh,
                        lastActiveAt,
                        readyRoostSubmitted,
                        department,
                        departmentCategory,
                        departmentSubCategory,
                        approver: stakeholder.readyRoostApprover,
                        stakeholders: [],
                        hasAccess: false,
                        status: "NOT SET",
                        deal: stakeholder.deal,
                        requirements: [],
                    }

                    map[dealId] = roost
                }

                let roost = map[dealId]
                // set up user specific stuff
                roost.stakeholders.push(stakeholder.user)
                if (stakeholder.user.objectId === currentUserId){
                    let isApprover = stakeholder.readyRoostApprover ? stakeholder.user.objectId === currentUserId : false
                    roost = {...roost,
                        archived: !stakeholder.active,
                        inviteAccepted: stakeholder.inviteAccepted,
                        isApprover,
                        invitedByUserId: stakeholder.invitedBy ? stakeholder.invitedBy.objectId : null,
                        invitedByUserEmail: stakeholder.invitedBy ? stakeholder.invitedBy.username : null,
                        hasAccess: true,
                    }
                }
                map[dealId] = roost
                return map
            }, {})

            dispatch({
                type: LOAD_DASHBOARD_SUCCESS,
                payload: {
                    stakeholders,
                    roosts,
                    templateIds,
                },
                entities: normalize(stakeholders, [Stakeholder.Schema]).entities
            })
        }).catch(error => {
            dispatch({
                type: LOAD_DASHBOARD_ERROR,
                error: {
                    level: "error",
                    message: "Something went wrong loading the dashboard",
                    error,
                }
            })
        })
    }
}
