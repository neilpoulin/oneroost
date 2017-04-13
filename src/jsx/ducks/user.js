// import User from "models/User"
import Parse from "parse"
import {Map} from "immutable"
import * as RoostUtil from "RoostUtil"
import {normalize} from "normalizr"
import * as User from "models/User"
import * as Account from "models/Account"
import Raven from "raven-js"
import * as log from "LoggingUtil"
import {LOADED_ENTITIES} from "ducks/entities"

export const UPDATE_USER = "oneroost/user/UPADATE_USER"
export const LOGIN_SUCCESS = "oneroost/user/LOGIN_SUCCESS"
export const LOGOUT = "oneroost/user/LOGOUT"

const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    userId: null,
    email: null,
    admin: false,
    accountId: null,
    isLoggedIn: false,
    roostTemplates: Map({}),
    plan: null,
});

export default function reducer(state=initialState, action){
    switch (action.type) {
        case UPDATE_USER:
            var user = action.payload
            state = state.set("userId", user.get("objectId"))
            state = state.set("admin", user.get("admin"))
            state = state.set("email", user.get("email"))
            break;
        case LOGIN_SUCCESS:
            var user = action.payload
            state = state.set("hasLoaded", true)
            state = state.set("isLoggedIn", true)
            state = state.set("emailVerified", !!user.get("emailVerified"))
            state = state.set("userId", user.get("objectId"))
            state = state.set("admin", user.get("admin") || false)
            state = state.set("email", user.get("email"))
            state = state.set("accountId", user.getIn(["account", "objectId"], null))
            break;
        case LOGOUT:
            state = initialState
            state = state.set("hasLoaded", true)
            break;
        default:
            break;
    }
    return state;
}

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

// TODO: create a register new user method

export const loadCurrentUser = () => (dispatch, getState) => {
    let currentUser = RoostUtil.toJSON(Parse.User.current());
    if (!currentUser){
        return null;
    }
    dispatch(loginSuccessAction(currentUser))
}

export const userLoggedIn = (user) => (dispatch, getState) => {
    if (!user){
        return null
    }
    dispatch(loginSuccessAction(user))
}

export const userLogOut = () => (dispatch, getState) => {
    Parse.User.logOut()
        .then((result) => {
            dispatch({
                type: LOGOUT,
            })
        })
        .catch(log.error);
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
    currentUser.save()
        .then(saved => {
            dispatch(updateUserAction(saved))
        })
        .catch(log.error)
}

export const refreshCachedUserData = () => (dispatch) => {
    Parse.User.current().fetch().then(updated => {
        dispatch(updateUserAction(updated))
    })
}

export const connectToAccount = () => (dispatch, getState) => {
    const {user} = getState()
    if (user.get("accountId")){
        return null;
    }
    Parse.Cloud.run("addUserToAccount", {
        email: user.get("email"),
        userId: user.get("userId"),
    }).then(({account, message, user}) => {
        log.info("success!", message)
        let userEntities = normalize(RoostUtil.toJSON(user), User.Schema).entities
        let accountEntities = normalize(RoostUtil.toJSON(account), Account.Schema).entities
        let entities = Object.assign({}, userEntities, accountEntities)
        dispatch({
            type: LOADED_ENTITIES,
            entities
        })
        dispatch(refreshCachedUserData())
    }).catch(error => {
        log.error("error", error)
    })
}

export const logInAsUser = (userId, password) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        Parse.Cloud.run("getUserWithEmail", {userId: userId})
            .then(function({user}){
                let emailUser = user.toJSON()
                let email = emailUser.email
                Parse.User.logIn(email, password).then(user => {
                    resolve(dispatch(userLoggedIn(user.toJSON())))
                })
            })
            .catch(reject);
    })
}

export const createPassword = (user, password, allowAnonymous=false) => (dispatch, getState) => {
    const state = getState()
    const userId = user.objectId;
    return new Promise((resolve, reject) => {
        if (state.user.userId !== user.objectId && !allowAnonymous){
            reject({error: "Unauthorized to change password for " + userId})
        }
        else if (!user.passwordChangeRequired){
            reject({error: "No password change required, " + userId})
        }
        resolve(Parse.Cloud.run("saveNewPassword", {
            password: password,
            userId: userId
        }))
    })
}
