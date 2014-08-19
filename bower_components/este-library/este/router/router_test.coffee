goog.require 'goog.events.EventTarget'
goog.require 'goog.Promise'

suite 'este.Router', ->

  Router = este.Router
  history = null
  routingClickHandler = null
  router = null

  setup ->
    arrangeHistory()
    arrangeRoutingClickHandler()
    router = new Router history, routingClickHandler

  arrangeHistory = ->
    history = new goog.events.EventTarget
    history.setEnabled = ->
    history.setToken = ->
    history.getToken = ->
    history.hashChangeEnabled = false

  arrangeRoutingClickHandler = ->
    routingClickHandler = new goog.events.EventTarget

  addRouteThenLoad = (route, done, path) ->
    router.add route, done
    router.load path

  suite 'add', ->
    test 'should be chainable', ->
      assert.equal router.add('/', ->), router

    test 'should throw error if route path was already added', ->
      router.add '/', ->
      assert.throw ->
        router.add '/', ->
      , "Route '/' was already added."

    test 'should set route.router', ->
      route = new este.Route '/'
      router.add route, ->
      assert.equal route.router, router

  suite 'remove', ->
    test 'should be chainable', ->
      assert.equal router.add('/', ->).remove('/'), router

    test 'should throw error if route path was not yet added', ->
      assert.throw ->
        router.remove '/', ->
      , "Route '/' was not yet added."

    test 'should reset route.router', ->
      route = new este.Route '/'
      router.add route, ->
      router.remove route, ->
      assert.isNull route.router

  suite 'load', ->
    suite 'after add route', ->
      test 'should call string route callback', (done) ->
        addRouteThenLoad '/', done, '/'

      test 'should call este.Route route callback', (done) ->
        route = new este.Route '/'
        addRouteThenLoad route, done, '/'

      test 'should pass params to route callback', (done) ->
        route = new este.Route '/user/:id'
        addRouteThenLoad route, (params) ->
          assert.deepEqual params, id: '1'
          done()
        , '/user/1'

      test 'should call history.setToken after route callback', (done) ->
        routeCallbackCalled = false
        history.setToken = (path) ->
          assert.equal path, '/'
          assert.isTrue routeCallbackCalled
          done()
        route = new este.Route '/'
        addRouteThenLoad route, ->
          routeCallbackCalled = true
        , '/'

    suite 'missing route', ->
      test 'should throw error', ->
        assert.throw ->
          router.load '/'
        , "Route for path '/' not found."

    suite 'after remove route', ->
      test 'should throw error', ->
        router.add '/', ->
        router.remove '/'
        assert.throw ->
          router.load '/'
        , "Route for path '/' not found."

  suite 'start', ->
    test 'should enable history then load history token', (done) ->
      historyEnabled = null
      history.setEnabled = (enabled) -> historyEnabled = enabled
      history.getToken = -> '/'
      router.add '/', ->
        assert.isTrue historyEnabled
        done()
      router.start()

  suite 'history pushState navigate event', ->
    routeCalled = null
    tokenStored = null
    dispatchNavigateEvent = (e) ->
      e.type = 'navigate'
      e.token = 'user/1'
      history.dispatchEvent e
    setup ->
      routeCalled = false
      router.add '', ->
      router.add 'user/:id', (params) ->
        assert.deepEqual params, id: '1'
        routeCalled = true
      history.getToken = -> ''
      history.setToken = (token) -> tokenStored = token
      history.hashChangeEnabled = false
      router.start()

    suite 'invoked by browser navigation aka back/forward buttons', ->
      test 'should load route', (done) ->
        dispatchNavigateEvent isNavigation: true
        setTimeout ->
          assert.isTrue routeCalled
          assert.equal tokenStored, 'user/1'
          done()
        , 10

    suite 'invoked by manual url update aka click on link or similar action', ->
      test 'should be ignored', ->
        dispatchNavigateEvent isNavigation: false
        assert.isFalse routeCalled
        assert.equal tokenStored, ''

  suite 'history hashChange navigate event', ->
    routeCalled = null
    tokenStored = null
    dispatchNavigateEvent = (e) ->
      e.type = 'navigate'
      e.token = 'user/1'
      history.dispatchEvent e
    setup ->
      routeCalled = false
      router.add '', ->
      router.add 'user/:id', (params) ->
        assert.deepEqual params, id: '1'
        routeCalled = true
      history.getToken = -> ''
      history.setToken = (token) -> tokenStored = token
      history.hashChangeEnabled = true
      router.start()

    suite 'invoked by browser navigation aka back/forward buttons', ->
      test 'should load route', (done) ->
        dispatchNavigateEvent isNavigation: true
        setTimeout ->
          assert.isTrue routeCalled
          assert.equal tokenStored, '/user/1'
          done()
        , 10

    suite 'invoked by manual url update aka click on link or similar action', ->
      test 'should be ignored', ->
        dispatchNavigateEvent isNavigation: false
        assert.isFalse routeCalled
        assert.equal tokenStored, '/'

  suite 'routingClickHandler click event', ->
    test 'should load route', ->
      routeCalled = false
      router.add '/', ->
      router.add '/user/:id', (params) ->
        assert.deepEqual params, id: '1'
        routeCalled = true
      history.getToken = -> '/'
      router.start()
      routingClickHandler.dispatchEvent
        type: 'click'
        target: getAttribute: (name) ->
          assert.equal name, 'href'
          '/user/1'
      assert.isTrue routeCalled

  suite 'route returning promise', ->
    test 'should change history on promise resolve', (done) ->
      router.add '/', ->
        new goog.Promise (resolve, reject) -> setTimeout resolve, 0
      router.load '/'
      history.setToken = (path) ->
        assert.equal path, '/'
        done()

  # Last click win aka "pending navigations".
  suite 'previous route', ->
    createPromiseResolveAfter10ms = ->
      new goog.Promise (resolve) -> setTimeout resolve, 10

    arrangeLastClickWin = (promise) ->
      router.add '/', -> promise
      router.add '/foo', ->
      router.load '/'
      router.load '/foo'

    test 'should be cancelled', (done) ->
      promise = createPromiseResolveAfter10ms()
      promise.thenCatch -> done()
      arrangeLastClickWin promise

    test 'should not change history', (done) ->
      promise = createPromiseResolveAfter10ms()
      arrangeLastClickWin promise
      history.setToken = (path) ->
        assert.equal path, '/foo'
        done()

  suite 'pending route with the same path', ->
    test 'should be ignored', (done) ->
      called = 0
      router.add '/', ->
        called++
        new goog.Promise (resolve) -> setTimeout resolve, 10

      router.load '/'
      router.load '/'

      history.setToken = ->
        assert.equal called, 1
        done()

    test 'should be ignored for changed pending route', (done) ->
      called = 0
      router.add '/', ->
        called++
        new goog.Promise (resolve) -> setTimeout resolve, 50
      router.add '/home', -> goog.Promise.resolve()
      router.load '/home'
      router.load '/'
      setTimeout ->
        router.load '/'
        history.setToken = ->
          assert.equal called, 1
          done()
      , 10

    test 'should not be ignored if load is resolved', (done) ->
      called = 0
      router.add '/', ->
        called++
        goog.Promise.resolve()
      router.load '/'
      setTimeout ->
        router.load '/'
        assert.equal called, 2
        done()
      , 10
