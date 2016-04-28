import {constants} from 'config/constants'
import {get, post} from 'utils/agent'
import debug from 'debug'
const API = constants.API

export function fetchFiles(project) {
  return async (dispatch) => {
    try {
      debug('dev')(`actions :: fetchfiles (project: ${project})`)
      dispatch({type: constants.FETCH_FILES_START})

      const res = await get(`${API}/files?pagesize=0`)
      const files = res.body.items

      dispatch({
        type: constants.FETCH_FILES_COMPLETE,
        files,
      })
    }
    catch (e){debug('dev')(e)}
  }
}

export function addFile(project, blob, fileName) {
  return async (dispatch) => {
    try {
      debug('dev')('actions :: addFile')
      dispatch({type: constants.ADD_FILE_START})

      const req = post(`${API}/in/testproject`)
      req.attach('file', blob, fileName)

      req.end((err, res) => {
        if (err) debug('dev')(err)
        else {
          dispatch(fetchFiles('testproject'))
          dispatch({type: constants.ADD_FILE_COMPLETE, file: res.body})
        }
      })

    }
    catch (e){
      debug('dev')(e)
    }
  }
}
