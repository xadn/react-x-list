suite 'este.validators.rangeLength', ->

  rangeLength = null

  setup ->
    rangeLength = este.validators.rangeLength(2, 3)()

  suite 'validate', ->
    suite 'should be valid:', ->
      test 'abc', ->
        rangeLength.value = 'abc'
        assert.isTrue rangeLength.validate()

      test 'ab', ->
        rangeLength.value = 'ab'
        assert.isTrue rangeLength.validate()

    suite 'should be invalid:', ->
      test 'abcd', ->
        rangeLength.value = 'abcd'
        assert.isFalse rangeLength.validate()

      test 'a', ->
        rangeLength.value = 'a'
        assert.isFalse rangeLength.validate()

  suite 'getMsg', ->
    test 'should return message', ->
      assert.equal rangeLength.getMsg(), 'Please enter a value between 2 and 3 characters long.'

    test 'should return alternative message', ->
      getMsg = -> "Foo #{@min} #{@max}"
      rangeLength = este.validators.rangeLength(2, 3, getMsg)()
      assert.equal rangeLength.getMsg(), 'Foo 2 3'