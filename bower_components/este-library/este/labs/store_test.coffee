suite 'este.labs.Store', ->

  Store = este.labs.Store
  store = null

  setup ->
    store = new Store 'test'

  suite 'constructor', ->
    test 'should set name', ->
      assert.equal store.name, 'test'

  suite 'toJson', ->
    test 'should throw error because method is abstract', ->
      assert.throw store.toJson

  suite 'fromJson', ->
    test 'should throw error because method is abstract', ->
      assert.throw store.fromJson

  suite 'instanceFromJson', ->
    test 'should create instance then mixin json', ->
      SomeClass = ->
      json = a: 'a', b: 'b'
      instance = store.instanceFromJson SomeClass, json
      assert.instanceOf instance, SomeClass
      assert.deepEqual instance, json

    test 'should return instance factory, useful for Array map', ->
      SomeClass = ->
      json = a: 'a', b: 'b'
      create = store.instanceFromJson SomeClass
      instance = create json
      instance2 = create json
      assert.notEqual instance, instance2
      assert.instanceOf instance, SomeClass
      assert.deepEqual instance, json

  suite 'asObject', ->
    test 'should return object from array', ->
      object = store.asObject [{id: '1'}, {id: '2'}]
      assert.deepEqual object,
        '1': id: '1'
        '2': id: '2'

    test 'should throw if array is not array', ->
      assert.throw -> store.asObject {}

    test 'should throw if item id is not string', ->
      assert.throw -> store.asObject [{id: 1}]

  suite 'asArray', ->
    test 'should return array from object', ->
      array = store.asArray
        '1': id: '1'
        '2': id: '2'
      assert.deepEqual array, [{id: '1'}, {id: '2'}]

    test 'should throw if object is not object', ->
      assert.throw -> store.asArray null

    test 'should throw if item id is not string', ->
      assert.throw -> store.asArray {id: 1}