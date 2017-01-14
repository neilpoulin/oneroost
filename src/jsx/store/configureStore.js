import reducers from "reducers"
import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"
import createLogger from "redux-logger"

const loggerMiddleware = createLogger()

const configureStore = preloadedState => {
    const store = createStore(reducers,
        applyMiddleware(thunkMiddleware,
            loggerMiddleware));

// Below is from redux/examples/real-world
  // const store = createStore(
  //   rootReducer,
  //   preloadedState,
  //   compose(
  //     applyMiddleware(thunk, api, createLogger()),
  //     DevTools.instrument()
  //   )
  // )
  //
  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('../reducers', () => {
  //     const nextRootReducer = require('../reducers').default
  //     store.replaceReducer(nextRootReducer)
  //   })
  // }

  return store
}



export default configureStore;
