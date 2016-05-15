import {get, post, del, put} from 'utils/agent'
import expect from 'expect'

describe('agent', () => {

  it('should call agent methods', async () => {
    const testGet = get('test')
    const testPost = post('test')
    const testDel = del('test')
    const testPut = put('test')

    get('test', 'token')
    post('test', 'token')
    del('test', 'token')
    put('test', 'token')
    
    expect(testGet.constructor.name).toEqual('Request')
    expect(testPost.constructor.name).toEqual('Request')
    expect(testDel.constructor.name).toEqual('Request')
    expect(testPut.constructor.name).toEqual('Request')
  })

})
