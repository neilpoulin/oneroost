import Parse from "parse"
import {normalize} from "normalizr"
import * as Deal from "models/Deal"
import {Pointer} from "models/Models"
import * as NextStep from "models/NextStep"
import {Map, List} from "immutable"

export const ADD_NEXT_STEP = "ADD_NEXT_STEP"
export const STEP_LOAD_REQUEST = "STEP_LOAD_REQUEST"
export const STEP_LOAD_SUCCESS = "STEP_LOAD_SUCCESS"
export const STEP_LOAD_ERROR = "STEP_LOAD_ERROR"

export const initialState = Map({
    isLoading: false,
    ids: List([])
})
export default function reducer(state=initialState, action){
    switch (action.type) {
        case ADD_NEXT_STEP:
            let {payload} = action;
            state = state.set("ids", state.get("ids").push(payload.id))
            break;
        case STEP_LOAD_REQUEST:
            state = state.set("isLoading", true);
            break;
        case STEP_LOAD_SUCCESS:
            state = state.set("isLoading", true);
            state = state.set("ids", List(action.payload.map(step => step.get("objectId"))))
            break;
        case STEP_LOAD_ERROR:
            state = state.set("isLoading", false);
            break;
        default:
            break;
    }
    return state;
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
