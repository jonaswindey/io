import {get,post} from '../utils/agent'
import {constants} from 'config/constants'
import * as storage from 'persistence/storage'
import debug from 'debug'

const {API} = constants

export function logIn(options) {
  const { email, password, router, redirect } = options
  return async dispatch => {
    try {
      dispatch({type: constants.LOG_IN_START})
      const res = await post(`${API}/auth`).send({email, password})
      const token = 'bearer ' + res.body.token
      storage.put('token', token)
      storage.put('email', email)
      dispatch({type: constants.LOG_IN, token})
      dispatch(fetchProfile({token, router, redirect}))
    }
    catch (e) {
      dispatch({type: constants.LOG_IN_FAILED})
    }
  }
}

/*export function register(options) {
  const {firstName, lastName, email, password, router} = options
  return async dispatch => {
    try {
      dispatch({type: constants.REGISTER_START})
      const res = await post(`${API}/${APP}/register`).send(
        {firstName, lastName, email, password, locale: localStorage.getItem('locale')}
      )
      if (res.body._id) {
        dispatch({type: constants.REGISTER_COMPLETE})
        const res = await post(`${API}/auth`).send({email, password})
        const token = 'bearer ' + res.body.token
        storage.put('token', token)
        storage.put('email', email)
        dispatch(fetchProfile({token, router, redirect: '/profile'}))
      } else dispatch({type: constants.REGISTER_FAILED})
    }
    catch (e) {
      dispatch({type: constants.REGISTER_FAILED})
    }
  }
}

export function forgot(options) {
  const { email } = options
  return async dispatch => {
    dispatch({type: constants.FORGOT_START})
    await post(`${API}/auth/forgot`).send({email, value: {}})
    return dispatch({type: constants.FORGOT_COMPLETE})
  }
}

export function reset(options) {
  const {password, token, history} = options
  return async () => {
    await post(`${API}/auth/reset`, token).send({password})
    if (history) history.push('/login')
  }
}*/

export function fetchProfile(options) {
  const { token, router, redirect } = options
  return async (dispatch) => {
    dispatch({type: constants.FETCH_PROFILE_START})
    debug('test')('Token: ' + token)
    const none = () => dispatch({type: constants.FETCH_PROFILE_COMPLETE, user: {}})
    if (!token) return none()
    try {
      const res = await get(`${API}/auth/profile`).set('Authorization', token)
      const {user} = res.body
      dispatch({type: constants.FETCH_PROFILE_COMPLETE, user})

      if (router && redirect) router.push(redirect)
    }
    catch (e) {
      debug('test')('Error in fetchProfile with token: ' + options.token)
      debug('test')(e)
      none()
      dispatch({type: constants.FETCH_PROFILE_FAILED})
      if (router) router.push('/login')
    }
  }
}
