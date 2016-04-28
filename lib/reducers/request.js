import {constants} from 'config/constants'
import createReducer from 'utils/create-reducer'
import debug from 'debug'

const initialState = {
  request: {}
}

const actionHandlers = {
  [constants.UPDATE_REQUEST]: (state, action) => {
    debug('dev')('reducer: UPDATE_REQUEST')
    return ({request: Object.assign({}, state.request, action.data)})
  },

  [constants.CLEAR_REQUEST]: () => {
    debug('dev')('reducer: CLEAR_REQUEST')
    return ({request: {}})
  }
}

export default createReducer(initialState, actionHandlers)
