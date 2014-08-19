suite 'este.validators.digits', ->

  digits = null

  setup ->
    digits = este.validators.digits()()

  suite 'validate', ->
    suite 'should be valid:', ->
      test '123', ->
        digits.value = '123'
        assert.isTrue digits.validate()

    suite 'should be invalid:', ->
      test '""', ->
        digits.value = ''
        assert.isFalse digits.validate()

      test '123.3', ->
        digits.value = '123.3'
        assert.isFalse digits.validate()

      test '"1e1" (scientific notation)', ->
        digits.value = '1e1'
        assert.isFalse digits.validate()

      test 'foo', ->
        digits.value = 'foo'
        assert.isFalse digits.validate()

      test '" "', ->
        digits.value = ' '
        assert.isFalse digits.validate()

  suite 'getMsg', ->
    test 'should return message', ->
      assert.equal digits.getMsg(), 'Please enter only digits.'

    test 'should return alternative message', ->
      getMsg = -> 'This is not digits.'
      digits = este.validators.digits(getMsg)()
      assert.equal digits.getMsg(), getMsg()