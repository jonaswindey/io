import * as storage from 'persistence/storage'

describe('storage', () => {

  it('should call storage methods', async () => {
    storage.get('test')
    storage.put('test')
    storage.remove('test')
    storage.clear()
  })

})
