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

describe('file actions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  beforeEach(() => {
    store = mockStore(initialStore)
  })

  it('should successfully login', async () => {
    nock(API).post('/auth').reply(200, {token: '123'})
    nock(API).get('/auth/profile').reply(200, {})
    await store.dispatch(applicationActions.logIn({email: 'test@test.com', password: 'test'}))
    expect(store.getActions()).toEqual([
      {type: constants.LOG_IN_START},
      {type: constants.LOG_IN, token: 'bearer 123'},
      {type: constants.FETCH_PROFILE_START},
    ])
  })

  it('should successfully login but fail with empty/undefined token', async () => {
    nock(API).post('/auth').reply(200, {})
    nock(API).get('/auth/profile').reply(200, {})
    await store.dispatch(applicationActions.logIn({email: 'test@test.com', password: 'test'}))
    expect(store.getActions()).toEqual([
      {type: constants.LOG_IN_START},
      {type: constants.LOG_IN, token: 'bearer undefined'},
      {type: constants.FETCH_PROFILE_START},
    ])
  })

  it('should fail with invalid login', async () => {
    nock(API).post('/auth').reply(500, {})
    await store.dispatch(applicationActions.logIn({email: 'test@test.com', password: 'test'}))
    expect(store.getActions()).toEqual([
      {type: constants.LOG_IN_START},
      {type: constants.LOG_IN_FAILED},
    ])
  })

  it('should return empty user when fetch profile is called without token', () => {
    store.dispatch(applicationActions.fetchProfile({}))
    expect(store.getActions()).toEqual([
      {type: constants.FETCH_PROFILE_START},
      {type: constants.FETCH_PROFILE_COMPLETE, user: {}},
    ])
  })

  it('should throw error when fetch profile url is invalid', async () => {
    nock(API).get('/auth/profile').reply(500, {})
    await store.dispatch(applicationActions.fetchProfile({token: '123'}))
    expect(store.getActions()).toEqual([
      {type: constants.FETCH_PROFILE_START},
      {type: constants.FETCH_PROFILE_COMPLETE, user: {}},
      {type: constants.FETCH_PROFILE_FAILED},
    ])
  })

})
