import { routerReducer as routing } from "react-router-redux"
import { combineReducers } from "redux"
import entities from "ducks/entities"
import roosts from "ducks/roosts"
import opportunitiesByUser from "ducks/opportunitiesByUser"
import user from "ducks/user"
import subscriptions from "ducks/subscriptions"
import notifications from "ducks/notification"

const reducers = combineReducers({
    entities,
    roosts,
    opportunitiesByUser,
    user,
    subscriptions,
    routing,
    notifications,
});

export default reducers;
