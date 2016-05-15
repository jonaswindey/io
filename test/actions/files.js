import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as fileActions from 'actions/files'
import {constants} from 'config/constants'
import nock from 'nock'
import expect from 'expect'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const {API} = constants

const store = mockStore({
  files: {
    files: [],
    filesLoaded: false,
    fileAdding: false,
    modifiedFile: {},
    project: constants.DEFAULT_PROJECT,
    queue: 0,
  }
})

describe('file actions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  it('should fetch files', async () => {
    nock(API).get('/files?pagesize=0&filters=project:jonas%2Bstatus:active').reply(200, { items: [{_id: -1}] })

    await store.dispatch(fileActions.fetchFiles())

    const expectedActions = [
      { type: constants.FETCH_FILES_START },
      { type: constants.FETCH_FILES_COMPLETE,  files: [{_id: -1}] }
    ]

    expect(store.getActions()).toEqual(expectedActions)
  })
})
