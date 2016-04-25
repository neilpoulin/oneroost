import React from 'react'
import { render } from 'react-dom'
import Parse from 'parse'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Home from './modules/Home'
import App from './modules/App'
import $ from 'jquery'
import UserHomePage from './modules/UserHomePage';
import Deal from './modules/deal/Deal';
import DealDashboard from './modules/deal/DealDashboard';
import StakeholderSidebar from './modules/deal/sidebar/StakeholderSidebar';
import TimelineSidebar from './modules/deal/sidebar/TimelineSidebar';
import BudgetSidebar from './modules/deal/sidebar/BudgetSidebar';

Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);
Parse.$ = $;
Parse.serverURL = OneRoost.Config.parseSeverURL;

render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/deals" component={DealDashboard}>
          <IndexRoute component={UserHomePage}/>
          <Route path="/deals/:dealId" component={Deal}>
            <Route path="/deals/:dealId/participants" component={StakeholderSidebar}/>
            <Route path="/deals/:dealId/timeline" component={TimelineSidebar}/>
            <Route path="/deals/:dealId/budget" component={BudgetSidebar}/>
          </Route>
        </Route>
      </Route>
    </Router>
  )
  , document.getElementById('app')
);
