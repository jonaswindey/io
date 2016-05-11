import {get,post,put} from '../utils/agent'
import {constants} from 'config/constants'
import * as storage from 'persistence/storage'
import debug from 'debug'
import * as userActions from 'actions/users'
import * as productActions from 'actions/products'
import {omit, forOwn} from 'lodash'

const {API, APP} = constants

export function logIn(options) {
  debug('dev')('application :: logIn')
  const { email, password, router, redirect } = options
  debugger
  return async dispatch => {
    try {
      dispatch({type: constants.LOG_IN_START})
      const res = await post(`${API}/auth`).send({email, password})
      const token = 'bearer ' + res.body.token
      storage.put('token', token)
      storage.put('email', email)
      dispatch({type: constants.LOG_IN, token})
      dispatch(fetchProfile({token, router, redirect}))
    }
    catch (e) {
      debug('dev')(e)
      dispatch({type: constants.LOG_IN_FAILED})
    }
  }
}

export function register(options) {
  const {firstName, lastName, email, password, router} = options
  debug('dev')('application :: register')
  return async dispatch => {
    try {
      dispatch({type: constants.REGISTER_START})
      const res = await post(`${API}/${APP}/register`).send(
        {firstName, lastName, email, password, locale: localStorage.getItem('locale')}
      )
      if (res.body._id) {
        dispatch({type: constants.REGISTER_COMPLETE})
        const res = await post(`${API}/auth`).send({email, password})
        const token = 'bearer ' + res.body.token
        storage.put('token', token)
        storage.put('email', email)
        dispatch(fetchProfile({token, router, redirect: '/profile'}))
      } else dispatch({type: constants.REGISTER_FAILED})
    }
    catch (e) {
      debug('dev')(e)
      dispatch({type: constants.REGISTER_FAILED})
    }
  }
}

export function forgot(options) {
  debug('dev')('application :: forgot')
  const { email } = options
  return async dispatch => {
    try {
      dispatch({type: constants.FORGOT_START})
      await post(`${API}/auth/forgot`).send({email, value: {}})
      debug('dev')('FORGOT_COMPLETE')
      return dispatch({type: constants.FORGOT_COMPLETE})
    }
    catch (e) {
      debug('dev')(e)
    }
  }
}

export function reset(options) {
  debug('dev')('application :: reset')
  const {password, token, history} = options
  return async () => {
    try {
      await post(`${API}/auth/reset`, token).send({password})
      if (history) history.push('/login')
    }
    catch (e) {
      debug('dev')(e)
    }
  }
}

export function fetchProfile(options) {
  const { token, router, redirect } = options
  return async (dispatch, getState) => {
    debug('dev')('actions :: fetchProfile')
    dispatch({type: constants.FETCH_PROFILE_START})
    const none = () => dispatch({type: constants.FETCH_PROFILE_COMPLETE, user: {}})
    if (!token) return none()
    try {
      const res = await get(`${API}/auth/profile`).set('Authorization', token)
      const {user} = res.body
      user.groups = {}
      const categories = ['client','office','supplier']
      categories.forEach(key =>
        user.groups[key] = user.categories.some(s => s.key === key)
      )
      // connect to socket
      // dispatch(socketActions.connect())

      await dispatch(userActions.fetchUserAttributes())
      await dispatch(userActions.fetchUserCategories())
      await dispatch(productActions.fetchProductCategories())

      const attributes = {}
      user.attributes.forEach(userAttribute => {
        const attribute = getState().users.userAttributes.find(
          _userAttribute => _userAttribute._id === userAttribute.attribute)
        if (attribute) attributes[attribute.key] = userAttribute.value
      })
      user.attributesMap = attributes
      const map = key => user.attributesMap[key]

      // find user sector
      let sectors = []
      // find category 'sector'
      if (getState().users.userCategories.length > 0) {
        const sectorCategory = getState().users.userCategories.find(userCategory => {
          return userCategory.key === 'sector'
        })
        if (sectorCategory)
          sectors = sectorCategory.children
      }
      if (map('sector')) {
        const sector = sectors.find(sector => sector._id === map('sector'))
        if (sector) {
          user.sector = sector.key
          if (map('subSector')) {
            const subSector = sector.children.find(subSector => subSector._id === map('subSector'))
            if (subSector) user.subSector = subSector.key
          }
        }
      }

      // calculate sector prefixes
      let placementPrefix
      if (user.sector === 'freshProducts') placementPrefix = 'F'
      if (user.subSector === 'groceries') placementPrefix = 'P'
      if (user.subSector === 'beverages') placementPrefix = 'P'
      if (user.subSector === 'hpc') placementPrefix = 'D'
      if (user.subSector === 'nonfoodTextile') placementPrefix = 'T'
      if (user.subSector === 'carrefourDepartment') placementPrefix = 'C'
      if (user.subSector === 'technicalSuppliers') placementPrefix = 'A'

      user.placementPrefix = placementPrefix

      const validVAT = (user.attributesMap.invoiceContactVAT && user.attributesMap.invoiceContactVAT.length > 0) ||
        (user.attributesMap.salesContactVAT && user.attributesMap.salesContactVAT.length > 0)

      dispatch({type: constants.FETCH_PROFILE_COMPLETE, user, validVAT})

      if (router && redirect) router.push(validVAT ? redirect : '/profile')
    }
    catch (e) {
      debug('dev')(e)
      none()
      if (router) router.push('/login')
    }
  }
}

export function updateProfile(user, attributesMap, userAttributes, history) {
  return async (dispatch) => {
    try {
      dispatch({type: constants.UPDATE_PROFILE_START})
      const id = user._id
      user = omit(
        user, 'categories', '_id', '__v', 'attributesMap', 'subSector', 'sector', 'groups', 'placementPrefix')

      forOwn(attributesMap, (value, key) => {
        const _attribute = userAttributes.find(userAttribute => userAttribute.key === key)
        if (_attribute) {
          const _attributeValue = user.attributes.find(attribute => attribute.attribute === _attribute._id)
          if (_attributeValue) _attributeValue.value = value
          else
          user.attributes.push({
            attribute: _attribute._id,
            value
          })
        }
      })
      await put(constants.API + '/users/' + id).send(user)
      dispatch({type: constants.UPDATE_PROFILE_COMPLETE})
      dispatch(this.fetchProfile({token: storage.get('token'), history, redirect: '/request'}))
    }
    catch (e) {
      debug('dev')('Update profile failed:')
      debug('dev')(e)
    }
  }
}
