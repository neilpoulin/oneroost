import {Map, List} from "immutable"
import Parse from "parse"
import {getConfigValue} from "ducks/config"
import * as log from "LoggingUtil"
import * as Waitlist from "models/Waitlist"
import {isValidEmail} from "util/FormUtil"
import ReactGA from "react-ga"

const LOAD_CONFIG_REQUEST = "oneroost/landingpage/LOAD_CONFIG_REQUEST"
const LOAD_CONFIG_SUCCESS = "oneroost/landingpage/LOAD_CONFIG_SUCCESS"
const LOAD_CONFIG_ERROR = "oneroost/landingpage/LOAD_CONFIG_ERROR"

const SET_EMAIL = "oneroost/landingpage/SET_EMAIL"

const JOIN_WAITLIST_REQUEST = "oneroost/landingpage/JOIN_WAITLIST_REQUEST"
const JOIN_WAITLINST_SUCCESS = "oneroost/landingpage/JOIN_WAITLINST_SUCCESS"
const JOIN_WAITLIST_ERROR = "oneroost/landingpage/JOIN_WAITLIST_ERROR"

const initialState = Map({
    loading: false,
    saving: false,
    error: null,
    success: null,
    email: "",
    heroTitle: "",
    heroSubTitle: "",
    ctaSubText: "",
    ctaButtonText: "",
    paragraphs: List([])
});

export default function reducer(state=initialState, action){
    const payload = action.payload
    switch (action.type) {
        case LOAD_CONFIG_REQUEST:
            state = state.set("isLoading", true)
            break;
        case LOAD_CONFIG_SUCCESS:
            state = state.set("isLoading", false)
            state = state.mergeDeep(payload)
            break;
        case LOAD_CONFIG_ERROR:
            state = state.set("isLoading", false)
            state = state.set("error", action.error)
            break;
        case SET_EMAIL:
            state = state.set("email", payload.get("email"))
            break;
        case JOIN_WAITLIST_REQUEST:
            state = state.set("isSaving", true)
            break;
        case JOIN_WAITLINST_SUCCESS:
            state = state.set("isSaving", false)
            state = state.set("error", null)
            state = state.set("success", payload)
            break;
        case JOIN_WAITLIST_ERROR:
            state = state.set("isSaving", false)
            state = state.set("error", action.error)
            state = state.set("success", null)
            break;
        default:
            break;
    }
    return state;
}

// queries
const findWaitlistByEmail = (email) => {
    let query = new Parse.Query(Waitlist.className)
    query.equalTo("email", email)
    return query.first()
}

export const loadConfig = () => (dispatch, getState) => {
    dispatch({
        type: LOAD_CONFIG_REQUEST
    })
    dispatch(getConfigValue("landingPage", Map({})))
        .then(landingPage => {
            dispatch({
                type: LOAD_CONFIG_SUCCESS,
                payload: landingPage,
            })
        }).catch(error => {
            log.error(error)
            dispatch({
                type: LOAD_CONFIG_ERROR,
                error: error,
            })
        })
}

export const setEmail = (email) => (dispatch) => {
    if (isValidEmail(email)){
        dispatch({
            type: JOIN_WAITLIST_ERROR,
        })
    }

    return dispatch({
        type: SET_EMAIL,
        payload: {
            email,
        }
    })
}

export const checkWaitlistEmailExists = (email) => (dispatch, getState) => {
    return new Promise((resolve) => {
        findWaitlistByEmail(email)
            .then(found => {
                if (found){
                    dispatch({
                        type: JOIN_WAITLINST_SUCCESS,
                        payload: {
                            message: `${email} has already joined the waitlist!`
                        }
                    })
                    resolve(true)
                }
                else{
                    resolve(false)
                }
            })
            .catch(error => {
                log.error(error)
                resolve(false)
            })
    })
}

export const createWaitlistEntry = (email) => (dispatch, getState) => {
    let waitlist = Waitlist.fromJS({email})
    waitlist.save()
        .then(saved => {
            dispatch({
                type: JOIN_WAITLINST_SUCCESS,
                payload: {
                    message: "Successfully joined the waitlist!"
                }
            })
            ReactGA.event({
                category: "Waitlist",
                action: "Sign Up"
            });
        }).catch(error => {
            dispatch({
                type: JOIN_WAITLIST_ERROR,
                error: {
                    error,
                    message: "Unable to join the waitlist. Please try again later.",
                    level: "ERROR"
                }
            })
        })
}

export const joinWaitlist = () => (dispatch, getState) => {
    const email = getState().landingpage.get("email")
    if (!isValidEmail(email)){
        return dispatch({
            type: JOIN_WAITLIST_ERROR,
            error: {
                message: "The email you entered is not a valid email address.",
                level: "WARN",
                field: "email"
            }
        })
    }
    dispatch({
        type: JOIN_WAITLIST_REQUEST
    })
    dispatch(checkWaitlistEmailExists(email)).then(exists => {
        if(!exists){
            dispatch(createWaitlistEntry(email))
        }
    })
}
