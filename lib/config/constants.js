import createConstants from 'utils/create-constants'

console.log('NODE_ENV (intial): ' + process.env.NODE_ENV)
const FORCE_REMOTE = true
  && process.env.NODE_ENV !== 'test'

export const getAPI = function() {
  console.log('Node env: ' + process.env.NODE_ENV)
  console.log('FORCE_REMOTE: ' + FORCE_REMOTE)
  return !FORCE_REMOTE && process.env.NODE_ENV === 'development' ? 'http://l:9091' : 'http://io-api.3nit.io'
}

export const constants = {
  ...createConstants(
    'LOGGED_IN',
    'LOG_OUT',
    'FETCH_PROFILE_START',
    'FETCH_PROFILE_COMPLETE',
    'FETCH_PROFILE_FAILED',
    'LOG_IN',
    'LOG_IN_START',
    'LOG_IN_FAILED',

    'REGISTER_START',
    'REGISTER_COMPLETE',
    'REGISTER_FAILED',

    'UPDATE_PROFILE_START',
    'UPDATE_PROFILE_COMPLETE',

    'FORGOT_START',
    'FORGOT_COMPLETE',

    'SOCKET_CONNECTED',
    'SOCKET_AUTHENTICATED',
    'SOCKET_JOIN_INQUIRY',
    'SOCKET_UPDATE_INQUIRY',
    'JOIN_USER_SUCCESS',

    'FETCH_FILES_START',
    'FETCH_FILES_COMPLETE',
    'FETCH_FILES_FAILED',
    'CHANGE_PROJECT',
    'CHANGE_PROJECT_FAILED',
    'REMOVE_FILE_START',
    'REMOVE_FILE_COMPLETE',
    'REMOVE_FILE_FAILED',

    'UPLOAD_START',
    'UPLOAD_COMPLETE',
    'UPLOAD_FAILED',
  ),
  APP: 'io',
  API: getAPI(),
  SOCKET: getAPI(),
  DEFAULT_PROJECT: 'jonas',

}
