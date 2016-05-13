import '../assets/stylesheets/cyborg.less'
import '../assets/stylesheets/index.scss'
import '../assets/stylesheets/style.scss'
import '../assets/stylesheets/imagegallery.scss'
import '../assets/stylesheets/datatable.scss'
import '../assets/stylesheets/cropper.scss'
import 'react-photoswipe/lib/photoswipe.css'

import React, { PropTypes } from 'react'
import { Router, Route, Redirect, hashHistory } from 'react-router'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import configureStore from './utils/configure-store'
import * as storage from './persistence/storage'
import * as components from './components'
import {constants} from 'config/constants'
import * as i18n from './i18n'
import flatten from './i18n/flatten'

// move to react-router-redux
import {syncHistoryWithStore} from 'react-router-redux'

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

/*if (storage.get('theme'))
  $('head link#theme').attr('href',
    `//maxcdn.bootstrapcdn.com/bootswatch/3.3.5/${storage.get('theme')}/bootstrap.min.css`)*/

const initialState = {
  application: {
    token: storage.get('token'),
    locale,
    user: {}
  }
}

export const store = configureStore(initialState)

const history = syncHistoryWithStore(hashHistory, store)

function getRootChildren (props) {
  const translations = i18n[props.application.locale]
  const messages = flatten(translations)

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

const routes = (
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
)

function renderRoutes () {
  return (
    <Router history={history}>
      {routes}
    </Router>
  )
}

function requireAuth (nextState, replace) {
  const state = store.getState()
  const isLoggedIn = Boolean(state.application.token || (state.application.user && state.application.user._id))
  if (!isLoggedIn)
    replace('/login')
}

function logout (nextState, replace) {
  store.dispatch({ type: constants.LOG_OUT })
  replace('/login')
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
