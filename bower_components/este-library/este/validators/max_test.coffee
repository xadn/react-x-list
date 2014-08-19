suite 'este.validators.max', ->

  max = null

  setup ->
    max = este.validators.max(3)()

  suite 'validate', ->
    suite 'should be valid:', ->
      test '3', ->
        max.value = 3
        assert.isTrue max.validate()

    suite 'should be invalid:', ->
      test '4', ->
        max.value = 4
        assert.isFalse max.validate()

      test '"4"', ->
        max.value = '4'
        assert.isFalse max.validate()

  suite 'getMsg', ->
    test 'should return message', ->
      assert.equal max.getMsg(), 'Please enter a value less than or equal to 3.'

    test 'should return alternative message', ->
      getMsg = -> "Foo #{@max}"
      max = este.validators.max(3, getMsg)()
      assert.equal max.getMsg(), 'Foo 3'