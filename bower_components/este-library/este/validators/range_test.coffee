suite 'este.validators.range', ->

  range = null

  setup ->
    range = este.validators.range(1, 3)()

  suite 'validate', ->
    suite 'should be valid:', ->
      test '3', ->
        range.value = 3
        assert.isTrue range.validate()

      test '"3"', ->
        range.value = '3'
        assert.isTrue range.validate()

      test '1', ->
        range.value = 1
        assert.isTrue range.validate()

      test '"1"', ->
        range.value = '1'
        assert.isTrue range.validate()

    suite 'should be invalid:', ->
      test '4', ->
        range.value = 4
        assert.isFalse range.validate()

      test '"4"', ->
        range.value = '4'
        assert.isFalse range.validate()

      test '0', ->
        range.value = 0
        assert.isFalse range.validate()

      test '"0"', ->
        range.value = '0'
        assert.isFalse range.validate()

  suite 'getMsg', ->
    test 'should return message', ->
      assert.equal range.getMsg(), 'Please enter a value between 1 and 3.'

    test 'should return alternative message', ->
      getMsg = -> "Foo #{@min} #{@max}"
      range = este.validators.range(1, 3, getMsg)()
      assert.equal range.getMsg(), 'Foo 1 3'