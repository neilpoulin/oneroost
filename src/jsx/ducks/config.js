import {Map} from "immutable"
import Parse from "parse"
import * as log from "LoggingUtil"
import {timeout} from "PromiseUtil"
export const GET_CONFIG_REQUEST = "oneroost/config/GET_CONFIG_REQUEST"
export const GET_CONFIG_SUCCESS = "oneroost/config/GET_CONFIG_SUCCESS"

const configRefreshInterval = .5 * 60 * 60 * 1000; // refresh every half hour

const initialState = Map({
    isLoading: false,
    lastFetched: null,
    faqs: [],
    paymentEnabled: false,
    landingPage: Map({})
})

export default function reducer(state=initialState, action){
    switch (action.type) {
        case GET_CONFIG_REQUEST:
            state = state.set("isLoading", true)
            break;
        case GET_CONFIG_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("lastFetched", new Date())
            state = state.merge(action.payload)
            break;
        default:
            break;
    }
    return state;
}

export const loadConfig = () => (dispatch, getState) => {
    let {lastFetched, isLoading} = getState().config.toJS()
    let currentDate = new Date();
    return new Promise((resolve, reject) => {
        if (!lastFetched && !isLoading || lastFetched != null && currentDate.getTime() - lastFetched.getTime() > configRefreshInterval){
            dispatch({type: GET_CONFIG_REQUEST});
            Parse.Config.get().then(config => {
                dispatch({
                    type: GET_CONFIG_SUCCESS,
                    payload: config.attributes,
                })
                resolve(getState().config)
            })
        }
        else if (!isLoading){
            resolve(getState().config)
        }
    })
}

const getConfig = () => (dispatch, getState) => {
    return new Promise((resolve) => {
        let isLoading = getState().config.get("isLoading")
        if (isLoading){
            setTimeout(function () {
                resolve(dispatch(getConfig()))
            }, 250);
        }
        else{
            resolve(getState().config)
        }
    })
}

export const getConfigValue = (configKey, defaultValue) => (dispatch, getState) => {
    return new Promise((resolve) => {
        timeout(dispatch(getConfig()), 1000).then(config => {
            resolve(config.get(configKey, defaultValue))
        }).catch(log.error)
    })
}
