import reducers from "reducers"
import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"
import logger from "middleware/logger"
import immutableParse from "middleware/immutable-parse"
import {loadCurrentUser} from "ducks/user"

const configureStore = preloadedState => {
    const store = createStore(
        reducers,
        applyMiddleware(
            thunkMiddleware,
            logger,
            immutableParse
        )
    );
    store.dispatch(loadCurrentUser())
    return store
}

export default configureStore;
