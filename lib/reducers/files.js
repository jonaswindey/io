import {constants} from 'config/constants'
import createReducer from 'utils/create-reducer'

const initialState = {
  files: [],
  filesLoaded: false,
  fileAdding: false,
  modifiedFile: {},
  project: constants.DEFAULT_PROJECT,
  queue: 0,
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

  [constants.UPLOAD_START]: (state, action) => ({fileAdding: true, queue: action.queue}),
  [constants.UPLOAD_COMPLETE]: (state, action) => {
    let queue = state.queue
    queue--
    return {modifiedFile: action.file, fileAdding: queue > 0, queue}
  },

  [constants.CHANGE_PROJECT]: (state, action) => ({project: action.project}),
}

export default createReducer(initialState, actionHandlers)
