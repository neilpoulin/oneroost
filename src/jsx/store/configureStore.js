import reducers from "reducers"
import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"
import createLogger from "redux-logger"
import { Iterable } from "immutable";

const logger = createLogger({
    stateTransformer: (state) => {
        let newState = {};

        for (var i of Object.keys(state)) {
            if (Iterable.isIterable(state[i])) {
                newState[i] = state[i].toJS();
            } else {
                newState[i] = state[i];
            }
        }

        return newState;
    },
    actionTransformer: (action) => {
        let newAction = {}
        for (var i of Object.keys(action)) {
            if (Iterable.isIterable(action[i])) {
                newAction[i] = action[i].toJS();
            } else {
                newAction[i] = action[i];
            }
        }

        return newAction;
    }
});


const configureStore = preloadedState => {
    const store = createStore(reducers,
        applyMiddleware(thunkMiddleware,
            logger)
    );
    return store
}



export default configureStore;
