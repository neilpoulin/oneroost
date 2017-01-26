import Parse from "parse"
import {normalize} from "normalizr"
import * as Deal from "models/Deal"
import {Pointer} from "models/modelUtil"
import * as NextStep from "models/NextStep"
import {Map, List} from "immutable"
import {createComment} from "ducks/comments"
import RoostUtil from "RoostUtil"

export const ADD_NEXT_STEP = "oneroost/nextSteps/ADD_NEXT_STEP"
export const STEP_LOAD_REQUEST = "oneroost/nextSteps/STEP_LOAD_REQUEST"
export const STEP_LOAD_SUCCESS = "oneroost/nextSteps/STEP_LOAD_SUCCESS"
export const STEP_LOAD_ERROR = "oneroost/nextSteps/STEP_LOAD_ERROR"
export const STEP_CHANGED = "oneroost/nextSteps/STEP_CHANGED"

export const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    ids: List([])
})
export default function reducer(state=initialState, action){
    switch (action.type) {
        case ADD_NEXT_STEP:
            let {payload} = action;
            state = state.set("ids", state.get("ids").push(payload.get("objectId")))
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


// Actions
export const stepChangedAction = (step) => {
    // this takes a parse object
    let stepJSON = RoostUtil.toJSON(step)
    let entities = normalize(stepJSON, NextStep.Schema).entities
    return {
        type: STEP_CHANGED,
        entities: entities,
        dealId: stepJSON.deal.objectId
    }
}

export const updateStep = (currentStep, changes, message) => (dispatch, getState) => {
    let step = NextStep.fromJS(currentStep);
    step.set(changes)
    step.save().then(saved => {
    }).catch(console.error)

    dispatch(stepChangedAction(step))

    dispatch(createComment({
        deal: step.get("deal"),
        message: message,
        author: null,
        username: "OneRoost Bot",
        navLink: {type: "step", id: step.id}
    }))
}

export const loadNextSteps = (dealId, force=false) => (dispatch, getState) => {
    let {roosts} = getState();
    if ( roosts.has(dealId) && roosts.get(dealId).get("nextSteps").get("hasLoaded") && !roosts.get(dealId).get("nextSteps").get("isLoading") && !force ){
        console.warn("not loading steps as they are already loaded")
        return null
    }

    dispatch({
        type: STEP_LOAD_REQUEST,
        dealId: dealId
    })
    let stepQuery = new Parse.Query(NextStep.className)
    stepQuery.equalTo( "deal", Pointer(Deal.className, dealId));
    stepQuery.ascending("dueDate");
    stepQuery.find().then(steps => {
        let json = steps.map(step => step.toJSON())
        let entities = normalize(json, [NextStep.Schema]).entities || {}
        dispatch({
            type: STEP_LOAD_SUCCESS,
            payload: List(json.map(Map)),
            dealId: dealId,
            entities: Map(entities)
        })

    }).catch(error => {
        console.error(error);
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


export const addNextStep = (step) => {
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
        step.save().then( saved => {
            var message = RoostUtil.getFullName(saved.get("createdBy")) + " created Next Step: " + saved.get("title")
            dispatch(addNextStep(saved))
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
