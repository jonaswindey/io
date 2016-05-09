import {constants} from 'config/constants'
import {get, post, del} from 'utils/agent'
import debug from 'debug'
const {API} = constants

export function changeProject(project) {
  return async dispatch => {
    try {
      debug('dev')(`actions :: change project (project: ${project})`)
      dispatch({type: constants.CHANGE_PROJECT, project})
      dispatch(fetchFiles())
    }
    catch (e){debug('dev')(e)}
  }
}

export function fetchFiles() {
  return async (dispatch, getState) => {
    try {
      const project = getState().files.project
      debug('dev')(`actions :: fetchfiles (project: ${project})`)
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

export function upload(blob, fileName, fileId) {
  return async (dispatch, getState) => {
    try {
      debug('dev')('actions :: addFile')
      dispatch({type: constants.ADD_FILE_START})
      const project = getState().files.project

      let url = `${API}/in/${project}`
      if (fileId && fileId.length > 0)
        url += '/' + fileId

      const req = post(url)
      req.attach('file', blob, fileName)

      req.end((err, res) => {
        if (err) debug('dev')(err)
        else {
          dispatch({type: constants.ADD_FILE_COMPLETE, file: res.body})
          dispatch(fetchFiles())
        }
      })

    }
    catch (e){
      debug('dev')(e)
    }
  }
}

export function remove(id) {
  return async (dispatch, getState) => {
    try {
      const project = getState().files.project
      debug('dev')('actions :: remove file')
      await del (`${API}/in/${project}/${id}`)
      dispatch(fetchFiles())
    }
    catch (e){
      debug('dev')(e)
    }
  }
}
