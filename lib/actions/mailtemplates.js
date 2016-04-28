import {constants} from 'config/constants'
import {get, post} from 'utils/agent'
import qs from 'qs'
import debug from 'debug'
const API = constants.API

export function fetchMailTemplates() {
  return async dispatch => {
    try {
      debug('dev')('actions :: fetchMailTemplates')
      dispatch({type: constants.FETCH_MAILTEMPLATES_START,})
      const query = qs.stringify({
        page: 1,
        pagesize: 0
      })
      const res = await get(`${API}/mailtemplates?${query}`)
      const mailTemplates = res.body.items
        .filter(item => item.type === 'newsletter')
        .sort((a, b) => {
          if (a.key < b.key) return -1
          if (a.key > b.key) return 1
          return 0
        })
      dispatch({
        type: constants.FETCH_MAILTEMPLATES_COMPLETE,
        mailTemplates
      })
    }
    catch (e){debug('dev')(e.messsage)}
  }
}

export function sendMailTemplate(mailTemplate, recipients) {
  return async dispatch => {
    try {
      debug('dev')('actions :: sendMailTemplate')
      dispatch({type: constants.SEND_MAILTEMPLATE_START,})
      await post(`${API}/carrefour/sendmail`).send({
        mailTemplate,
        recipients
      })
      dispatch({
        type: constants.SEND_MAILTEMPLATE_COMPLETE
      })
    }
    catch (e){debug('dev')(e.messsage)}
  }
}

export function reset() {
  return {type: constants.SEND_MAILTEMPLATE_RESET}
}
