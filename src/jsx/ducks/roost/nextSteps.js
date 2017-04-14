import Parse from "parse"
import {normalize} from "normalizr"
import * as Deal from "models/Deal"
import {Pointer} from "models/modelUtil"
import * as NextStep from "models/NextStep"
import {Map, List} from "immutable"
import {createComment} from "ducks/roost/comments"
import {addSubscription, handler} from "ducks/subscriptions"
import * as RoostUtil from "RoostUtil"
import {LOADED_ENTITIES} from "ducks/entities"
import * as log from "LoggingUtil"

export const ADD_NEXT_STEP = "oneroost/nextSteps/ADD_NEXT_STEP"
export const STEP_LOAD_REQUEST = "oneroost/nextSteps/STEP_LOAD_REQUEST"
export const STEP_LOAD_SUCCESS = "oneroost/nextSteps/STEP_LOAD_SUCCESS"
export const STEP_LOAD_ERROR = "oneroost/nextSteps/STEP_LOAD_ERROR"
export const STEP_CHANGED = "oneroost/nextSteps/STEP_CHANGED"
export const STEP_DELETED = "oneroost/nextSteps/STEP_DELETED"

export const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    ids: List([])
})
export default function reducer(state=initialState, action){
    switch (action.type) {
        case ADD_NEXT_STEP:
            var {payload} = action;
            state = state.set("ids", state.get("ids").push(payload.get("objectId")))
            break;
        case STEP_DELETED:
            var {payload} = action;
            state = state.set("ids", state.get("ids").filterNot(id => id === payload.get("objectId")))
            break;
        case STEP_LOAD_REQUEST:
            state = state.set("isLoading", true);
            break;
        case STEP_LOAD_SUCCESS:
            state = state.set("isLoading", false);
            state = state.set("hasLoaded", true);
            state = state.set("ids", List(action.payload.map(step => step.get("objectId"))))
            break;
        case STEP_LOAD_ERROR:
            state = state.set("isLoading", false);
            break;
        case STEP_LOAD_SUCCESS:
            break;
        default:
            break;
    }
    return state;
}

//queries
const stepQuery = (dealId) => {
    let query = new Parse.Query(NextStep.className)
    query.equalTo("deal", Pointer(Deal.className, dealId));
    query.ascending("dueDate");
    return query;
}

const stepsForDealsQuery = (dealIds) => {
    let pointers = dealIds.map(dealId => Pointer(Deal.className, dealId))
    let query = new Parse.Query(NextStep.className)
    query.containedIn("deal", pointers)
    query.ascending("dueDate");
    return query;
}

// Actions
export const stepChangedAction = (step) => {
    // this takes a parse object
    let stepJSON = RoostUtil.toJSON(step)
    let entities = normalize(stepJSON, NextStep.Schema).entities
    return {
        type: STEP_CHANGED,
        entities: entities,
        dealId: stepJSON.deal.objectId,
    }
}
export const stepDeletedAction = (step) => {
    let stepJSON = RoostUtil.toJSON(step)
    let entities = normalize(stepJSON, NextStep.Schema).entities
    return {
        type: STEP_DELETED,
        entities: entities,
        dealId: stepJSON.deal.objectId,
        payload: stepJSON,
    }
}

export const updateStep = (currentStep, changes, message) => (dispatch, getState) => {
    let step = NextStep.fromJS(currentStep);
    step.set(changes)
    step.save().then(saved => {
    }).catch(log.error)

    dispatch(stepChangedAction(step))

    dispatch(createComment({
        deal: step.get("deal"),
        message: message,
        author: null,
        username: "OneRoost Bot",
        navLink: {type: "step", id: step.id}
    }))
}

export const deleteStep = (step, message) => (dispatch, getState) => {
    step = NextStep.fromJS(step);
    step.set("active", false);
    step.save().then(saved => {}).catch(log.error)

    dispatch(stepDeletedAction(step));

    dispatch(createComment({
        deal: step.get("deal"),
        message: message,
        author: null,
        username: "OneRoost Bot",
        navLink: {type: "step", id: step.id}
    }))
}

export const loadNextStepsForDeals = (dealIds=[]) => (dispatch, getState) => {
    let {roosts} = getState();
    let dealIdsToLoad = dealIds.filter(dealId => {
        // no roost exists, OR it does exist and steps have NOT been loaded AND steps are NOT loading
        return !roosts.has(dealId) || !roosts.get(dealId).get("nextSteps").get("hasLoaded") && !roosts.get(dealId).get("nextSteps").get("isLoading")
    });

    let query = stepsForDealsQuery(dealIds);
    let findResults = query.find()
    //notify that we're loading steps for the deals
    dealIdsToLoad.forEach(id => {
        dispatch({
            type: STEP_LOAD_REQUEST,
            dealId: id
        })
    })
    findResults.then(results => {
        let json = results.map(step => step.toJSON())
        let entities = normalize(json, [NextStep.Schema]).entities || {}

        // dispatch the loaded entities
        dispatch({
            type: LOADED_ENTITIES,
            entities
        })
    }).catch(log.error)
}

export const loadNextSteps = (dealId, force=false) => (dispatch, getState) => {
    let {roosts} = getState();
    if (roosts.has(dealId) && roosts.get(dealId).get("nextSteps").get("hasLoaded") && !roosts.get(dealId).get("nextSteps").get("isLoading") && !force){
        log.warn("not loading steps as they are already loaded")
        return null
    }

    dispatch({
        type: STEP_LOAD_REQUEST,
        dealId: dealId
    })
    let query = stepQuery(dealId)
    query.find().then(steps => {
        let json = steps.map(step => step.toJSON())
        let entities = normalize(json, [NextStep.Schema]).entities || {}
        dispatch({
            type: STEP_LOAD_SUCCESS,
            payload: List(json.map(Map)),
            dealId: dealId,
            entities: Map(entities)
        })
    }).catch(error => {
        log.error(error);
        dispatch({
            type: STEP_LOAD_ERROR,
            error: {
                error: error,
                message: "Failed to load next steps",
                level: "ERROR"
            }
        })
    });
}

export const addNextStepAction = (step) => {
    let entities = normalize(step.toJSON(), NextStep.Schema).entities
    return {
        type: ADD_NEXT_STEP,
        dealId: step.get("deal").id,
        entities,
        payload: step
    }
}

export const createNextStep = (nextStep) => {
    return (dispatch) => {
        let step = NextStep.fromJS(nextStep)
        step.save().then(saved => {
            var message = RoostUtil.getFullName(Parse.User.current()) + " created Next Step: " + saved.get("title")
            // dispatch(addNextStepAction(saved))
            dispatch(createComment({
                deal: saved.get("deal"),
                message: message,
                author: null,
                username: "OneRoost Bot",
                navLink: {type: "step", id: saved.id }
            }))
        })
    }
}

export const subscribeNextSteps = (dealId) => {
    return (dispatch, getState) => {
        const query = stepQuery(dealId)
        dispatch(addSubscription("NEXT_STEPS", dealId, query, handler({
            create: (result) => dispatch(addNextStepAction(result)),
            delete: (step) => dispatch(stepDeletedAction(step)),
            update: (step) => dispatch(stepChangedAction(step)),
        })))
    }
}
