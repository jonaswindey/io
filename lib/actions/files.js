import {constants} from 'config/constants'
import {get, post} from 'utils/agent'
import debug from 'debug'
const {API, DEFAULT_PROJECT} = constants

export function fetchFiles(project) {
  return async dispatch => {
    try {
      debug('dev')(`actions :: fetchfiles (project: ${project})`)
      dispatch({type: constants.FETCH_FILES_START})

      const res = await get(`${API}/files?pagesize=0&filters=project:${DEFAULT_PROJECT}`)
      const files = res.body.items

      dispatch({
        type: constants.FETCH_FILES_COMPLETE,
        files,
      })
    }
    catch (e){debug('dev')(e)}
  }
}

export function upload(project, blob, fileName, fileId) {
  return async (dispatch) => {
    try {
      debug('dev')('actions :: addFile')
      dispatch({type: constants.ADD_FILE_START})

      let url = `${API}/in/${DEFAULT_PROJECT}`
      if (fileId && fileId.length > 0)
        url += '/' + fileId

      const req = post(url)
      req.attach('file', blob, fileName)

      req.end((err, res) => {
        if (err) debug('dev')(err)
        else {
          dispatch({type: constants.ADD_FILE_COMPLETE, file: res.body})
          dispatch(fetchFiles(DEFAULT_PROJECT))
        }
      })

    }
    catch (e){
      debug('dev')(e)
    }
  }
}
