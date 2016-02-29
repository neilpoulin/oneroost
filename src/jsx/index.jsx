import React from 'react'
import { render } from 'react-dom'
import Parse from 'parse'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Home from './modules/Home'
import App from './modules/App'
import $ from 'jquery'
import UserHomePage from './modules/UserHomePage';
import DealPage from './modules/DealPage'

Parse.$ = $;
Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);

render(
    (
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="/my/home" component={UserHomePage}/>
            </Route>
            <Route path="/deals/:dealId" component={DealPage}/>
        </Router>
    )
    , document.getElementById('app')
)
