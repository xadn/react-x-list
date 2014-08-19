goog.provide 'este.labs.Storage'

goog.require 'goog.Promise'
goog.require 'goog.events.EventTarget'
goog.require 'goog.net.HttpStatus'

class este.labs.Storage extends goog.events.EventTarget

  ###*
    @constructor
    @extends {goog.events.EventTarget}
  ###
  constructor: ->
    super()

  ###*
    @type {Array.<este.labs.Store>}
    @protected
  ###
  stores: null

  ###*
    @param {este.Route} route
    @param {Object} params
    @param {este.Routes} routes
    @return {!goog.Promise}
  ###
  load: goog.abstractMethod

  ###*
    Deep copy object without its functions. JSON.parse JSON.stringify might not
    be the fastest, http://jsperf.com/deep-copy-vs-json-stringify-json-parse,
    but it's robust. For example, Firebase needs it.
    @param {Object} object
    @return {Object}
    @protected
  ###
  deepCopy: (object) ->
    (`/** @type {Object} */`) JSON.parse JSON.stringify object

  ###*
    @protected
  ###
  notify: ->
    @dispatchEvent 'change'

  ###*
    Helper for sync storage load method.
    @protected
  ###
  ok: ->
    goog.Promise.resolve goog.net.HttpStatus.OK

  ###*
    Helper for sync storage load method.
    @protected
  ###
  notFound: ->
    goog.Promise.reject goog.net.HttpStatus.NOT_FOUND
