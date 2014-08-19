suite 'este.validators.exclusion', ->

  exclusion = null

  setup ->
    exclusion = este.validators.exclusion(['Foo', 'Bla'])()

  suite 'validate', ->
    suite 'should be valid:', ->
      test '"a"', ->
        exclusion.value = 'a'
        assert.isTrue exclusion.validate()

    suite 'should be invalid:', ->
      test '"Foo"', ->
        exclusion.value = 'Foo'
        assert.isFalse exclusion.validate()

      test '"Bla"', ->
        exclusion.value = 'Bla'
        assert.isFalse exclusion.validate()

  suite 'getMsg', ->
    test 'should return message', ->
      exclusion.value = 'Foo'
      assert.equal exclusion.getMsg(), '\'Foo\' is not allowed.'

    test 'should return alternative message', ->
      getMsg = -> "Foo #{@exclusion}"
      exclusion = este.validators.exclusion(['Foo', 'Bla'], getMsg)()
      assert.equal exclusion.getMsg(), 'Foo Foo,Bla'