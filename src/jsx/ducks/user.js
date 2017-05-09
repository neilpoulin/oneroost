// import User from "models/User"
import Parse from "parse"
import {Map} from "immutable"
import * as RoostUtil from "RoostUtil"
import {normalize} from "normalizr"
import * as User from "models/User"
import * as Account from "models/Account"
import * as AccountSeat from "models/AccountSeat"
import Raven from "raven-js"
import * as log from "LoggingUtil"
import {LOADED_ENTITIES} from "ducks/entities"
const NO_ACCOUNT = "NO_ACCOUNT"

export const UPDATE_USER = "oneroost/user/UPADATE_USER"
export const LOGIN_SUCCESS = "oneroost/user/LOGIN_SUCCESS"
export const LOGOUT = "oneroost/user/LOGOUT"
export const SET_ACCOUNT = "oneroost/user/SET_ACCOUNT"
export const LOAD_PERMISSIONS_REQUEST = "oneroost/user/LOAD_PERMISSIONS_REQUEST"
export const LOAD_PERMISSIONS_SUCCESS = "oneroost/user/LOAD_PERMISSIONS_SUCCESS"
export const LOAD_PERMISSIONS_ERROR = "oneroost/user/LOAD_PERMISSIONS_ERROR"
export const SET_PERMISSIONS = "oneroost/user/SET_PERMISSIONS"

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
    accountSeatId: null,
    roles: [],
    seatError: null,
});

export default function reducer(state=initialState, action){
    switch (action.type) {
        case UPDATE_USER:
            var user = action.payload
            state = state.set("userId", user.get("objectId"))
            state = state.set("admin", user.get("admin"))
            state = state.set("email", user.get("email"))
            state = state.set("accountId", user.getIn(["account", "objectId"]))
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
        case SET_ACCOUNT:
            var payload = action.payload || Map({})
            state = state.set("accountId", payload.getIn(["account", "objectId"]))
            state = state.set("accountSeatId", payload.getIn(["accountSeat", "objectId"]))
            state = state.set("roles", payload.getIn(["accountSeat", "roles"], []))
            break;
        case LOAD_PERMISSIONS_ERROR:
            state = state.set("isLoading", false)
            state = state.set("seatError", action.error)
            break;
        case LOAD_PERMISSIONS_REQUEST:
            state = state.set("isLoading", true)
            break
        case LOAD_PERMISSIONS_SUCCESS:
            var seat = action.payload;
            state = state.set("accountId", seat.getIn(["account", "objectId"]))
            state = state.set("accountSeatId", seat.get("objectId"))
            state = state.set("roles", seat.get("roles", []))
            state = state.set("seatError", null)
            state = state.set("isLoading", false)
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

// Queries
export const getAccountSeatForUser = (user) => {
    let query = new Parse.Query(AccountSeat.className)
    query.include("createdBy")
    query.include("modifiedBy")
    query.include("account")
    query.equalTo("user", User.Pointer(user))
    return query.find()
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
    dispatch(refreshCachedUserData())
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

export const fetchUserPermissions = () => (dispatch, getState) => {
    const {user} = getState()
    const userId = user.get("userId", null)
    const accountSeatId = user.get("accountSeatId")
    if (!userId || accountSeatId){
        return null
    }
    dispatch({
        type: LOAD_PERMISSIONS_REQUEST
    });

    getAccountSeatForUser(userId).then(results => {
        const seat = results[0]
        if(seat){
            log.info("fetched user's account seat", results.map(RoostUtil.toJSON))
            let entities = normalize(RoostUtil.toJSON(seat), AccountSeat.Schema).entities
            dispatch({
                type: LOAD_PERMISSIONS_SUCCESS,
                payload: seat,
                entities,
            })
        }
    }).catch(error => {
        log.error("Failed to get user's account seat", error)
        dispatch({
            type: LOAD_PERMISSIONS_ERROR,
            error: error,
        })
    })
}

export const refreshCachedUserData = () => (dispatch) => {    
    Parse.User.current().fetch().then(updated => {
        dispatch(updateUserAction(updated))
    })
}

export const setAccount = (account, accountSeat) => (dispatch, getState) => {
    dispatch({
        type: SET_ACCOUNT,
        payload: {
            account,
            accountSeat,
        }
    })
}

export const connectToAccount = () => (dispatch, getState) => {
    const {user} = getState()
    const email = user.get("email")
    const userId = user.get("userId")
    if (user.get("accountId")){
        log.info("User already has an account. Exititng")
        return null;
    }
    Parse.Cloud.run("addUserToAccount", {
        email,
        userId,
    }).then(({account, accountSeat, message, user}) => {
        log.info("success!", message)
        let userEntities = normalize(RoostUtil.toJSON(user), User.Schema).entities
        let accountEntities = normalize(RoostUtil.toJSON(account), Account.Schema).entities
        let accountSeatEntities = normalize(RoostUtil.toJSON(accountSeat), AccountSeat.Schema).entities
        let entities = Object.assign({}, userEntities, accountEntities, accountSeatEntities)
        dispatch({
            type: LOADED_ENTITIES,
            entities
        })
        dispatch(setAccount(account))
        dispatch(refreshCachedUserData())
    }).catch(error => {
        switch (error.code) {
            case NO_ACCOUNT:
                log.info("no account exists for this user", email)
                dispatch({
                    type: NO_ACCOUNT,
                })
                break;
            default:
                log.error("Unknown error occurred when adding user to account", error)
        }
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
