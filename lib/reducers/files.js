import {constants} from 'config/constants'
import createReducer from 'utils/create-reducer'

const initialState = {
  files: [],
  filesLoaded: false,
  fileAdding: false,
}

const actionHandlers = {
  [constants.FETCH_FILES_START]: () => ({ filesLoaded: false, files: [] }),
  [constants.FETCH_FILES_COMPLETE]: (state, action) => ({ files: action.files, filesLoaded: true }),

  [constants.ADD_FILE_START]: () => ({fileAdding: true}),
  [constants.ADD_FILE_COMPLETE]: () => ({fileAdding: false}),
}

export default createReducer(initialState, actionHandlers)
