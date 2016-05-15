import {constants} from 'config/constants'
import {get, post, del} from 'utils/agent'
import debug from 'debug'
const {API} = constants

export const fetchFiles = () => {
  return async (dispatch, getState) => {
    try {
      const project = getState().files.project
      dispatch({type: constants.FETCH_FILES_START})

      const res = await get(`${API}/files?pagesize=0&filters=project:${project}%2Bstatus:active`)
      const files = res.body.items

      dispatch({
        type: constants.FETCH_FILES_COMPLETE,
        files,
      })
    }
    catch (e){debug('dev')(e)}
  }
}

export const changeProject = project => {
  return async dispatch => {
    try {
      dispatch({type: constants.CHANGE_PROJECT, project})
      dispatch(fetchFiles())
    }
    catch (e){debug('dev')(e)}
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

export const uploadFiles = files => {
  return async (dispatch) => {
    try {
      dispatch({type: constants.UPLOAD_START, queue: files.length})
      files.forEach(file => {
        dispatch(upload(file, file.name, null))
      })
    }
    catch (e){
      debug('dev')(e)
    }
  }
}

export const uploadFile = (file, fileName, fileId) => {
  return async (dispatch) => {
    try {
      dispatch({type: constants.UPLOAD_START, queue: 1})
      dispatch(upload(file, fileName, fileId))
    }
    catch (e){
      debug('dev')(e)
    }
  }
}

export const remove = id => {
  return async (dispatch, getState) => {
    try {
      const project = getState().files.project
      await del (`${API}/in/${project}/${id}`)
      dispatch(fetchFiles())
    }
    catch (e){
      debug('dev')(e)
    }
  }
}
