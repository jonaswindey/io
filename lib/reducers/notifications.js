import {constants} from 'config/constants'
import createReducer from 'utils/create-reducer'

const initialState = {
  feedLoaded: false,
  feed: [],
}

const actionHandlers = {
  [constants.FETCH_FEED_START]: () => ({ feedLoaded: false }),
  [constants.FETCH_FEED_COMPLETE]: (state, action) => ({ feed: action.feed, feedLoaded: true }),
}

export default createReducer(initialState, actionHandlers)
