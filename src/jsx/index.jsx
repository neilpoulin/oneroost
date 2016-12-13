/*global OneRoost*/
/*global document*/
import { render } from "react-dom"
import Parse from "parse"
import React from "react"
import { Router, Route, useRouterHistory, IndexRoute, Redirect } from "react-router"
import { createHistory } from "history"
import LoginOnly from "./modules/LoginOnly"
import LoginPage from "./modules/LoginPage"
import Landing from "./modules/LandingPage"
import App from "./modules/App"
import UserHomePage from "./modules/UserHomePage"
import Roost from "./modules/deal/Roost"
import NavPage from "./modules/navigation/NavPage"
import DealDashboard from "./modules/deal/DealDashboard"
import StakeholderSidebar from "./modules/deal/sidebar/StakeholderSidebar"
import TimelineSidebar from "./modules/deal/sidebar/TimelineSidebar"
import InvestmentSidebar from "./modules/deal/sidebar/InvestmentSidebar"
import NextStepSidebar from "./modules/deal/sidebar/NextStepSidebar"
import AllStepsSidebar from "./modules/deal/sidebar/AllStepsSidebar"
import NextStepCompletedSidebar from "./modules/deal/sidebar/NextStepCompletedSidebar"
import DocumentsSidebar from "./modules/deal/sidebar/DocumentsSidebar"
import Unauthorized from "./modules/Unauthorized"
import Invitation from "./modules/Invitation"
import ReviewInvitation from "./modules/ReviewInvitation"
import Unsubscribe from "./modules/Unsubscribe"
import ProfilePage from "./modules/profile/ProfilePage"
import PublicProfilePage from "./modules/profile/PublicProfilePage"
import AdminHome from "./modules/admin/AdminHome"
import UnauthorizedPage from "./modules/UnauthorizedPage"
import EmailTemplates from "./modules/admin/EmailTemplates"
import ReactGA from "react-ga"


Parse.initialize(OneRoost.Config.applicationId);
// Parse.serverURL = OneRoost.Config.serverURL;
Parse.serverURL = window.location.origin + "/parse";


ReactGA.initialize(OneRoost.Config.gaTrackingId, getGaOptions());

const browserHistory = useRouterHistory(createHistory)({
    basename: "/"
});

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
            <Route path="/login" component={LoginOnly} onEnter={requireAnonymous}></Route>
            <Route path="/beta/register" component={LoginPage} onEnter={requireAnonymous}></Route>
            <Route path="/logout" component={Landing} onEnter={doLogout}></Route>
            <Redirect from="/deals" to="/roosts" />
            <Route path="/account" component={ProfilePage} onEnter={requireAuthOrParam}>

            </Route>
            <Route path="/profile/:userId" component={PublicProfilePage}/>
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
