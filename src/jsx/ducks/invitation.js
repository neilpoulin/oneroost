import {Map, List} from "immutable"
import Parse from "parse"
import {normalize} from "normalizr"
import * as Stakeholder from "models/Stakeholder"
import * as log from "LoggingUtil"

export const LOAD_REQUEST = "oneroost/invitation/LOAD_REQUEST"
export const LOAD_SUCCESS = "oneroost/invitation/LOAD_SUCCESS"
export const LOAD_ERROR = "oneroost/invitation/LOAD_ERROR"
export const INVITE_ACCEPTED_SUCCESS = "oneroost/invitation/INVITE_ACCEPTED_SUCCESS"
export const INVITE_ACCEPTED_ERROR = "oneroost/invitation/INVITE_ACCEPTED_ERROR"

export const initialState = Map({
    isLoading: false,
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
            state.set("error", action.error)
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

export const acceptInvite = (stakeholder) => (dispatch, getState) => {
    stakeholder = Stakeholder.fromJSON(stakeholder)
    stakeholder.set("inviteAccepted", true)
    stakeholder.save().then(success => {
        dispatch(acceptInviteSuccessAction(stakeholder.objectId))
    }).error(error => {
        dispatch(acceptInviteErrorAction(stakeholder.objetId, error))
    })
}
