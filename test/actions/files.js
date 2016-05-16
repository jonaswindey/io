import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import stream from 'stream'

import * as fileActions from 'actions/files'
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

  it('should fetch files', async () => {
    nock(API).get(filesURI()).reply(200, { items: [{_id: -1}] })
    await store.dispatch(fileActions.fetchFiles())
    expect(store.getActions()).toEqual([
      {type: constants.FETCH_FILES_START},
      {type: constants.FETCH_FILES_COMPLETE, files: [{_id: -1}]}
    ])
  })

  it('should fetch files and throw error when url is invalid', async () => {
    nock(API).get(filesURI()).reply(500)
    await store.dispatch(fileActions.fetchFiles())
    expect(store.getActions()).toEqual([
      {type: constants.FETCH_FILES_START},
      {type: constants.FETCH_FILES_FAILED},
    ])
  })

  it('should change project', async () => {
    nock(API).get(filesURI('test')).reply(200, { items: [{_id: -1}] })
    await store.dispatch(fileActions.changeProject('test'))
    expect(store.getActions()).toEqual([
      {type: constants.CHANGE_PROJECT},
      {type: constants.FETCH_FILES_START},
    ])
  })

  it('should throw error when changing project and url is invalid', async () => {
    nock(API).get(filesURI('test')).reply(500)
    await store.dispatch(fileActions.changeProject('test'))
    expect(store.getActions()).toEqual([
      {type: constants.CHANGE_PROJECT},
      {type: constants.FETCH_FILES_START},
    ])
  })

  it('should remove file and fetch files', async () => {

    nock(API).get(filesURI()).reply(200, { items: [{_id: -1}] })
    nock(API).delete(`/in/${initialStore.files.project}/-1`).reply(200, { items: [{_id: -1}] })
    await store.dispatch(fileActions.remove(-1))
    expect(store.getActions()).toEqual([
      {type: constants.REMOVE_FILE_START},
      {type: constants.REMOVE_FILE_COMPLETE},
      {type: constants.FETCH_FILES_START},
    ])
  })

  it('should throw error when removing file and url is invalid', async () => {
    nock(API).delete('/in/test/-1').reply(500)
    await store.dispatch(fileActions.remove(-1))
    expect(store.getActions()).toEqual([
      {type: constants.REMOVE_FILE_START},
      {type: constants.REMOVE_FILE_FAILED},
    ])
  })

  it('should upload a single file', async () => {
    nock(API).post('/in/jonas/fileId').reply({})
    nock(API).post('/in/jonas').reply({})
    const file = new stream.Readable()
    file.push('test file')
    file.push(null)
    await store.dispatch(fileActions.uploadFile(file, 'test', 'fileId'))
    expect(store.getActions()).toEqual([
      {type: constants.UPLOAD_START, queue: 1},
    ])
  })

  it('should upload multiple files', async () => {
    nock(API).post('/in/jonas/fileId').reply({})
    nock(API).post('/in/jonas').reply({})
    const file1 = new stream.Readable()
    file1.push('test file')
    file1.push(null)
    const file2 = new stream.Readable()
    file2.push('test file')
    file2.push(null)
    await store.dispatch(fileActions.uploadFiles([file1, file2]))
    expect(store.getActions()).toEqual([
      {type: constants.UPLOAD_START, queue: 2},
    ])
  })

  it('should throw error when upload url is invalid ', async () => {
    nock(API).post('/in/jonas/fileId').reply(500)
    nock(API).post('/in/jonas').reply(500)
    const file = new stream.Readable()
    file.push('test file')
    file.push(null)
    await store.dispatch(fileActions.uploadFile(file, 'test', 'fileId'))
    expect(store.getActions()).toEqual([
      {type: constants.UPLOAD_START, queue: 1},
    ])
  })

})
