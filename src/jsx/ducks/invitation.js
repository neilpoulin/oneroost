import {Map, List} from "immutable"
import Parse from "parse"
import {normalize} from "normalizr"
import * as Stakeholder from "models/Stakeholder"
import * as log from "LoggingUtil"
import {logInAsUser, createPassword} from "ducks/user"
import {createComment} from "ducks/roost/comments"
import * as RoostUtil from "RoostUtil"

export const LOAD_REQUEST = "oneroost/invitation/LOAD_REQUEST"
export const LOAD_SUCCESS = "oneroost/invitation/LOAD_SUCCESS"
export const LOAD_ERROR = "oneroost/invitation/LOAD_ERROR"
export const INVITE_ACCEPTED_SUCCESS = "oneroost/invitation/INVITE_ACCEPTED_SUCCESS"
export const INVITE_ACCEPTED_ERROR = "oneroost/invitation/INVITE_ACCEPTED_ERROR"
export const SUBMIT_INVITE_REQUEST = "oneroost/invititation/SUBMIT_INVITE_REQUEST"
export const SUBMIT_INVITE_SUCCESS = "oneroost/invititation/SUBMIT_INVITE_SUCCESS"
export const SUBMIT_INVITE_ERROR = "oneroost/invititation/SUBMIT_INVITE_ERROR"

export const initialState = Map({
    isLoading: false,
    isSaving: false,
    hasLoaded: false,
    lastLoaded: null,
    inviteAccepted: false,
    stakeholderId: null,
    dealId: null,
    invitedBy: null,
    error: null,
    ids: List([]),
})

export default function reducer(state=initialState, action){
    switch (action.type) {
        case LOAD_REQUEST:
            state = state.set("isLoading", true)
            break;
        case LOAD_SUCCESS:
            var stakeholder = action.payload
            state = state.set("hasLoaded", true)
            state = state.set("isLoading", false)
            state = state.set("lastLoaded", new Date())
            state = state.set("error", null)
            state = state.set("stakeholderId", stakeholder.get("objectId"))
            state = state.set("dealId", stakeholder.get("deal").get("objectId"))
            state = state.set("invitedBy", stakeholder.get("invitedBy").get("objectId"))
            state = state.set("inviteAccepted", stakeholder.get("inviteAccepted") || false)
            break;
        case LOAD_ERROR:
            state = state.set("isLoading", false)
            state = state.set("error", action.error)
            break;
        case INVITE_ACCEPTED_SUCCESS:
            state = state.set("inviteAccepted", true)
        case INVITE_ACCEPTED_ERROR:
            state = state.set("error", action.error)
        case SUBMIT_INVITE_REQUEST:
            state = state.set("isSaving", true)
            state = state.set("error", null)
        case SUBMIT_INVITE_SUCCESS:
            state = state.set("isSaving", false)
            state = state.set("error", null)
        case SUBMIT_INVITE_ERROR:
            state = state.set("isSaving", false)
            state = state.set("error", action.error)
        default:
            break;
    }
    return state;
}


// queries
const fetchStakeholderById = (stakeholderId) => {
    var stakeholderQuery = new Parse.Query("Stakeholder");
    stakeholderQuery.include("user");
    stakeholderQuery.include("deal");
    stakeholderQuery.include("invitedBy");
    return stakeholderQuery.get(stakeholderId)
}

// action creators
const acceptInviteRequest = (stakeholderId) => {
    return {
        type: SUBMIT_INVITE_REQUEST,
        stakeholderId,
    }
}

const acceptInviteSuccess = (stakeholderId) => {
    return {
        type: SUBMIT_INVITE_SUCCESS,
        stakeholderId,
    }
}

const invitationLoadRequestAction = (stakeholderId) => {
    return {
        type: LOAD_REQUEST,
        stakeholderId,
    }
}

const stakeholderLoadSuccessAction = (stakeholder) => {
    stakeholder = stakeholder.toJSON();
    let entities = normalize(stakeholder, Stakeholder.Schema).entities
    return {
        type: LOAD_SUCCESS,
        stakeholderId: stakeholder.objectId,
        payload: stakeholder,
        dealId: stakeholder.deal.objectId,
        entities,
    }
}

const stakeholderLoadError = (stakeholderId, error) => {
    return {
        type: LOAD_ERROR,
        stakeholderId,
        error: {
            level: "ERROR",
            message: "Failed to load stakeholder",
            error,
        }
    }
}

const acceptInviteSuccessAction = (stakeholderId) => {
    return {
        type: INVITE_ACCEPTED_SUCCESS,
        stakeholderId,
    }
}

const acceptInviteErrorAction = (stakeholderId, error) => {
    return {
        type: INVITE_ACCEPTED_ERROR,
        error: {
            error,
            message: "Somethign went wrong while saving the stakeholder after accepting the invite",
            level: "ERROR"
        }
    }
}

export const loadInvitationByStakeholderId = (stakeholderId, force=false) => (dispatch, getState) => {
    let {invitationsByStakeholder} = getState();
    if ( invitationsByStakeholder.has(stakeholderId) && !force ){
        return null
    }
    dispatch(invitationLoadRequestAction(stakeholderId))

    fetchStakeholderById(stakeholderId)
    .then(stakeholder => {
        dispatch(stakeholderLoadSuccessAction(stakeholder))
    }).catch(error => {
        log.error(error);
        dispatch(stakeholderLoadError(stakeholderId, error))
    })
}

export const acceptInvite = (stakeholderJSON) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        let stakeholder = Stakeholder.fromJSON(stakeholderJSON)
        stakeholder.set({"inviteAccepted": true})
        stakeholder.save().then(success => {
            dispatch(acceptInviteSuccessAction(stakeholder.id))
            let message = RoostUtil.getFullName(stakeholderJSON.user) + " has accepted their invitation."
            dispatch(createComment({
                deal: stakeholder.get("deal"),
                message: message,
                author: null,
                username: "OneRoost Bot",
                navLink: {type:"participant"}
            }))

            resolve(stakeholder)
        }).catch(error => {
            dispatch(acceptInviteErrorAction(stakeholder.id, error))
            reject()
        })
    })
}

export const submitInviteAccept = (stakeholder, password) => (dispatch, getState) => {
    const {isLoggedIn} = getState().user.toJS()
    const {user} = stakeholder
    const userId = user.objectId
    dispatch(acceptInviteRequest(stakeholder.objectId))
    return new Promise((resolve, reject) => {
        // TODO: don't nest these promises
        if ( user.passwordChangeRequired && !isLoggedIn ){
            dispatch(createPassword(user, password, true)).then(() => {
                dispatch(logInAsUser(userId, password)).then(() => {
                    dispatch(acceptInvite(stakeholder)).then(() => {
                        resolve(dispatch(acceptInviteSuccess(stakeholder.objectId)))
                    })
                })
            }).catch(error => {
                log.error(error)
            })
        }
        else if (!isLoggedIn) {
            dispatch(logInAsUser(userId, password)).then(() => {
                dispatch(acceptInvite(stakeholder)).then(() => {
                    resolve(dispatch(acceptInviteSuccess(stakeholder.objectId)))
                })
            }).catch(error => {
                log.error(error)
                reject()
            })
        }
        else if (isLoggedIn){
            dispatch(acceptInvite(stakeholder)).then(() => {
                resolve(dispatch(acceptInviteSuccess(stakeholder.objectId)))
            })
        }
    })
}
