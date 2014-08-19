suite 'este.validators.min', ->

  min = null

  setup ->
    min = este.validators.min(3)()

  suite 'validate', ->
    suite 'should be valid:', ->
      test '3', ->
        min.value = 3
        assert.isTrue min.validate()

    suite 'should be invalid:', ->
      test '2', ->
        min.value = 2
        assert.isFalse min.validate()

      test '"2"', ->
        min.value = '2'
        assert.isFalse min.validate()

  suite 'getMsg', ->
    test 'should return message', ->
      assert.equal min.getMsg(), 'Please enter a value greater than or equal to 3.'

    test 'should return alternative message', ->
      getMsg = -> "Foo #{@min}"
      min = este.validators.min(3, getMsg)()
      assert.equal min.getMsg(), 'Foo 3'