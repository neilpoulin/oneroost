import reducers from "reducers"
import { createStore, applyMiddleware, compose } from "redux"
import thunkMiddleware from "redux-thunk"
import logger from "middleware/logger"
import immutableParse from "middleware/immutable-parse"
import {loadCurrentUser} from "ducks/user"
import {loadConfig} from "ducks/config"
import {getCurrentLogLevel, DEBUG} from "LoggingUtil"
import {loadConfig as loadLandingPage} from "ducks/landingpage"
import { browserHistory } from "react-router"
import {routerMiddleware} from "react-router-redux"
const configureStore = preloadedState => {
    let middlewares = [thunkMiddleware, immutableParse, routerMiddleware(browserHistory)]
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    if (getCurrentLogLevel() <= DEBUG){
        middlewares.push(logger)
    }
    const store = createStore(reducers, composeEnhancers(applyMiddleware(...middlewares)));
    store.dispatch(loadCurrentUser())
    store.dispatch(loadConfig())
    store.dispatch(loadLandingPage())
    return store
}

export default configureStore;
