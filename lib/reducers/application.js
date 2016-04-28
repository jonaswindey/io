import {constants} from 'config/constants'
import createReducer from 'utils/create-reducer'
import * as storage from 'persistence/storage'

const initialState = {
  token: storage.get('token'),
  locale: storage.get('locale') || 'en',
  user: {},
  userLoaded: false,
  userLoading: false,
  loginFailed: false,
  loginState: '',
  forgotLoading: false,
  forgotComplete: false,
  updateProfileLoading: false,
  updateProfileComplete: false,
  /*registerLoading: false,
  registerFailed: false,*/
  registerState: '',
  validVAT: false,
}

const actionHandlers = {
  [constants.LOG_IN_START]: () => ({ userLoading: true, loginFailed: false, loginState: 'loading' }),
  [constants.LOG_IN_FAILED]: () => ({ userLoading: false, loginFailed: true, loginState: 'error' }),

  [constants.REGISTER_START]: () => ({ registerState: 'loading' }),
  [constants.REGISTER_FAILED]: () => ({ registerState: 'error' }),

  [constants.FORGOT_START]: () => ({ forgotLoading: true, forgotComplete: false }),
  [constants.FORGOT_COMPLETE]: () => ({ forgotLoading: false, forgotComplete: true }),

  [constants.UPDATE_PROFILE_START]: () => ({ updateProfileLoading: true, updateProfileComplete: false }),
  [constants.UPDATE_PROFILE_COMPLETE]: () =>
    ({ updateProfileLoading: false, updateProfileComplete: true, validVAT: true }),

  [constants.LOGGED_IN]: (_, action) => action.payload,
  [constants.LOG_OUT]: () => ({ token: null, user: {}, loginState: '' }),
  [constants.FETCH_PROFILE_START]: () => ({ userLoading: true }),
  [constants.FETCH_PROFILE_COMPLETE]: (state, action) =>
    ({ user: action.user, userLoaded: true, userLoading: false, registerState: '', validVAT: action.validVAT}),
  [constants.LOG_IN]: (state, action) => ({token: action.token, loginState: 'success'}),
}

export default createReducer(initialState, actionHandlers)
