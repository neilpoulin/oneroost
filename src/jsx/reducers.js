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
import templates from "ducks/templates"
import invitationsByStakeholder from "ducks/invitationsByStakeholder"
import payment from "ducks/payment"
import config from "ducks/config"
import companyPagesByUrl from "ducks/companyPagesByUrl"

const reducers = combineReducers({
    entities,
    roosts,
    opportunitiesByUser,
    user,
    subscriptions,
    routing,
    notifications,
    dashboard,
    templatesByUser,
    templates,
    invitationsByStakeholder,
    payment,
    config,
    companyPagesByUrl
});

export default reducers;
