import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { reduxReactRouter, routerStateReducer } from 'redux-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import createHashHistory from 'history/lib/createHashHistory'
import thunk from 'redux-thunk'
import logger from '../middleware/logger'
import persistenceStore from '../persistence/store'
import * as reducers from '../reducers'

const createHistory = process.env.NODE_ENV === 'production' ? createHashHistory : createBrowserHistory

const storeEnhancers = [
  persistenceStore,
  reduxReactRouter({ createHistory })
]

const finalCreateStore = compose(
  applyMiddleware(thunk, logger),
  ...storeEnhancers,
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const combinedReducer = combineReducers(Object.assign({
  router: routerStateReducer
}, reducers))

export default function configureStore (initialState) {

  const store = finalCreateStore(combinedReducer, initialState)

  if (module.hot)
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })

  return store
}
