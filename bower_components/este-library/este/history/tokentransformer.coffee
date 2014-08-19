###*
  @fileoverview goog.history.Html5History default behavior is that setToken
  replaces pathname of current location, but keeps search query as is.

  This transformer treats tokens as "pathAndAfter"; hence they may also include
  query string with hash and a query string is replaced when a new history state
  is pushed.
###

goog.provide 'este.history.TokenTransformer'

class este.history.TokenTransformer

  ###*
    @constructor
    @implements {goog.history.Html5History.TokenTransformer}
    @final
  ###
  constructor: ->

  ###*
    @override
  ###
  retrieveToken: (pathPrefix, location) ->
    (location.pathname.substr pathPrefix.length) + location.search + location.hash

  ###*
    @override
  ###
  createUrl: (token, pathPrefix, location) ->
    pathPrefix + token