import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as applicationActions from 'actions/application'
import {constants} from 'config/constants'
import nock from 'nock'
import expect from 'expect'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const {API} = constants

const initialStore = {
  files: {
    files: [],
    filesLoaded: false,
    fileAdding: false,
    modifiedFile: {},
    project: constants.DEFAULT_PROJECT,
    queue: 0,
  }
}
let store = {}

const filesURI = (project = initialStore.files.project) =>
  `/files?pagesize=0&filters=project:${project}%2Bstatus:active`

describe('file actions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  beforeEach(() => {
    store = mockStore(initialStore)
  })

  it('should fail with invalid login', async () => {

    nock(API).get(filesURI()).reply(200, { items: [{_id: -1}] })

    await store.dispatch(applicationActions.logIn({email: 'test@test.com', password: 'test'}))
    expect(store.getActions()).toEqual([
      {type: constants.LOG_IN_START},
      {type: constants.LOG_IN_FAILED},
    ])
  })

})
