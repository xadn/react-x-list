###*
  @fileoverview Client-side router.

  Features:
    - pustState/hashchange
    - sync/async routing
    - supports "fast click" via Polymer PointerEvents
    - browser "last click win" aka "pedning navigation" feature (goo.gl/dKrhMe)
###

goog.provide 'este.Router'

goog.require 'este.Route'
goog.require 'goog.array'
goog.require 'goog.events.EventHandler'
goog.require 'goog.events.EventTarget'

class este.Router extends goog.events.EventTarget

  ###*
    @param {este.History} history
    @param {este.events.RoutingClickHandler} routingClickHandler
    @constructor
    @extends {goog.events.EventTarget}
  ###
  constructor: (history, routingClickHandler) ->
    super()
    @history_ = history
    @routingClickHandler_ = routingClickHandler
    @routesCallback_ = []
    @handler_ = new goog.events.EventHandler @

  ###*
    @type {este.History}
    @private
  ###
  history_: null

  ###*
    @type {este.events.RoutingClickHandler}
    @private
  ###
  routingClickHandler_: null

  ###*
    @type {Array.<este.Router.RouteCallback>}
    @private
  ###
  routesCallback_: null

  ###*
    @type {goog.events.EventHandler}
    @private
  ###
  handler_: null

  ###*
    @type {goog.Promise}
    @private
  ###
  previousRoutePromise_: null

  ###*
    @type {string}
    @private
  ###
  pendingPath_: ''

  ###*
    @param {(string|este.Route)} route
    @param {Function} callback
    @return {este.Router}
  ###
  add: (route, callback) ->
    route = @ensureRoute route
    found = @findRoute route
    goog.asserts.assert !found, "Route '#{route.path}' was already added."
    @routesCallback_.push new este.Router.RouteCallback route, callback
    route.router = @
    @

  ###*
    @param {(string|este.Route)} route
    @return {este.Router}
  ###
  remove: (route) ->
    route = @ensureRoute route
    found = @findRoute route
    goog.asserts.assert !!found, "Route '#{route.path}' was not yet added."
    goog.array.remove @routesCallback_, found
    route.router = null
    @

  ###*
    Start router.
  ###
  start: ->
    @registerEvents_()
    @history_.setEnabled true
    token = @history_.getToken()
    token = @ensureSlashForHashChange_ token
    @load token

  ###*
    @param {string} path
  ###
  load: (path) ->
    if @pendingPath_ && @pendingPath_ == path
      return
    @pendingPath_ = path

    matchedRoute = @findMatchedRoute path
    goog.asserts.assert !!matchedRoute, "Route for path '#{path}' not found."

    if @previousRoutePromise_
      @previousRoutePromise_.cancel()

    routePromise = @getMatchedRoutePromise matchedRoute, path
    @previousRoutePromise_ = routePromise

    routePromise
      .then (value) =>
        @updateUrl_ path
        return
      .thenAlways =>
        if path == @pendingPath_
          @pendingPath_ = ''
    return

  ###*
    @param {(string|este.Route)} route
    @return {este.Route}
  ###
  ensureRoute: (route) ->
    return new este.Route route if goog.isString route
    route

  ###*
    @param {(string|este.Route)} route
    @return {este.Router.RouteCallback}
  ###
  findRoute: (route) ->
    route = @ensureRoute route
    goog.array.find @routesCallback_, (routeCallback) ->
      routeCallback.route.path == route.path

  ###*
    @param {string} path
    @return {este.Router.RouteCallback}
  ###
  findMatchedRoute: (path) ->
    goog.array.find @routesCallback_, (routeCallback) ->
      routeCallback.route.match path

  ###*
    @param {este.Router.RouteCallback} route
    @param {string} path
    @return {!goog.Promise}
  ###
  getMatchedRoutePromise: (route, path) ->
    params = route.route.getParams path
    promise = route.callback params
    if promise instanceof goog.Promise
      return promise
    goog.Promise.resolve()

  ###*
    @private
  ###
  registerEvents_: ->
    @handler_.listen @history_, 'navigate', @onHistoryNavigate_
    @handler_.listen @routingClickHandler_, 'click', @onRoutingClickHandlerClick_

  ###*
    @param {goog.history.Event} e
    @private
  ###
  onHistoryNavigate_: (e) ->
    # Handle only browser navigation aka back/forward buttons.
    return if !e.isNavigation
    @load e.token

  ###*
    @param {goog.events.BrowserEvent} e
    @private
  ###
  onRoutingClickHandlerClick_: (e) ->
    @load @ensureSlashForHashChange_ e.target.getAttribute 'href'

  ###*
    @param {string} path
    @private
  ###
  updateUrl_: (path) ->
    @history_.setToken @ensureSlashForHashChange_ path

  ###*
    Ensure #/ pattern for hashchange. Slash is must for hash to prevent
    accidental focus on element with the same id as url is.
    @param {string} path
    @return {string}
    @private
  ###
  ensureSlashForHashChange_: (path) ->
    return path if !@history_.hashChangeEnabled || path.charAt(0) == '/'
    '/' + path

  ###*
    @override
  ###
  disposeInternal: ->
    super()
    @handler_.dispose()
    @history_.dispose()
    @routingClickHandler_.dispose()

class este.Router.RouteCallback

  ###*
    @param {este.Route} route
    @param {Function} callback
    @constructor
  ###
  constructor: (@route, @callback) ->
