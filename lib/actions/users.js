import {constants} from 'config/constants'
import {get, post, put, del} from 'utils/agent'
import qs from 'qs'
import debug from 'debug'
import {defaults, omit} from 'lodash'
import {getAttributes} from 'utils/attributehelper'
const API = constants.API

export function fetchUser(_id, options = {}) {
  return async (dispatch, getState) => {
    try {
      dispatch({type: constants.FETCH_USER_START})

      await dispatch(fetchUserAttributes())
      await dispatch(fetchUserCategories())

      defaults(options, {select: '+activity'})
      const query = qs.stringify(options)
      const res = await get(`${API}/users/${_id}?${query}`)
      dispatch({
        type: constants.FETCH_USER_COMPLETE,
        user: res.body
      })

      const {user, userAttributes} = getState().users
      const formValue = Object.create(user)
      user.attributes.forEach(attribute => {
        const userAttribute =
          userAttributes.find(
            _attribute => _attribute._id === attribute.attribute
          )
        if (userAttribute)
          formValue[userAttribute.key] = attribute.value
      })
      dispatch({
        type: constants.SET_USER_FORM_VALUE_USER,
        formValue
      })
    }
    catch (e){debug('dev')(e)}
  }
}

export function clearUser() {
  return async dispatch => {
    await dispatch(fetchUserAttributes())
    dispatch({type: constants.CLEAR_USER})
  }
}

export function fetchUserAttributes() {
  return async (dispatch, getState) => {
    try {
      debug('dev')('actions :: fetchUserAttributes')
      if (getState().users.userAttributesLoaded) return Promise.resolve()
      const query = qs.stringify({
        page: 1,
        pagesize: 0
      })
      const res = await get(`${API}/userattributes?${query}`)
      dispatch({
        type: constants.FETCH_USER_ATTRIBUTES,
        userAttributes: res.body.items
      })
    }
    catch (e){debug('dev')(e.messsage)}
  }
}

export function fetchUserCategories() {
  return async (dispatch, getState) => {
    try {
      debug('dev')('actions :: fetchUserCategories')
      if (getState().users.userCategoriesLoaded) return Promise.resolve()
      const res = await get(`${API}/usercategories/tree`)
      dispatch({
        type: constants.FETCH_USER_CATEGORIES,
        userCategories: res.body
      })
    }
    catch (e){debug('dev')(e.messsage)}
  }
}

export function fetchUsers
  (options, {pagesize = 0, /*populate = 'attributes.attribute'*/} = {}) {
  return async (dispatch, getState) => {
    try {
      debug('dev')('users :: fetchUsers')
      dispatch({type: constants.FETCH_USERS_START})

      Object.assign(options,
        {pagesize: pagesize},
        //{populate: populate}
      )

      const query = qs.stringify(options)

      const res = await get(`${API}/users?${query}`)
      const users = res.body.items

      users.forEach(user => {
        const attributes = {}
        user.attributes.forEach(userAttribute => {
          const attribute = getState().users.userAttributes.find(
            _userAttribute => _userAttribute._id === userAttribute.attribute)
          if (attribute) attributes[attribute.key] = userAttribute.value
        })
        user.attributesMap = attributes
        user.exhibitorName = attributes['exhibitorName'] ? attributes['exhibitorName'] : ''
      })

      return dispatch({
        type: constants.FETCH_USERS_COMPLETE,
        users
      })
    }
    catch (e){
      debug('dev')(e.stack)
    }
  }
}

export function fetchUsersReporting() {
  return async (dispatch) => {
    try {
      debug('dev')('users :: fetchUsers')
      dispatch({type: constants.FETCH_USERS_START})

      const res = await get(`${API}/carrefour/reporting/users`)
      const users = res.body

      return dispatch({
        type: constants.FETCH_USERS_COMPLETE,
        users
      })
    }
    catch (e){
      debug('dev')(e.stack)
    }
  }
}

export function fetchUser(id) {
  return async dispatch => {
    try {
      dispatch({type: constants.FETCH_USER_START})
      const res = await get(`${API}/users/${id}`)
      return dispatch({
        type: constants.FETCH_USER_COMPLETE,
        user: res.body
      })
    }
    catch (e){
      debug('dev')(e.stack)
    }
  }
}


export function create(model, userAttributes, router) {
  return async dispatch => {
    dispatch({type: constants.CREATE_USER_START})
    const query = qs.stringify({
      page: 1,
      pagesize: 0
    })
    const last = await get(`${API}/users?${query}`)
    const reference =
      (parseInt(last.body.items[0].reference, 0) + 1).toString()
    const user = {
      reference,
      status: 'created'
    }

    for (let key in model)
      if (key && user.hasOwnProperty(key))
        user[key] = model[key]

    user.attributes = getAttributes(model, userAttributes)
    user.attributes.push({
      attribute:
        constants.USER_ATTRIBUTES.step_client,
      value:
        constants.USER_ATTRIBUTE_CHOICES.step_client.client_request_amended
    })
    const res = await post(`${API}/users`).send(user)
    dispatch({type: constants.CREATE_USER_COMPLETE})
    if (router) router.transitionTo(`/users/detail/${res.body._id}`)
  }
}

export function update(user, model, userAttributes) {
  return async dispatch => {
    dispatch({type: constants.UPDATE_USER_START})

    for (let key in model)
      if (key && user.hasOwnProperty(key))
        user[key] = model[key]
      else if (key === 'password' && model.password)
        user.password = model.password

    if (model && userAttributes)
      user.attributes = getAttributes(
        model, userAttributes, user.attributes)

    const data = omit(user, '_id', '__v')
    await put(`${API}/users/${user._id}`).send(data)
    /* filemaker sync disabled for now
    const sync =
      await get(constants.API + `/garment/user/${user.reference}/sync`)
    */
    dispatch({type: constants.UPDATE_USER_COMPLETE})
    dispatch(fetchUser(user._id))
  }
}

export function remove(id) {
  return async dispatch => {
    dispatch({type: constants.REMOVE_USER_START})
    await del(`${API}/users/${id}`)
    dispatch({type: constants.REMOVE_USER_COMPLETE})
    return dispatch(fetchUsers({},{pageSize: 0}))
  }
}

export function addComment(value) {
  return async (dispatch, getState) => {
    dispatch({type: constants.ADD_COMMENT_USER_START})
    const data = {
      type: 'comment',
      value,
    }
    const res = await post(
      `${API}/users/${getState().users.user._id}/activity`)
      .send(data)

    dispatch({
      type: constants.ADD_COMMENT_USER_COMPLETE,
      activity: res.body,
    })
  }
}

export function selectUsers(users, checked) {
  users.forEach(user => user.checked = !user.checked)
  return dispatch => dispatch({type: constants.SELECT_USERS, users, checked})
}

export function clearSelection() {
  return dispatch => dispatch({type: constants.CLEAR_USER_SELECTION})
}
