import {constants} from 'config/constants'
import {get, post, del} from 'utils/agent'
import debug from 'debug'
const {API} = constants

const fetchFiles = (project = constants.DEFAULT_PROJECT) => {
  return async dispatch => {
    try {
      dispatch({type: constants.FETCH_FILES_START})
      const url = `${API}/files?pagesize=0&filters=project:${project}%2Bstatus:active`
      const res = await get(url)
      const files = res.body.items
      return dispatch({
        type: constants.FETCH_FILES_COMPLETE,
        files,
      })
    }
    catch (e){
      dispatch({type: constants.FETCH_FILES_FAILED})
    }
  }
}

const changeProject = project => {
  return async dispatch => {
    dispatch({type: constants.CHANGE_PROJECT})
    dispatch(fetchFiles(project))
  }
}

const upload = (blob, fileName, fileId) => {
  return async (dispatch, getState) => {
    try {
      const project = getState().files.project

      let url = `${API}/in/${project}`
      if (fileId && fileId.length > 0)
        url += '/' + fileId

      const req = post(url)
      req.attach('file', blob, fileName)

      req.end((err, res) => {
        if (err) debug('dev')(err)
        else {
          dispatch({type: constants.UPLOAD_COMPLETE, file: res.body})
          if (getState().files.queue === 0)
            dispatch(fetchFiles())
        }
      })

    }
    catch (e){
      debug('dev')(e)
    }
  }
}

const uploadFiles = files => {
  return async (dispatch) => {
    dispatch({type: constants.UPLOAD_START, queue: files.length})
    files.forEach(file => {
      dispatch(upload(file, file.name, null))
    })
  }
}

const uploadFile = (file, fileName, fileId) => {
  return async (dispatch) => {
    dispatch({type: constants.UPLOAD_START, queue: 1})
    dispatch(upload(file, fileName, fileId))
  }
}

const remove = id => {
  return async (dispatch, getState) => {
    try {
      dispatch({type: 'REMOVE_FILE_START'})
      const project = getState().files.project
      await del(`${API}/in/${project}/${id}`)
      dispatch({type: 'REMOVE_FILE_COMPLETE'})
      dispatch(fetchFiles())
    }
    catch (e){
      dispatch({type: 'REMOVE_FILE_FAILED'})
    }
  }
}

export {fetchFiles, changeProject, upload, uploadFile, uploadFiles, remove}
