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
import {getFullName, toJSON} from "RoostUtil"
import {LOADED_ENTITIES} from "ducks/entities"
import moment from "moment"
import request from "superagent"

const NO_ACCOUNT = "NO_ACCOUNT"

export const UPDATE_USER = "oneroost/user/UPADATE_USER"
export const LOGIN_SUCCESS = "oneroost/user/LOGIN_SUCCESS"
export const LOGOUT = "oneroost/user/LOGOUT"
export const SET_ACCOUNT = "oneroost/user/SET_ACCOUNT"
export const LOAD_PERMISSIONS_REQUEST = "oneroost/user/LOAD_PERMISSIONS_REQUEST"
export const LOAD_PERMISSIONS_SUCCESS = "oneroost/user/LOAD_PERMISSIONS_SUCCESS"
export const LOAD_PERMISSIONS_ERROR = "oneroost/user/LOAD_PERMISSIONS_ERROR"
export const SET_PERMISSIONS = "oneroost/user/SET_PERMISSIONS"
export const SEND_EMAIL_VALIDATION_REQUEST = "oneroost/user/SEND_EMAIL_VALIDATION_REQUEST"
export const SEND_EMAIL_VALIDATION_SUCCESS = "oneroost/user/SEND_EMAIL_VALIDATION_SUCCESS"
export const SEND_EMAIL_VALIDATION_ERROR = "oneroost/user/SEND_EMAIL_VALIDATION_ERROR"
export const SET_ACCESS_TOKEN = "oneroost/ser/SET_ACCESS_TOKEN"

const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    userId: null,
    email: null,
    username: null,
    admin: false,
    accountId: null,
    isLoggedIn: false,
    roostTemplates: Map({}),
    plan: null,
    accountSeatId: null,
    roles: [],
    seatError: null,
    emailVerified: false,
    firstName: null,
    lastName: null,
    sendingEmailValidation: false,
    lastEmailValidationSent: null,
    sendEmailValidationError: null,
    connectedProviders: [],
    accessTokens: Map({}),
});

export default function reducer(state=initialState, action){
    switch (action.type) {
        case UPDATE_USER:
            var user = action.payload
            state = state.set("userId", user.get("objectId"))
            state = state.set("admin", user.get("admin"))
            state = state.set("email", user.get("email", user.get("username")))
            state = state.set("username", user.get("username"))
            state = state.set("accountId", user.getIn(["account", "objectId"]))
            let emailVerified = !!user.get("emailVerified")

            if (!emailVerified && user.getIn(["authData", "google", "email"]) == state.get("email")){
                emailVerified = true;
            }
            state = state.set("connectedProviders", user.get("authData", {}).keySeq())
            state = state.set("emailVerified", emailVerified)
            state = state.set("firstName", user.get("firstName"))
            state = state.set("lastName", user.get("lastName"))
            break;
        case LOGIN_SUCCESS:
            var user = action.payload
            state = state.set("hasLoaded", true)
            state = state.set("isLoggedIn", true)
            state = state.set("emailVerified", !!user.get("emailVerified"))
            state = state.set("userId", user.get("objectId"))
            state = state.set("admin", user.get("admin") || false)
            state = state.set("email", user.get("email", user.get("username")))
            state = state.set("username", user.get("username"))
            state = state.set("accountId", user.getIn(["account", "objectId"], null))
            state = state.set("firstName", user.get("firstName"))
            state = state.set("lastName", user.get("lastName"))
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
        case SEND_EMAIL_VALIDATION_REQUEST:
            state = state.set("sendingEmailValidation", true)
            state = state.set("lastEmailValidationSent", null)
            break;
        case SEND_EMAIL_VALIDATION_SUCCESS:
            state = state.set("lastEmailValidationSent", new Date())
            state = state.set("sendingEmailValidation", false)
            break;
        case SEND_EMAIL_VALIDATION_ERROR:
            state = state.set("sendingEmailValidation", false)
            state = state.set("sendEmailValidationError", action.error)
            break;
        case SET_ACCESS_TOKEN:
            state = state.setIn(["accessTokens", action.payload.get("provider"), "access_token"], action.payload.get("access_token"))
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

export const fetchUserById = (userId) => {
    let query = new Parse.Query(User.className)
    query.include("account")
    query.include("invitedBy")
    query.include("accountSeat")
    return query.get(userId)
}

export const updateIntercomUser = (user) => {
    user = toJSON(user)
    try{
        Parse.Cloud.run("getIntercomHMAC", {}).then(({hmac}) => {
            let intercomUser = {
                app_id: OneRoost.Config.intercomAppId,
                name: getFullName(user), // Full name
                email: user.email, // Email address
                user_id: user.objectId,
                created_at: moment(user.createdAt).unix(), // Signup date as a Unix timestamp
                user_hash: hmac,
            }

            if (user.account){
                let companies = []
                companies.push({
                    company_id: user.account.objectId,
                    name: user.account.accountName
                });
                intercomUser.companies = companies;
            }
            try{
                window.Intercom("boot", intercomUser);
            }
            catch (e){
                log.warn("Failed to send user data to intercom")
            }
        })
    }
    catch(e){
        log.error("Failed to send user info to intercom")
    }
}

const getUserState = (state) => {
    return state ? state.user : Map()
}

//selectors
export const getCurrentUser = (state) => {
    return getUserState(state)
}

export const getCurrentAccountId = (state) => {
    return getCurrentUser(state).get("accountId")
}

// Action creators
export const loginSuccessAction = (user) => {
    Raven.setUserContext({
        email: user.email,
        id: user.objectId
    })
    updateIntercomUser(user)
    let entities = normalize(RoostUtil.toJSON(user), User.Schema).entities
    return {
        type: LOGIN_SUCCESS,
        payload: user,
        entities,
    }
}

// TODO: create a register new user method

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
    let user = Parse.User.current()
    if (!user){
        return null
    }
    // calling .fetch() to have Parse refresh the internal cache
    user.fetch()
    fetchUserById(user.id).then(updated => {
        dispatch(updateUserAction(updated.toJSON()))
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

export const userLoggedIn = (user) => (dispatch, getState) => {
    if (!user){
        return null
    }
    dispatch(loginSuccessAction(user))
    dispatch(refreshCachedUserData())
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

export const loadCurrentUser = () => (dispatch, getState) => {
    let currentUser = RoostUtil.toJSON(Parse.User.current());
    if (!currentUser){
        return null;
    }
    // this needs to be synchronous
    dispatch(loginSuccessAction(currentUser))
    // update the rest of the details
    dispatch(refreshCachedUserData())
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

export const resendEmailVerification = () => (dispatch, getState) => {
    const username = getState().user.get("username");
    dispatch({type: SEND_EMAIL_VALIDATION_REQUEST})

    request.post(`/parse/apps/${Parse.applicationId}/resend_verification_email`)
        .send(`username=${username}`)
        .end(function(e, response){
            if (e){
                log.error("Failed to resend the password reset email to " + username, e)
                dispatch({
                    type: SEND_EMAIL_VALIDATION_ERROR,
                    error: {level: "ERROR", message: "Failed to send the email. Please try again.", error: e}
                })
            }
            else {
                log.info("successfully resent the email verification")
                dispatch({type: SEND_EMAIL_VALIDATION_SUCCESS})
            }
        })
}

export function linkUserWithProviderError(providerName, error){
    return (dispatch, getState) => {
        log.error("Failed to link " + providerName, error)
    }
}

export function loginWithLinkedin({code, redirectUri}){
    return (dispatch, getState) => {
        return dispatch(getOauthTokenFromCode("linkedin", {
            code,
            redirectUri
        })).then(({access_token, id, firstName, lastName, email, company}) => {
            return dispatch(linkUserWithProvider("linkedin", {
                access_token,
                id,
                redirectUri,
                firstName,
                lastName,
                email,
                company,
            }))
        })
    }
}

export function getOauthTokenFromCode(provider, {code, redirectUri}){
    return (dispatch, getState) => {
        return Parse.Cloud.run("getOAuthToken", {provider, code, redirectUri})
            .then(({access_token, id, firstName, lastName, email, company}) => {
                dispatch({
                    type: SET_ACCESS_TOKEN,
                    payload: {
                        provider,
                        access_token,
                        id,
                        firstName,
                        lastName,
                        email,
                    }
                })
                return {access_token, id, firstName, lastName, email, company}
            });
    }
}

export function linkUserWithProvider(provider, authData){
    return (dispatch, getState) => {
        console.log("authData:", authData)
        debugger;
        const {firstName, lastName, email} = authData || {}
        let user = Parse.User.current() || new Parse.User({
            email,
            firstName,
            lastName,
            username: email
        });

        let options = {
            authData
        }
        return user._linkWith(provider, options).then(savedUser => {
            log.info("Linked with " + provider, savedUser)
            dispatch(userLoggedIn(savedUser))
            // return savedUser.set({
            //     passwordChangeRequired: false
            // }).save()
        }).catch(error => {
            log.error("Failed to link with" + provider, error)
        })
    }
}
