suite 'este.validators.inclusion', ->

  inclusion = null

  setup ->
    inclusion = este.validators.inclusion(['Foo', 'Bla'])()

  suite 'validate', ->
    suite 'should be valid:', ->
      test '"Foo"', ->
        inclusion.value = 'Foo'
        assert.isTrue inclusion.validate()

      test '"Bla"', ->
        inclusion.value = 'Bla'
        assert.isTrue inclusion.validate()

    suite 'should be invalid:', ->
      test '"a"', ->
        inclusion.value = 'a'
        assert.isFalse inclusion.validate()

  suite 'getMsg', ->
    test 'should return message', ->
      assert.equal inclusion.getMsg(), 'Please enter one of these values: Foo, Bla.'

    test 'should return alternative message', ->
      getMsg = -> "Foo #{@inclusion}"
      inclusion = este.validators.inclusion(['Foo', 'Bla'], getMsg)()
      assert.equal inclusion.getMsg(), 'Foo Foo,Bla'