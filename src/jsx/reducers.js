import { routerReducer as routing } from "react-router-redux"
import { combineReducers } from "redux"
import entities from "ducks/entities"
import roosts from "ducks/roosts"
import opportunitiesByUser from "ducks/opportunitiesByUser"

const reducers = combineReducers({
    entities,
    roosts,
    opportunitiesByUser,
    routing
});

export default reducers;
