import expect from 'expect'

describe('constants', () => {

  it('should call default constants', () => {
    process.env.NODE_ENV = 'production'
    const api = require('config/constants').getAPI()
    expect(api).toEqual('http://io-api.3nit.io')
    process.env.NODE_ENV = 'test'
  })

  it('should call development constants', () => {
    process.env.NODE_ENV = 'development'
    const api = require('config/constants').getAPI()
    expect(api).toEqual('http://l:9091')
    process.env.NODE_ENV = 'test'
  })

})
