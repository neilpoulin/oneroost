import { routerReducer as routing } from "react-router-redux"
import { combineReducers } from "redux"
import entities from "ducks/entities"
import roosts from "ducks/roosts"
import opportunitiesByUser from "ducks/opportunitiesByUser"
import user from "ducks/user"
import subscriptions from "ducks/subscriptions"
import notifications from "ducks/notification"
import dashboard from "ducks/dashboard"
import templatesByUser from "ducks/templatesByUser"

const reducers = combineReducers({
    entities,
    roosts,
    opportunitiesByUser,
    user,
    subscriptions,
    routing,
    notifications,
    dashboard,
    templatesByUser
});

export default reducers;
