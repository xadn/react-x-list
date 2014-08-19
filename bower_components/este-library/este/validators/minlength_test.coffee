suite 'este.validators.minLength', ->

  minLength = null

  setup ->
    minLength = este.validators.minLength(3)()

  suite 'validate', ->
    suite 'should be valid:', ->
      test 'should return true for abc', ->
        minLength.value = 'abc'
        assert.isTrue minLength.validate()

    suite 'should be invalid:', ->
      test 'should return false for ab', ->
        minLength.value = 'ab'
        assert.isFalse minLength.validate()

      test 'should return false for ""', ->
        minLength.value = ''
        assert.isFalse minLength.validate()

  suite 'getMsg', ->
    test 'should return message', ->
      assert.equal minLength.getMsg(), 'Please enter at least 3 characters.'

    test 'should return alternative message', ->
      getMsg = -> "Foo #{@minLength}"
      minLength = este.validators.minLength(3, getMsg)()
      assert.equal minLength.getMsg(), 'Foo 3'