/*global OneRoost*/
/*global document*/
import { render } from "react-dom"
import Parse from "parse"
import React from "react"
import { Router, Route, browserHistory, IndexRoute, Redirect } from "react-router"
import LoginPage from "LoginPage"
import RegisterPage from "RegisterPage"
import Landing from "LandingPage"
import App from "App"
import UserHomePage from "UserHomePage"
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
import Unauthorized from "Unauthorized"
import Invitation from "Invitation"
import ReviewInvitation from "ReviewInvitation"
import Unsubscribe from "Unsubscribe"
import ProfilePage from "profile/ProfilePage"
// import PublicProfilePage from "profile/PublicProfilePage"
import ReadyRoostPage from "profile/ReadyRoostPage"
import AdminHome from "admin/AdminHome"
import UnauthorizedPage from "UnauthorizedPage"
import EmailTemplates from "admin/EmailTemplates"
import HelpPage from "help/HelpPage"
import ReactGA from "react-ga"

Parse.initialize(OneRoost.Config.applicationId);
// Parse.serverURL = OneRoost.Config.serverURL;
Parse.serverURL = window.location.origin + "/parse";


ReactGA.initialize(OneRoost.Config.gaTrackingId, getGaOptions());

function getGaOptions(){
    var gaOptions = {};
    var currentUser = Parse.User.current();
    if ( currentUser ){
        var userId = currentUser.objectId || currentUser.id
        console.log("currentUserId:", userId);
        gaOptions.userId = userId;
    }
    return gaOptions;
}

function logPageView() {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
}

function requireAuthOrParam( nextState, replace ){
    var user = Parse.User.current();
    let {accept} = nextState.location.query;
    if (!user && !!accept )
    {
        replace({
            pathname: "/invitations/" + accept,
            state: { nextPathname: nextState.location.pathname }
        })
    }
    else if (!user) {
        replace({
            pathname: "/login",
            state: { nextPathname: nextState.location.pathname }
        })
    }
    else if ( !!accept ){
        replace({
            pathname: nextState.location.pathname,
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

function requireAdmin(nextState, replace){
    var isAdmin = false;
    var user = Parse.User.current();
    if ( user ){
        isAdmin = user.get("admin");
    }
    if ( !isAdmin ){
        replace({
            pathname: "/unauthorized",
            state: { nextPathname: nextState.location.pathname || "/unauthorized" }
        });
    }
}

function requireAnonymous(nextState, replace){
    var user = Parse.User.current();
    if ( user )
    {
        replace({
            pathname: "/roosts",
            state: { nextPathname: nextState.location.pathname || "/roosts" }
        });
    }
}

function doLogout(nextState, replace){
    Parse.User.logOut()
    .done(replace({
        pathname: "/login",
        state: { nextPathname: "/login" }
    }));
}

render(
    <Router history={browserHistory} onUpdate={logPageView}>
        <Route path="/" component={App}>
            <IndexRoute component={Landing}/>
            <Route path="/login" component={LoginPage} onEnter={requireAnonymous}></Route>
            <Route path="/beta/register" component={RegisterPage} onEnter={requireAnonymous}></Route>
            <Route path="/logout" component={Landing} onEnter={doLogout}></Route>
            <Redirect from="/deals" to="/roosts" />
            <Route path="/account" component={ProfilePage} onEnter={requireAuthOrParam}>

            </Route>
            <Route path="/proposals/:userId" component={ReadyRoostPage}/>
            <Route path="/help" component={HelpPage}/>
            <Route path="/roosts" component={DealDashboard} onEnter={requireAuthOrParam}>
                <IndexRoute component={UserHomePage}/>
                <Route path="unauthorized" component={Unauthorized}/>
                <Redirect from=":dealId" to="/roosts/:dealId/messages" />
                <Route path=":dealId" component={Roost}>
                    <Redirect from="/deals/:dealId" to="/roosts/:dealId" />
                    <Route path="messages"/>
                    <Route path="participants" component={StakeholderSidebar}/>
                    <Route path="timeline" component={TimelineSidebar}/>
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
            <Route path="/review/:stakeholderId" component={ReviewInvitation}/>
            <Route path="/unsubscribe">
                <Route path=":emailRecipientId" component={Unsubscribe}></Route>
            </Route>
            <Route path="/admin" component={NavPage} onEnter={requireAdmin}>
                <IndexRoute component={AdminHome}/>
                <Route path="emails" component={EmailTemplates}/>
            </Route>
            <Route path="/unauthorized" component={UnauthorizedPage}></Route>
        </Route>
    </Router>
    , document.getElementById("app")
);
