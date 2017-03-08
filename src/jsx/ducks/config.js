import {Map} from "immutable"
import Parse from "parse"

export const GET_CONFIG_REQUEST = "oneroost/config/GET_CONFIG_REQUEST"
export const GET_CONFIG_SUCCESS = "oneroost/config/GET_CONFIG_SUCCESS"

const configRefreshInterval = .5 * 60 * 60 * 1000; // refresh every half hour

const initialState = Map({
    isLoading: false,
    lastFetched: null,
    faqs: [],
    paymentEnabled: false
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

    if (!lastFetched && !isLoading || currentDate.getTime() - lastFetched.getTime() > configRefreshInterval){
        dispatch({type: GET_CONFIG_REQUEST});
        Parse.Config.get().then(config => {
            dispatch({
                type: GET_CONFIG_SUCCESS,
                payload: config.attributes,
            })
        })
    }
}
