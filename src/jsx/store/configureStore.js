import reducers from "reducers"
import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"
import logger from "middleware/logger"
import immutableParse from "middleware/immutable-parse"

const configureStore = preloadedState => {
    const store = createStore(
        reducers,
        applyMiddleware(
            thunkMiddleware,
            logger,
            immutableParse
        )
    );
    return store
}

export default configureStore;
