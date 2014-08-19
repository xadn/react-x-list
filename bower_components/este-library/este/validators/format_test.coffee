suite 'este.validators.format', ->

  format = null

  setup ->
    format = este.validators.format(/^\d+$/)()

  suite 'validate', ->
    suite 'should be valid:', ->
      test '123', ->
        format.value = '123'
        assert.isTrue format.validate()

    suite 'should be invalid:', ->
      test 'foo@@bla.com', ->
        format.value = 'foo@@bla.com'
        assert.isFalse format.validate()

  suite 'getMsg', ->
    test 'should return message', ->
      assert.equal format.getMsg(), 'Please enter a value in correct format.'

    test 'should return alternative message', ->
      getMsg = -> 'This is not format.'
      format = este.validators.format(/^\d+$/, getMsg)()
      assert.equal format.getMsg(), getMsg()