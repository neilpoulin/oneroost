import { normalize } from "normalizr"
import {getActions} from "DuckUtil"
import * as comments from "ducks/roost/comments"
import * as nextSteps from "ducks/roost/nextSteps"
import * as documents from "ducks/roost/documents"
import * as stakeholders from "ducks/roost/stakeholders"
import * as requirements from "ducks/roost/requirements"
import Parse from "parse"
import * as Deal from "models/Deal"
import * as Account from "models/Account"
import { Map } from "immutable"
import * as log from "LoggingUtil"
import * as RoostUtil from "RoostUtil"
import ReactGA from "react-ga"


export const DEAL_LOAD_REQUEST = "oneroost/roost/DEAL_LOAD_REQUSET"
export const DEAL_LOAD_SUCCESS = "oneroost/roost/DEAL_LOAD_SUCCESS"
export const DEAL_LOAD_ERROR = "oneroost/roost/DEAL_LOAD_ERROR"
export const DEAL_UPDATED = "oneroost/roost/DEAL_UPDATED"

export const roostActions = [
    ...getActions(comments),
    ...getActions(nextSteps),
    ...getActions(stakeholders),
    ...getActions(documents),
    ...getActions(requirements),
    DEAL_LOAD_REQUEST,
    DEAL_LOAD_SUCCESS,
    DEAL_LOAD_ERROR,

];

const initialState = Map({
    dealLoading: false,
    hasLoaded: false,
    error: null,
    comments: comments.initialState,
    nextSteps: nextSteps.initialState,
    documents: documents.initialState,
    stakeholders: stakeholders.initialState,
    requirements: requirements.initialState,
})

export const createRoost = (opts) => (dispatch, getState) => {
    let currentUser = Parse.User.current()
    let account = Account.fromJS({
        createdBy: currentUser,
        accountName: opts.accountName,
        primaryContact: opts.primaryContact,
        streetAddress: opts.streetAddress,
        city: opts.city,
        state: opts.state,
        zipCode: opts.zipCode,
    })
    account.save().then(account => {
        log.info("account created", account)
        let deal = Deal.fromJS({
            createdBy: currentUser,
            dealName: opts.dealName,
            account: account,
            profile: {"timeline": "2016-05-13"},
            budget: {"low": 0, "high": 0}
        })
        //TODO: dispatch account created
        deal.save().then(deal => {
            log.info("deal created")
            //TODO: dispatch deal created
            dispatch(stakeholders.createStakeholder({
                deal: deal,
                user: currentUser,
                inviteAccepted: true,
                role: "CREATOR",
                invitedBy: currentUser,
                active: true,
            }))
        })
    }).catch(log.error)
}

export const updateDeal = (dealJSON, changes, message, type) => (dispatch, getState) => {
    let deal = Deal.fromJS(dealJSON);
    deal.set(changes);
    deal.save().then(saved => {}).catch(log.error)
    let entities = normalize(deal.toJSON(), Deal.Schema).entities
    dispatch({
        type: DEAL_UPDATED,
        entities: entities,
        dealId: dealJSON.objectId
    });
    if ( message ){
        let comment = {
            deal: deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
        }
        if ( type ){
            comment.navLink = {type: type}
        }

        dispatch(comments.createComment(comment))
    }
}

export const loadDeal = (dealId, force=false) => {
    return (dispatch, getState) => {
        let {roosts} = getState();
        if ( roosts.has(dealId) && roosts.get(dealId).get("hasLoaded") && !roosts.get(dealId).get("isLoading") && !force ){
            log.warn("not loading deal, already loaded")
            return null
        }
        dispatch({
            type: DEAL_LOAD_REQUEST,
            dealId: dealId
        });

        let dealQuery = new Parse.Query(Deal.className);
        dealQuery.include("readyRoostUser");
        dealQuery.include("createdBy");
        dealQuery.include("account");
        dealQuery.get(dealId).then(deal => {
            let json = deal.toJSON()
            let normalized = normalize(json, Deal.Schema);
            dispatch({
                type: DEAL_LOAD_SUCCESS,
                payload: json,
                dealId: dealId,
                entities: normalized.entities || {}
            })
        }).catch(error => {
            log.error(error);
            dispatch({
                type:DEAL_LOAD_ERROR,
                error: error,
                dealId: dealId
            })
        });
    }
}

export const submitReadyRoost = (stakeholder, deal) => (dispatch, getState) => {
    Parse.Cloud.run("submitReadyRoost", {
        dealId: deal.objectId,
        stakeholderId: stakeholder.objectId
    }).then(function( result ) {
        log.info(result);
        alert("We have let " + RoostUtil.getFullName(stakeholder.user) + " know that the Roost is ready for them to review.")

        dispatch(updateDeal(deal, {readyRoostSubmitted: new Date()}, "The opportunity has been submitted"))

        ReactGA.set({ userId: Parse.User.current().objectId });
        ReactGA.event({
          category: "ReadyRoost",
          action: "Submitted ReadyRoost"
        });
    });
}

const roostReducer = (state=initialState, action) => {
    switch (action.type) {
        case DEAL_LOAD_REQUEST:
            state = state.set("dealLoading", true)
            break;
        case DEAL_LOAD_SUCCESS:
            state = state.set("dealLoading", false);
            state = state.set("hasLoaded", true);
            state = state.set("error", null);
            break;
        case DEAL_LOAD_ERROR:
            let error = action.payload;
            state = state.set("dealLoading", false);
            state = state.set("error", {
                level: "ERROR",
                message: "Failed to fetch the roost",
                error: error
            })
            break;
        case DEAL_UPDATED:
        default:
            return state;
    }
    return state;
}
const roost = (state=initialState, action) => {
    state = roostReducer(state, action)

    state = state.set("comments", comments.default(state.get("comments"), action))
    state = state.set("nextSteps", nextSteps.default(state.get("nextSteps"), action))
    state = state.set("documents",documents.default(state.get("documents"), action))
    state = state.set("stakeholders", stakeholders.default(state.get("stakeholders"), action))
    state = state.set("requirements", requirements.default(state.get("requirements"), action))
    return state;
}
export default roost;
