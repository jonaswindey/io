import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from '../middleware/logger'
import persistenceStore from '../persistence/store'
import * as reducers from '../reducers'
import { routerReducer } from 'react-router-redux'

const storeEnhancers = [
  persistenceStore,
]

const finalCreateStore = compose(
  applyMiddleware(thunk, logger),
  ...storeEnhancers,
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const combinedReducer = combineReducers(Object.assign({
  routing: routerReducer
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
