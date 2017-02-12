import {Map} from "immutable"
import * as log from "LoggingUtil"

export const ADD_SUBSCRIPTION = "oneroost/ADD_SUBSCRIPTION"

const defaultHandler = Map({
    create: null,
    enter: null,
    update: null,
    leave: null,
    delete: null,
})
export const handler = (handlers={}) => {
    return defaultHandler.merge(handlers)
}

let subscriptions = Map({});

export const addSubscription = (group, id, query, handlers) => {
    return {
        type: ADD_SUBSCRIPTION,
        payload: {
            group,
            id,
            query,
            handlers
        }
    }
}

export const removeSubscriptions = (key) => {
    subscriptions.remove(key)
}

const initialState = Map({})
export default function reducer(state=initialState, action){
    switch (action.type) {
        case ADD_SUBSCRIPTION:
            const group = action.payload.get("group")
            const id = action.payload.get("id")
            const query = action.payload.get("query")
            const handlers = action.payload.get("handlers")
            log.info(`adding subscription called for ${group}-${id}`, handlers)
            if ( subscriptions.hasIn([group, id]) ){
                log.info(`subscription already registered for ${group}-${id}`)
                return null;
            }
            let subscription = query.subscribe()
            handlers.forEach((handler, eventName) => {
                if (handler){
                    log.info(`Registering subscription ${group}-${id}: ${eventName}`)
                    subscription.on(eventName, handlers.get(eventName))
                }
            })
            state = state.setIn([group, id, "subscription"], subscription)
            state = state.setIn([group, id, "handlers"], handlers)
            break;
        default:
            break;
    }
    return state
}
