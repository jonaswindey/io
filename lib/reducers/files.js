import {constants} from 'config/constants'
import createReducer from 'utils/create-reducer'

const initialState = {
  files: [],
  filesLoaded: false,
  fileAdding: false,
  modifiedFile: {},
  project: constants.DEFAULT_PROJECT
}

const actionHandlers = {
  [constants.FETCH_FILES_START]: () => ({ filesLoaded: false, files: [] }),
  [constants.FETCH_FILES_COMPLETE]: (state, action) => {
    const files = action.files
    files.forEach(file => {
      if (file.fileId === state.modifiedFile.fileId) file.modified = true
    })
    return { files, filesLoaded: true }
  },

  [constants.ADD_FILE_START]: () => ({fileAdding: true}),
  [constants.ADD_FILE_COMPLETE]: (state, action) => {
    return {modifiedFile: action.file, fileAdding: false}
  },

  [constants.CHANGE_PROJECT]: (state, action) => ({project: action.project}),
}

export default createReducer(initialState, actionHandlers)
