import debug from 'debug'

import {should} from 'chai'
should()

// debug.enable('dev')
debug.enable('test')

debug('test')('Starting tests')

/* setup.js */

const jsdom = require('jsdom').jsdom

const exposedProperties = ['window', 'navigator', 'document']

global.document = jsdom('')
global.window = document.defaultView
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}
