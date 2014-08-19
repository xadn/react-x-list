suite 'este.validators.Base', ->

  Base = este.validators.Base

  base = null

  setup ->
    base = new Base

  suite 'constructor', ->
    test 'should work', ->
      assert.instanceOf base, Base

  suite 'isValidable', ->
    test 'should return true for validable values', ->
      base.value = ' '
      assert.isTrue base.isValidable()
      base.value = 0
      assert.isTrue base.isValidable()
      base.value = '123'
      assert.isTrue base.isValidable()
      base.value = {}
      assert.isTrue base.isValidable()

    test 'should return false for invalidable values', ->
      base.value = ''
      assert.isFalse base.isValidable()
      base.value = null
      assert.isFalse base.isValidable()
      base.value = undefined
      assert.isFalse base.isValidable()