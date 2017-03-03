import {Map} from "immutable"
import Parse from "parse"
// import * as RoostUtil from "RoostUtil"
// import {normalize} from "normalizr"
import * as log from "LoggingUtil"
import {LOGIN_SUCCESS, UPDATE_USER, saveUser} from "ducks/user"


export const SELECT_PLAN = "oneroost/payment/SELECT_PLAN"

export const CREATE_CUSTOMER_REQUEST = "oneroost/payment/CREATE_CUSTOMER_REQUEST"
export const CREATE_CUSTOMER_SUCCESS = "oneroost/payment/CREATE_CUSTOMER_SUCCESS"
export const CREATE_CUSTOMER_ERROR = "oneroost/payment/CREATE_CUSTOMER_ERROR"

const initialState = Map({
    currentPlanId: null,
    selectedPlanId: null,
    isLoading: false,
    customerId: null,
    hasPaid: false,
    couponCode: null
});

export default function reducer(state=initialState, action){
    const payload = action.payload
    switch (action.type) {
        case UPDATE_USER:
        case LOGIN_SUCCESS:
            var user = action.payload
            state = state.set("customerId", user.get("stripeCustomerId"))
            state = state.set("currentPlanId", user.get("stripePlanId"))
            break;
        case SELECT_PLAN:
            state = state.set("selectedPlanId", payload.get("planId"))
            break;
        case CREATE_CUSTOMER_REQUEST:
            state = state.set("isLoading", true);
            state = state.set("customerId", payload)
            break;
        case CREATE_CUSTOMER_SUCCESS:
            state = state.set("isLoading", false);
            break;
        case CREATE_CUSTOMER_ERROR:
            state = state.set("isLoading", false);
            break;
        default:
            state = state;
            break;
    }
    return state
}

// Action creators
export const selectPlanRequest = (planId) => {
    return {
        type: SELECT_PLAN,
        payload: {planId}
    }
}

export const createCustomer = () => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: CREATE_CUSTOMER_REQUEST,
        })
        Parse.Cloud.run("createCustomer", {}).then(({success, customerId}) => {
            log.info(success)
            dispatch({
                type: CREATE_CUSTOMER_SUCCESS,
                payload: customerId,
            })
            dispatch(saveUser({stripeCustomerId: customerId}))
            resolve(customerId);
        }).catch(error => {
            log.error(error)
            dispatch({
                type: CREATE_CUSTOMER_ERROR,
                error: error
            })
            reject(error)
        })
    })
}

export const getCustomerId = () => (dispatch, getState) =>{
    return new Promise((resolve, reject) => {
        const state = getState()
        let customerId = state.payment.get("customerId");
        if (customerId){
            resolve(customerId)
        }
        else {
            resolve(dispatch(createCustomer()))
        }
    });
}

export const createSubscription = (planId, stripeToken, customerId) => (dispatch, getState) => {
    log.info("creating plan with planId = " + planId + ", stripeToken = " + stripeToken + ", customerId = " + customerId)
    Parse.Cloud.run("createSubscription", {
        planId,
        stripeToken,
    }).then(response => {
        log.info("success!", response)
        dispatch(saveUser({
            stripePlanId: planId,
            stripeSubscriptionId: response.subscriptionId,
            stripeCustomerId: response.customerId,
        }))
    }).catch(error => {
        log.error(error)
    })
}

export const selectPlan = (planId, stripeToken) => (dispatch, getState) => {
    dispatch( selectPlanRequest(planId) )
    dispatch(getCustomerId()).then(customerId => dispatch(createSubscription(planId, stripeToken, customerId)) )
}
