/*global OneRoost*/
/*global document*/
import { render } from "react-dom"
import Parse from "parse";
import React from "react";
import { Router, Route, useRouterHistory, IndexRoute, Redirect } from "react-router"
import { createHistory } from "history"
import $ from "jquery"
import Home from "./modules/Home"
import App from "./modules/App"
import UserHomePage from "./modules/UserHomePage";
import Roost from "./modules/deal/Roost";
import DealDashboard from "./modules/deal/DealDashboard";
import StakeholderSidebar from "./modules/deal/sidebar/StakeholderSidebar";
import TimelineSidebar from "./modules/deal/sidebar/TimelineSidebar";
import InvestmentSidebar from "./modules/deal/sidebar/InvestmentSidebar";
import NextStepSidebar from "./modules/deal/sidebar/NextStepSidebar";
import AllStepsSidebar from "./modules/deal/sidebar/AllStepsSidebar";
import NextStepCompletedSidebar from "./modules/deal/sidebar/NextStepCompletedSidebar";
import DocumentsSidebar from "./modules/deal/sidebar/DocumentsSidebar";
import Unauthorized from "./modules/Unauthorized";
import Invitation from "./modules/Invitation";

Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);
Parse.serverURL = OneRoost.Config.serverURL;
Parse.$ = $;

const browserHistory = useRouterHistory(createHistory)({
    basename: "/"
});

// function requireAuth(nextState, replace, callback) {
//     console.log("requireAuth");
//     var user = Parse.User.current();
//     if (!user) {
//         replace({
//             pathname: "/login",
//             state: { nextPathname: nextState.location.pathname }
//         })
//     }
//
//     callback(nextState, replace);
// }

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
        state: { nextPathname: "/roosts" }
    }));
}

render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} onEnter={requireAnonymous}/>
            <Route path="/login" component={Home} onEnter={requireAnonymous}></Route>
            <Route path="/logout" component={Home} onEnter={doLogout}></Route>
            <Redirect from="/deals" to="/roosts" />
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
        </Route>
    </Router>
    , document.getElementById("app")
);
