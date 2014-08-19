suite 'este.validators.maxLength', ->

  maxLength = null

  setup ->
    maxLength = este.validators.maxLength(3)()

  suite 'validate', ->
    suite 'should be valid:', ->
      test 'abc', ->
        maxLength.value = 'abc'
        assert.isTrue maxLength.validate()

    suite 'should be invalid:', ->
      test 'abcd', ->
        maxLength.value = 'abcd'
        assert.isFalse maxLength.validate()

  suite 'getMsg', ->
    test 'should return message', ->
      assert.equal maxLength.getMsg(), 'Please enter no more than 3 characters.'

    test 'should return alternative message', ->
      getMsg = -> "Foo #{@maxLength}"
      maxLength = este.validators.maxLength(3, getMsg)()
      assert.equal maxLength.getMsg(), 'Foo 3'