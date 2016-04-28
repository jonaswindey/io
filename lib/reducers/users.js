import {constants} from 'config/constants'
import createReducer from 'utils/create-reducer'

const initialState = {
  userAttributes: [],
  userCategories: [],
  userAttributesLoaded: false,
  userCategoriesLoaded: false,
  users: [],
  usersLoaded: false,
  user: {},
  userLoaded: false,
  userUpdating: false,
  formLoaded: false,
  formValue: {},
  commentAdding: false,
  selection: []
}

const actionHandlers = {
  [constants.FETCH_USER_ATTRIBUTES]: (state, action) =>
    ({ userAttributes: action.userAttributes, userAttributesLoaded: true }),

  [constants.FETCH_USER_CATEGORIES]: (state, action) =>
    ({ userCategories: action.userCategories, userCategoriesLoaded: true }),

  [constants.FETCH_USERS_START]: () => ({ usersLoaded: false }),
  [constants.FETCH_USERS_COMPLETE]: (state, action) => ({ users: action.users, usersLoaded: true }),

  [constants.FETCH_USER_START]: () => ({ userLoaded: false }),
  [constants.FETCH_USER_COMPLETE]: (state, action) => ({ user: action.user, userLoaded: true }),

  [constants.USER]: () => ({ userLoaded: false, formLoaded: false }),
  [constants.FETCH_USER_COMPLETE]: (state, action) => ({ user: action.user, userLoaded: true }),

  [constants.CLEAR_USER]: () => ({ user: {}, userLoaded: true, formValue: {} }),
  [constants.FETCH_USER_FORM_VALUE]: (state, action) => ({ formValue: action.value, formLoaded: true }),
  [constants.SET_USER_FORM_VALUE]: (state, action) => ({ formValue: action.formValue, formLoaded: true }),

  [constants.CREATE_USER_START]: () => ({ userLoaded: false, formLoaded: false }),
  [constants.CREATE_USER_COMPLETE]: () => ({ userLoaded: false, formLoaded: false }),

  [constants.UPDATE_USER_START]: () => ({ userLoaded: false, formLoaded: false, userUpdating: true }),
  [constants.UPDATE_USER_COMPLETE]: () => ({ userLoaded: false, formLoaded: false, userUpdating: false }),

  [constants.ADD_COMMENT_USER_START]: () => ({ commentAdding: true }),
  [constants.ADD_COMMENT_USER_COMPLETE]: (state, action) => {
    const user = state.user
    if (user.activity) user.activity.push(action.activity)
    return ({
      user,
      commentAdding: false
    })
  },

  [constants.SELECT_USERS]: (state, action) => {
    const selection = state.selection
    action.users.forEach(user => {
      if (action.checked) selection.push(user)
      else selection.splice(selection.indexOf(user), 1)
    })
    return ({
      selection
    })
  },

  [constants.CLEAR_USER_SELECTION]: (state) => {
    const selection = state.selection
    selection.forEach(user => user.checked = false)
    return ({selection: []})
  },
}

export default createReducer(initialState, actionHandlers)
