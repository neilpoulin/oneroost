/*global OneRoost*/
/*global document*/
import { render } from "react-dom"
import Parse from "parse";
import React from "react";
import { Router, Route, useRouterHistory, IndexRoute } from "react-router"
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
            state: { nextPathname: nextState.location.pathname }
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
        <IndexRoute component={Home}/>
        <Route path="/login" component={Home} onEnter={requireAnonymous}></Route>
        <Route path="/logout" component={Home} onEnter={doLogout}></Route>
        <Route path="/roosts" component={DealDashboard} onEnter={requireAuthOrParam}>
          <IndexRoute component={UserHomePage}/>
          <Route path="/roosts/unauthorized" component={Unauthorized}/>
          <Route path="/roosts/:dealId" component={Roost}>
            <Route path="/roosts/:dealId/participants" component={StakeholderSidebar}/>
            <Route path="/roosts/:dealId/timeline" component={TimelineSidebar}/>
            <Route path="/roosts/:dealId/budget" component={InvestmentSidebar}/>
            <Route path="/roosts/:dealId/documents" component={DocumentsSidebar}/>
            <Route path="/roosts/:dealId/steps/completed" component={NextStepCompletedSidebar}/>
            <Route path="/roosts/:dealId/steps/:stepId" component={NextStepSidebar}/>
          </Route>
        </Route>
        <Route path="/invitations/:stakeholderId" component={Invitation}/>
      </Route>
    </Router>
  , document.getElementById("app")
);
