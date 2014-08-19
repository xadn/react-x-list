###*
  @fileoverview Isomorphic string-less routes.

  Create app.Routes with routes in constructor:

  <pre>
    goog.provide 'app.Routes'
    goog.require 'este.Routes'

    class app.Routes extends este.Routes
      constructor: ->
        this.home = this.route('/');
        this.songs = this.route('/songs');
        this.song = this.route('/songs/:id');
  </pre>
###

goog.provide 'este.Routes'

goog.require 'este.Route'
goog.require 'goog.net.HttpStatus'

class este.Routes

  ###*
    @constructor
  ###
  constructor: ->

  ###*
    @type {este.Route}
  ###
  notFound: new este.Route

  ###*
    @type {este.Route}
  ###
  active: null

  ###*
    @type {Array.<este.Route>}
    @protected
  ###
  list: null

  ###*
    @param {este.Route} route
    @param {Object} params
  ###
  setActive: (route, params) ->
    route.params = params
    @active = route

  ###*
    @param {*} reason
  ###
  trySetErrorRoute: (reason) ->
    switch reason
      when goog.net.HttpStatus.NOT_FOUND
        @setActive @notFound, null
      # Rethrow unknown reason.
      else throw reason

  ###*
    @param {string} path
    @return {este.Route}
    @protected
  ###
  route: (path) ->
    @list ?= []
    route = new este.Route path
    @list.push route
    route

  ###*
    @param {este.Router} router
    @param {function(este.Route, Object): (goog.Promise|undefined)} onRouteMatch
  ###
  addToEste: (router, onRouteMatch) ->
    @list.forEach (route) ->
      router.add route, (params) ->
        # este.Router can use promise for async routing and pending navigation.
        onRouteMatch route, params
    @handleEsteRouter404 router, onRouteMatch

  ###*
    @private
  ###
  handleEsteRouter404: (router, onRouteMatch) ->
    router.add '*', (params) =>
      onRouteMatch @notFound, params
      return

  ###*
    @param {Object} app Express instance.
    @param {function(este.Route, Object, Object)} onRouteMatch
  ###
  addToExpress: (app, onRouteMatch) ->
    @list.forEach (route) ->
      app['route'](route.path)['get'] (req, res) ->
        onRouteMatch route, req, res
        return
    @handleExpressApp404 app, onRouteMatch

  ###*
    @private
  ###
  handleExpressApp404: (app, onRouteMatch) ->
    app['use'] (req, res) =>
      onRouteMatch @notFound, req, res
