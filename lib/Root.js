/*global $*/
import '../assets/stylesheets/index.scss'
import '../assets/stylesheets/style.scss'
import '../assets/stylesheets/imagegallery.scss'
import '../assets/stylesheets/datatable.scss'
import '../assets/stylesheets/cropper.scss'

import React, { PropTypes } from 'react'
import { Route, Redirect } from 'react-router'
import { ReduxRouter } from 'redux-router'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import configureStore from './utils/configure-store'
import * as storage from './persistence/storage'
import * as components from './components'
import {constants} from 'config/constants'
import * as i18n from './i18n'
import flatten from './i18n/flatten'

// custom 3nit
import debug from 'debug'
debug.enable('dev')

const {
  Application,
  Home,
  Profile,
  Login,
  Forgot,
  Reset,
} = components

const locale = 'en'
storage.put('locale', locale)

const themes = ['cerulean', 'cosmo', 'cyborg', 'darkly', 'flatly', 'lumen', 'paper', 'readable', 'sandstone',
  'simplex', 'slate', 'spacelab', 'superhere', 'united', 'yeti']

let theme
if (storage.get('theme')) theme = storage.get('theme')
else
  theme = themes[Math.floor(Math.random() * themes.length)]

$('head link#theme').attr('href','//maxcdn.bootstrapcdn.com/bootswatch/3.3.5/'+theme+'/bootstrap.min.css')

const initialState = {
  application: {
    token: storage.get('token'),
    locale,
    user: {}
  }
}

export const store = configureStore(initialState)

function getRootChildren (props) {
  debug('dev')('locale:')
  debug('dev')(props.application.locale)

  const translations = i18n[props.application.locale]
  debug('dev')('translations:')
  debug('dev')(translations)

  const messages = flatten(translations)
  debug('dev')('messages:')
  debug('dev')(messages)

  const intlData = {
    locale: props.application.locale,
    messages
  }
  const rootChildren = [
    <IntlProvider key="intl" {...intlData}>
      {renderRoutes()}
    </IntlProvider>
  ]

  return rootChildren
}

function renderRoutes () {
  return (
    <ReduxRouter>
      <Route component={Application}>
        <Redirect from="/" to="/home" />
        <Route
          path="/home" component={Home}
          onEnter={requireAuth}
          />
        <Route
          name='profile'
          path='profile'
          component={Profile}
          onEnter={requireAuth}
           />
        <Route path="login" component={Login}/>
        <Route path="forgot" component={Forgot}/>
        <Route path="reset" component={Reset}/>
        <Route path="logout" onEnter={logout}/>
      </Route>
    </ReduxRouter>
  )
}

function requireAuth (nextState, replaceState) {
  const state = store.getState()
  const isLoggedIn = Boolean(state.application.token || (state.application.user && state.application.user._id))
  if (!isLoggedIn)
    replaceState({
      nextPathname: nextState.location.pathname
    }, '/login')
}

function logout (nextState, replaceState) {
  store.dispatch({ type: constants.LOG_OUT })
  replaceState({}, '/login')
}

class Root extends React.Component {
  static propTypes = {
    application: PropTypes.object.isRequired
  }

  render() {
    return <div>{getRootChildren(this.props)}</div>
  }
}

export default connect(({ application }) => ({ application }))(Root)
