suite 'este.validators.email', ->

  email = null

  setup ->
    email = este.validators.email()()

  suite 'validate', ->
    suite 'should be valid:', ->
      test 'foo@bla.com', ->
        email.value = 'foo@bla.com'
        assert.isTrue email.validate()

    suite 'should be invalid:', ->
      test 'foo@@bla.com', ->
        email.value = 'foo@@bla.com'
        assert.isFalse email.validate()

      test '""', ->
        email.value = ''
        assert.isFalse email.validate()

  suite 'getMsg', ->
    test 'should return message', ->
      assert.equal email.getMsg(), 'Please enter a valid email address.'

    test 'should return alternative message', ->
      getMsg = -> 'This is not email.'
      email = este.validators.email(getMsg)()
      assert.equal email.getMsg(), getMsg()