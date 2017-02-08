// import User from "models/User"
import Parse from "parse"
import {Map} from "immutable"
import * as RoostUtil from "RoostUtil"
import {normalize} from "normalizr"
import * as User from "models/User"
import Raven from "raven-js"
export const UPDATE_USER = "oneroost/user/UPADATE_USER"
export const LOGIN_SUCCESS = "oneroost/user/LOGIN_SUCCESS"
export const LOGOUT = "oneroost/user/LOGOUT"



export const loginSuccessAction = (user) => {
    Raven.setUserContext({
        email: user.email,
        id: user.objectId
    })
    let entities = normalize(RoostUtil.toJSON(user), User.Schema).entities
    return {
        type: LOGIN_SUCCESS,
        payload: user,
        entities,
    }
}

export const loadCurrentUser = () => (dispatch, getState) => {
    let currentUser = RoostUtil.toJSON(Parse.User.current());
    if ( !currentUser ){
        return null;
    }
    dispatch(loginSuccessAction(currentUser))
}

export const userLoggedIn = ( user ) => (dispatch, getState) => {
    if ( !user ){
        return null
    }
    dispatch(loginSuccessAction(user))
}

export const userLogOut = () => (dispatch, getState) => {
    Parse.User.logOut().then((result) => {
        dispatch({
            type: LOGOUT,
        })
    }).catch(console.error);
}

export const updateUserAction = (user) => {
    user = RoostUtil.toJSON(user);
    let entities = normalize(user, User.Schema).entities
    return {
        type: UPDATE_USER,
        payload: user,
        entities,
    }
}

export const saveUser = (updates) => (dispatch, getState) => {
    let currentUser = Parse.User.current();
    currentUser.set(updates)
    currentUser.save().then(saved => {
        dispatch(updateUserAction(saved))
    }).catch(console.log)
}

const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    userId:  null,
    admin: false,
    isLoggedIn: false,
});

export default function reducer(state=initialState, action){
    switch (action.type) {
        case UPDATE_USER:
            var user = action.payload
            state = state.set("userId", user.get("objectId"))
            state = state.set("admin", user.get("admin"))
            break;
        case LOGIN_SUCCESS:
            var user = action.payload
            state = state.set("hasLoaded", true)
            state = state.set("isLoggedIn", true)
            state = state.set("userId", user.get("objectId"))
            state = state.set("admin", user.get("admin"))
            break;
        case LOGOUT:
            state = state.set("hasLoaded", true)
            state = state.set("currentUser", null)
            state = state.set("userId", null)
            state = state.set("isLoggedIn", false)
            break;
        default:
            break;
    }
    return state;
}
