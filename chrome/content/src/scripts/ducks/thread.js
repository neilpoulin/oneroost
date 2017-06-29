import {fromJS} from "immutable"

export const SET_SUBJECT = "oneroost/thread/SET_SUBJECT"
export const SET_BODY = "oneroost/thread/SET_BODY"
export const SET_SENDER = "oneroost/thread/SET_SENDER"
export const SET_ROOST_ID = "oneroost/thread/SET_ROOST_ID"
export const RESET_THREAD = "oneroost/thread/RESET_THREAD"

export const initialState = {
    subject: null,
    body: null,
    sender: null,
    roostId: null
}

export default function reducer(state=initialState, action){
    state = fromJS(state)
    switch(action.type){
        case SET_SUBJECT:
            state = state.set("subject", action.payload)
            break;
        case SET_BODY:
            state = state.set("body", action.payload)
            break;
        case SET_SENDER:
            state = state.set("sender", action.payload)
            break;
        case SET_ROOST_ID:
            state = state.set("roostId", action.payload)
            break;
        case RESET_THREAD:
            var count = state.get("count")
            state = fromJS(initialState).set("count", count)
            break;
        default:
            state = state;
            break;
    }
    return state.toJS()
}
