import React from 'react'
import { render } from 'react-dom'
import Parse from 'parse'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Home from './modules/Home'
import App from './modules/App'
import $ from 'jquery'

Parse.$ = $;
Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);

render(
    (
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                    <IndexRoute component={Home}/>
            </Route>
        </Router>
    )
    , document.getElementById('app')
)
