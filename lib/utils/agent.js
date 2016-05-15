import * as storage from 'persistence/storage'
//import superagent from 'superagent'

const superagentPromisePlugin = require('superagent-promise-plugin')
const superagent = superagentPromisePlugin.patch(require('superagent'))

export function get(call, token = storage.get('token')) {
  return superagent.get(call).set('Authorization', token)
}
export function post(call, token = storage.get('token')) {
  return superagent.post(call).set('Authorization', token)
}
export function put(call, token = storage.get('token')) {
  return superagent.put(call).set('Authorization', token)
}

export function del(call, token = storage.get('token')) {
  return superagent.del(call).set('Authorization', token)
}
