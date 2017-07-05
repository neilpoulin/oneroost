import Parse from "parse"
import {fromJS} from "immutable"
import {handleSignInClick, handleSignOutClick, loadUserFromCache} from "googleAuth"
import * as UserActions from "actions/user"

const initialState = {
    isLogin: false,
    userId: null,
    accountId: null,
    firstName: null,
    lastName: null,
    isLoading: false,
    googleEmail: null,
    role: null,
    error: null,
}

const getUserIdFromAction = (action) => {
    return action.userId || action.payload.userId || action.payload.objectId || action.payload.id || null
}

export default function reducer(state=initialState, action){
    state = fromJS(state).toJS()
    const payload = action.payload
    switch(action.type){
        case UserActions.LOG_IN_REQUEST:
            state.isLoading = true;
            break;
        case UserActions.LOG_IN_SUCCESS:
            state.userId = getUserIdFromAction(action);
            state.isLoading = false;
            state.accountId = action.payload.account.objectId;
            state.isLoggedIn = true;
            break;
        case UserActions.UPDATE_USER_INFO:
            state.firstName = payload.firstName;
            state.lastName = payload.lastName;
            if (payload.account){
                state.accountId = payload.account.objectId;
                state.accountName = payload.account.accountName;
            }
            if (payload.accountSeat){
                state.role = payload.accountSeat.role
            }
            break;
        case UserActions.LOG_OUT_SUCCESS:
            state = initialState
            break;
        case UserActions.LOG_IN_ERROR:
            console.error(action)
            break;
        case UserActions.GOOGLE_LOG_IN_SUCCESS:
            state.googleEmail = action.payload.email
            break;
        case UserActions.GOOGLE_LOG_OUT_SUCCESS:
            state.googleEmail = null
            break;
        default:
            break;
    }

    return state;
}

// Queries
const getUserQuery = (userId) => {
    let query = new Parse.Query("_User")
    query.include("account")
    query.include("accountSeat")
    return query.get(userId)
}

// Actions
export const loadUserDetails = (userId) => (dispatch, getState) => {
    getUserQuery(userId).then(user => {
        dispatch({
            type: UserActions.UPDATE_USER_INFO,
            payload: user.toJSON()
        })
    }).catch(error => {
        console.error(error)
    })
}

export const logIn = ({email, password}) => (dispatch, getState) => {
    const state = getState()
    if (state.isLoggedIn) {
        console.log("user already logged in, exiting")
        return null
    }
    dispatch({
        type: UserActions.LOG_IN_REQUEST
    })
    Parse.User.logIn(email.toLowerCase(), password)
        .then(user => {
            dispatch({
                type: UserActions.LOG_IN_SUCCESS,
                userId: user.id,
                payload: user.toJSON()
            })
            dispatch(loadUserDetails(user.id))
        })
        .catch(error => {
            console.error(error)
        })
}

export const logOut = () => (dispatch, getState) => {
    console.log("Logging out")
    if (!Parse.User.current()){
        dispatch({type: UserActions.LOG_OUT_SUCCESS})
        return null
    }
    Parse.User.logOut().then(() => {
        dispatch({type: UserActions.LOG_OUT_SUCCESS})
    })
}

export const logInGoogle = () => (dispatch, getState) => {
    handleSignInClick().then(({email}) => {
        console.log("Signed In Click finished...", email)
        dispatch({type: UserActions.GOOGLE_LOG_IN_SUCCESS, payload: {email}})
    })
}

export const logOutGoogle = () => (dispatch, getState) => {
    handleSignOutClick().then(() => {
        dispatch({type: UserActions.GOOGLE_LOG_OUT_SUCCESS})
    })
}

export const loadCachedUser = () => (dispatch, getState) => {
    let user = Parse.User.current()
    if (user){
        dispatch({
            type: UserActions.LOG_IN_SUCCESS,
            userId: user.id,
            payload: user.toJSON()
        })
        dispatch(loadUserDetails(user.id))
    }
    loadUserFromCache().then(({email}) => {
        console.log("Loaded google user from cache finished...", email)
        dispatch({type: UserActions.GOOGLE_LOG_IN_SUCCESS, payload: {email}})
    }).catch(console.error)
}

export const aliases = {
    [UserActions.LOG_IN_ALIAS]: logIn,
    [UserActions.LOG_OUT_ALIAS]: logOut,
    [UserActions.LOG_IN_GOOGLE_ALIAS]: logInGoogle,
    [UserActions.LOG_OUT_GOOGLE_ALIAS]: logOutGoogle,
}
