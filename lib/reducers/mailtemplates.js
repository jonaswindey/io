import {constants} from 'config/constants'
import createReducer from 'utils/create-reducer'

const initialState = {
  mailTemplates: [],
  mailTemplatesLoaded: false,
  sendState: ''
}

const actionHandlers = {

  [constants.FETCH_MAILTEMPLATES_START]: () => ({ mailTemplatesLoaded: false }),
  [constants.FETCH_MAILTEMPLATES_COMPLETE]: (state, action) => ({
    mailTemplates: action.mailTemplates, mailTemplatesLoaded: true }),

  [constants.SEND_MAILTEMPLATE_START]: () => ({ sendState: 'loading' }),
  [constants.SEND_MAILTEMPLATE_COMPLETE]: () => ({ sendState: 'success' }),
  [constants.SEND_MAILTEMPLATE_RESET]: () => ({ sendState: '' }),
}

export default createReducer(initialState, actionHandlers)
