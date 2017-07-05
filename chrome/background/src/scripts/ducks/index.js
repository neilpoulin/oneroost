import { combineReducers } from "redux"
import thread from "./thread"
import user from "./user"
import brandPages from "./brandPages"

const reducers = combineReducers({
    brandPages,
    thread,
    user,
})

export default reducers
