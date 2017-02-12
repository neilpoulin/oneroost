import reducers from "reducers"
import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"
import logger from "middleware/logger"
import immutableParse from "middleware/immutable-parse"
import {loadCurrentUser} from "ducks/user"
import {getCurrentLogLevel, DEBUG} from "LoggingUtil"

const configureStore = preloadedState => {
    let middlewares = [thunkMiddleware, immutableParse]
    if ( getCurrentLogLevel() <= DEBUG ){
        middlewares.push(logger)
    }
    const store = createStore(
        reducers,
        applyMiddleware(
            ...middlewares
        )
    );
    store.dispatch(loadCurrentUser())
    return store
}

export default configureStore;
