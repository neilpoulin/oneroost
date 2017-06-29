import { combineReducers } from "redux"
import thread from "./thread"
import user from "./user"

const reducers = combineReducers({
    thread,
    user,
})

export default reducers
