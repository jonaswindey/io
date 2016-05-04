import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Root, { store } from './Root'
import { addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en'
import fr from 'react-intl/locale-data/fr'
import nl from 'react-intl/locale-data/nl'
import it from 'react-intl/locale-data/it'
import pl from 'react-intl/locale-data/pl'

[en, nl, fr, pl, it].forEach(lang => addLocaleData(lang))

// All modern browsers, expect `Safari`, have implemented
// the `ECMAScript Internationalization API`.
// For that we need to patch in on runtime.
if (!global.Intl)
  require.ensure(['intl'], require => {
    require('intl').default
    start()
  }, 'IntlBundle')
else start()

function start () {
  ReactDOM.render(
    <Provider store={store}>
      <Root />
    </Provider>
  , document.getElementById('app'))
}
