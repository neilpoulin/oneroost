import union from "lodash/union"
import Parse from "parse"
import {normalize} from "normalizr"
import * as Deal from "models/Deal"
import {Pointer} from "models/Models"
import * as NextStep from "models/NextStep"

export const ADD_NEXT_STEP = "ADD_NEXT_STEP"
export const STEP_LOAD_REQUEST = "STEP_LOAD_REQUEST"
export const STEP_LOAD_SUCCESS = "STEP_LOAD_SUCCESS"
export const STEP_LOAD_ERROR = "STEP_LOAD_ERROR"

const initialState = {
    isLoading: false,
    ids: []
};
export default function reducer(state=initialState, action){
    switch (action.type) {
        case ADD_NEXT_STEP:
            let {payload} = action;
            return {
                ...state,
                ids: union(state.ids, payload.id)
            }
        case STEP_LOAD_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case STEP_LOAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                ids: action.payload.map(step => step.objectId)
            }
        case STEP_LOAD_ERROR:
            return {
                ...state,
                isLoading: false
            }
        default:
            return state;
    }
}


// Actions
export const loadNextSteps = (dealId) => (dispatch) => {
    dispatch({
        type: STEP_LOAD_REQUEST,
        dealId: dealId
    })
    let stepQuery = new Parse.Query(NextStep.className)
    stepQuery.equalTo( "deal", Pointer(Deal.className, dealId));
    stepQuery.ascending("dueDate");
    stepQuery.find().then(steps => {
        let json = steps.map(step => step.toJSON())
        let normalized = normalize(steps, [NextStep.Schema])
        dispatch({
            type: STEP_LOAD_SUCCESS,
            payload: json,
            dealId: dealId,
            entities: normalized.entities || {}
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
    return {
        type: ADD_NEXT_STEP,
        dealId: step.get("deal").id,
        payload: step
    }
}

export const createNextStep = (nextStep) => {
    return (dispatch) => {
        let step = new NextStep();
        step.set(nextStep);
        step.save().then( saved => {
            dispatch(addNextStep(saved))
        })
    }
}
