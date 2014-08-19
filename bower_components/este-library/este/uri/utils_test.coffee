suite 'este.string', ->

  utils = este.uri.utils

  suite 'getPathAndQuery', ->
    test 'should return path and query from a complete url', ->
      s = utils.getPathAndQuery 'http://www.ereading.cz/cs/foobar/123?q=1&p=2#hash'
      assert.equal s, '/cs/foobar/123?q=1&p=2'

    test 'should return path and query from a complete url without hash', ->
      s = utils.getPathAndQuery 'http://www.ereading.cz/cs/foobar/123?q=1&p=2'
      assert.equal s, '/cs/foobar/123?q=1&p=2'

    test 'should return path and query from a complete url without hash and query', ->
      s = utils.getPathAndQuery 'http://www.ereading.cz/cs/foobar/123'
      assert.equal s, '/cs/foobar/123'