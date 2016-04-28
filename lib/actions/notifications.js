import {constants} from 'config/constants'
import {get} from 'utils/agent'

const API = constants.API

export function fetchFeed() {
  return async dispatch => {
    dispatch({type: constants.FETCH_FEED_START})

    const res = await get(`${API}/garment/feed`)
    return dispatch({
      type: constants.FETCH_FEED_COMPLETE,
      feed: res.body
    })
  }
}
