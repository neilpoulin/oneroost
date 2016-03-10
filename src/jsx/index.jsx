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

Parse.$ = $;
Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);

render(
    (
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="/deals" component={DealDashboard}>
                    <IndexRoute component={UserHomePage}/>
                    <Route path="/deals/:dealId" component={Deal}>
                        <Route path="/deals/:dealId/stakeholders" component={StakeholderSidebar} />
                    </Route>
                </Route>
            </Route>
        </Router>
    )
    , document.getElementById('app')
)
