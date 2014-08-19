suite 'este.labs.Storage', ->

  Storage = este.labs.Storage
  storage = null

  setup ->
    storage = new Storage

  suite 'load', ->
    test 'should throw error because method is abstract', ->
      assert.throw storage.load

  suite 'notify', ->
    test 'should dispatch change event', (done) ->
      storage.listen 'change', (e) ->
        done()
      storage.notify()