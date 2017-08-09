import { render } from "react-dom"
import Parse from "parse"
import React from "react"

import { Provider } from "react-redux"
import {userLogOut} from "ducks/user"
import { Router, Route, browserHistory, IndexRoute, Redirect } from "react-router"
import LoginPage from "LoginPage"
import RegisterPage from "RegisterPage"
import Landing from "LandingPage"
import App from "App"
import Roost from "deal/Roost"
import NavPage from "navigation/NavPage"
import DealDashboard from "deal/DealDashboard"
import StakeholderSidebar from "deal/sidebar/StakeholderSidebar"
import TimelineSidebar from "deal/sidebar/TimelineSidebar"
import InvestmentSidebar from "deal/sidebar/InvestmentSidebar"
import NextStepSidebar from "deal/sidebar/NextStepSidebar"
import AllStepsSidebar from "deal/sidebar/AllStepsSidebar"
import NextStepCompletedSidebar from "deal/sidebar/NextStepCompletedSidebar"
import DocumentsSidebar from "deal/sidebar/DocumentsSidebar"
import RequirementsSidebar from "deal/sidebar/RequirementsSidebar"
import OpportunityDashboard from "OpportunityDashboard"
import Unauthorized from "Unauthorized"
import Invitation from "Invitation"
import ReviewInvitation from "ReviewInvitation"
import Unsubscribe from "Unsubscribe"
import ReadyRoostPage from "profile/ReadyRoostPage"
import AdminHome from "admin/AdminHome"
import UnauthorizedPage from "UnauthorizedPage"
import EmailTemplates from "admin/EmailTemplates"
import HelpPage from "help/HelpPage"
import ReactGA from "react-ga"
import TermsOfServicePage from "TermsOfServicePage"
import PrivacyPage from "PrivacyPage"
import PlansPage from "payment/PlansPage"
import configureStore from "./store/configureStore"
import { syncHistoryWithStore } from "react-router-redux"
import BrandPage from "brand/BrandPage"
import EmailValidationSuccessPage from "EmailValidationSuccessPage"
import SettingsPage from "SettingsPage"
import UserSettings from "settings/UserSettingsPage"
import CompanySettings from "settings/CompanySettingsPage"
import BrandPageSettings from "settings/BrandPageSettings"
import EmailValidationInstructionsPage from "EmailValidationInstructionsPage"
import * as log from "LoggingUtil"

Parse.initialize(OneRoost.Config.applicationId);

// Parse.serverURL = OneRoost.Config.serverURL;
Parse.serverURL = window.location.origin + "/parse";

const store = configureStore()
ReactGA.initialize(OneRoost.Config.gaTrackingId, getGaOptions());
const history = syncHistoryWithStore(browserHistory, store)
// let unsubscribe =
store.subscribe(() => {

})

// Set up Intercom
if (window.Intercom){
    window.Intercom("boot", {
        app_id: OneRoost.Config.intercomAppId || "te0db1m0"
    });
}

function getGaOptions(){
    var gaOptions = {};
    let userId = store.getState().user.get("userId")
    gaOptions.userId = userId;
    return gaOptions;
}

function logPageView() {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
    window.Intercom("update");
}

function requireAuthOrParam(nextState, replace){
    var userId = store.getState().user.get("userId")
    let {accept} = nextState.location.query;
    if (!userId && !!accept) {
        replace({
            pathname: "/invitations/" + accept,
            state: { nextPathname: nextState.location.pathname }
        })
        return false;
    }
    else if (!userId) {
        replace({
            pathname: "/login",
            state: { nextPathname: nextState.location.pathname }
        })
        return false;
    }
    else if (!!accept){
        replace({
            pathname: nextState.location.pathname,
            state: { nextPathname: nextState.location.pathname }
        })
        return true
    }
    return false;
}

function requireAdmin(nextState, replace){
    let isAdmin = store.getState().user.get("admin")
    if (!isAdmin){
        replace({
            pathname: "/unauthorized",
            state: { nextPathname: nextState.location.pathname || "/unauthorized" }
        });
        return false;
    }
    return true;
}

function requireEmailVerified(nextState, replace){
    let user = store.getState().user
    if(!user || !user.get("userId")){
        replace({
            pathname: "/login",
            state: { nextPathname: nextState.location.pathname || "/verify-email"}
        });
        return false
    }

    let emailVerified = user.get("emailVerified") || user.get("connectedProviders").size > 0
    if (!emailVerified){
        replace({
            pathname: "/verify-email",
            state: { nextPathname: nextState.location.pathname || "/roosts"}
        });
        return false
    }
    return true;
}

function requireActivatedUser(nextState, replace){
    let user = store.getState().user
    let hasAccount = !!user.get("accountId")
    if (!requireEmailVerified(nextState, replace)){
        return false
    }
    else if (!hasAccount){
        log.error("User has not been connected to an account, but has verified their email")
        replace({
            pathname: "/join-account",
            state: { nextPathname: nextState.location.pathname }
        });
        return false
    }
}

function requireAnonymous(nextState, replace){
    let isLoggedIn = store.getState().user.get("isLoggedIn")
    if (isLoggedIn) {
        replace({
            pathname: "/roosts",
            state: { nextPathname: nextState.location.pathname || "/roosts" }
        });
    }
}

function doLogout(nextState, replace){
    store.dispatch(userLogOut())
    replace("/")
}

render(
    <Provider store={store}>
        <Router history={history} onUpdate={logPageView}>
            <Route path="/" component={App}>
                <IndexRoute component={Landing}/>
                <Route path="/login" component={LoginPage} onEnter={requireAnonymous}></Route>
                <Redirect from="/beta/register" to="/signup" />
                // <Route path="/beta/register" component={RegisterPage} onEnter={requireAnonymous}></Route>
                <Route path="/signup" component={RegisterPage} onEnter={requireAnonymous}>
                    <Route path="success" component={EmailValidationInstructionsPage} onEnter={requireAuthOrParam}/>
                </Route>
                <Route path="/logout" component={Landing} onEnter={doLogout}></Route>
                <Redirect from="/deals" to="/roosts" />
                <Redirect from="/settings" to="/settings/profile" />
                <Route path="/settings" component={SettingsPage} onEnter={requireActivatedUser}>
                    <Route path="profile" component={UserSettings}/>
                    <Route path="templates" component={CompanySettings}/>
                    <Route path="brand-page" component={BrandPageSettings}/>
                </Route>
                <Route path="/proposals/:templateId" component={ReadyRoostPage}/>
                <Route path="/help" component={HelpPage}/>
                <Route path="/terms" component={TermsOfServicePage}/>
                <Route path="/privacy" component={PrivacyPage}/>
                <Route path="/reporting" component={OpportunityDashboard} onEnter={requireActivatedUser}/>
                <Route path="/plans" component={PlansPage}/>
                <Route path="/roosts" component={DealDashboard} onEnter={requireAuthOrParam}>
                    <IndexRoute component={Roost}/>
                    <Route path="unauthorized" component={Unauthorized}/>
                    <Redirect from=":dealId" to="/roosts/:dealId/messages" />
                    <Route path=":dealId" component={Roost}>
                        <Redirect from="/deals/:dealId" to="/roosts/:dealId" />
                        <Route path="messages"/>
                        <Route path="participants" component={StakeholderSidebar}/>
                        <Route path="timeline" component={TimelineSidebar}/>
                        <Route path="requirements" component={RequirementsSidebar}/>
                        <Route path="budget" component={InvestmentSidebar}/>
                        <Route path="documents" component={DocumentsSidebar}/>
                        <Route path="steps" >
                            <IndexRoute component={AllStepsSidebar}/>
                            <Route path="completed" component={NextStepCompletedSidebar}/>
                            <Route path=":stepId" component={NextStepSidebar}/>
                        </Route>
                    </Route>
                </Route>
                <Route path="/invitations/:stakeholderId" component={Invitation}/>
                <Route path="/review/:stakeholderId" component={ReviewInvitation} onEnter={requireAuthOrParam}/>
                <Route path="/unsubscribe">
                    <Route path=":emailRecipientId" component={Unsubscribe}></Route>
                </Route>
                <Route path="/admin" component={NavPage} onEnter={requireAdmin}>
                    <IndexRoute component={AdminHome}/>
                    <Route path="emails" component={EmailTemplates}/>
                </Route>
                <Route path="/unauthorized" component={UnauthorizedPage}></Route>
                <Route path="/verify-email" component={EmailValidationInstructionsPage} onEnter={requireAuthOrParam}/>
                <Route path="/verify-email-success" component={EmailValidationSuccessPage}></Route>
                <Route path="/join-account" component={EmailValidationSuccessPage} onEnter={requireEmailVerified}></Route>
                <Route path=":vanityUrl" component={BrandPage}></Route>
            </Route>
        </Router>
    </Provider>
    , document.getElementById("app")
);
