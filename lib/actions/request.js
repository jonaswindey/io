import {constants} from 'config/constants'
import debug from 'debug'

export function updateRequest(data) {
  debug('dev')('actions :: updateRequest')
  return {type: constants.UPDATE_REQUEST, data}
}

export function clearRequest() {
  debug('dev')('actions :: clearRequest')
  return {type: constants.CLEAR_REQUEST}
}
