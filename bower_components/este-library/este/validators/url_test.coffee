suite 'este.validators.url', ->

  url = null

  setup ->
    url = este.validators.url()()

  suite 'validate', ->
    test 'should return true for valid url', ->
      url.value = 'http://github.com/steida/este'
      assert.isTrue url.validate()

    test 'should return false for invalid url', ->
      url.value = 'http:///foo'
      assert.isFalse url.validate()

  suite 'getMsg', ->
    test 'should return message', ->
      assert.equal url.getMsg(), 'Please enter a valid URL.'

    test 'should return alternative message', ->
      getMsg = -> "Foo #{@url}"
      url = este.validators.url(getMsg)()
      url.url = 'http://google.com'
      assert.equal url.getMsg(), 'Foo http://google.com'