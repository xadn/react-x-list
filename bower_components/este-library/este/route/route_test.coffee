suite 'este.Route', ->

  Route = este.Route
  testData = [
    path: 'user/:user'
    url: 'user/joe'
    params: user: 'joe'
  ,
    path: 'users/:id?'
    url: 'users'
    params: id: undefined
  ,
    path: 'users/:id?'
    url: 'users/1'
    params: id: '1'
  ,
    path: 'user/:id/:operation?'
    url: 'user/1'
    params: id: '1', operation: undefined
  ,
    path: 'user/:id/:operation?'
    url: 'user/1/edit'
    params: id: '1', operation: 'edit'
  ,
    path: 'products.:format'
    url: 'products.json'
    params: format: 'json'
  ,
    path: 'products.:format'
    url: 'products.xml'
    params: format: 'xml'
  ,
    path: 'products.:format?'
    url: 'products'
    params: format: undefined
  ,
    path: 'user/:id.:format?'
    url: 'user/12'
    params: id: '12', format: undefined
  ,
    path: 'user/:id.:format?'
    url: 'user/12.json'
    params: id: '12', format: 'json'
  ,
    path: '/'
    url: '/'
    params: null
  ,
    path: 'assets/*'
    url: 'assets/este.js'
    params: ['este.js']
  ,
    path: 'assets/*.*'
    url: 'assets/steida.js'
    params: ['steida', 'js']
  ,
    path: 'assets/*'
    url: 'assets/js/este.js'
    params: ['js/este.js']
  ,
    path: 'assets/*.*'
    url: 'assets/js/steida.js'
    params: ['js/steida', 'js']
  ]

  suite 'constructor', ->
    test 'should set path', ->
      route = new Route 'foo'
      assert.equal route.path, 'foo'

  suite 'match', ->
    test 'should match some urls', ->
      assert.isTrue new Route('/').match '/'
      assert.isTrue new Route('/foo').match '/foo'
      assert.isTrue new Route('/:foo').match '/foo'
      assert.isTrue new Route('/users/:foo?').match '/users'
      assert.isTrue new Route('/users/:foo?').match '/users/foo'

    test 'should not match some urls', ->
      assert.isFalse new Route('/').match '/f'
      assert.isFalse new Route('/foo').match '/boo'
      assert.isFalse new Route('/:foo').match '/'

    test 'should match urls from testData', ->
      for data in testData
        route = new Route data.path
        assert.isTrue route.match data.url

  suite 'getParams', ->
    test 'should get params from url', ->
      for data in testData
        route = new Route data.path
        params = route.getParams data.url
        assert.deepEqual params, data.params, data.url

  suite 'url', ->
    test 'should create url from params', ->
      for data in testData
        route = new Route data.path
        url = route.url data.params
        assert.equal url, data.url, data.url

    test 'should not add unused params', ->
      route = new Route '/drug/:name/:condition?/:question?'
      url = route.url 'name': 'name'
      assert.equal url, '/drug/name'

  suite 'redirect', ->
    test 'should throw if route was not added to router', ->
      route = new Route '/'
      assert.throw ->
        route.redirect()
      , 'Can\'t redirect. Route was not added to router.'

    test 'should call load on router', (done) ->
      route = new Route '/:id'
      route.router = load: (url) ->
        assert.equal url, '/1'
        done()
      route.redirect id: 1
