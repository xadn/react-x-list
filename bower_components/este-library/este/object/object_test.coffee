suite 'este.object', ->

  object = este.object

  suite 'normalizeOneItemArrayValues', ->
    test 'should sd', ->
      result = object.normalizeOneItemArrayValues
        'a': 1
        'b': [1]
        'c': [1, 2]
      assert.deepEqual result,
        'a': 1
        'b': 1
        'c': [1, 2]
