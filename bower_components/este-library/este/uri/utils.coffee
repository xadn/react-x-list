###*
  @fileoverview URI utils.
  @namespace este.uri
###

goog.provide 'este.uri.utils'

goog.require 'goog.uri.utils'

###*
  Returns "path?query" from the URL - i.e. excludes protocol, host, port and fragment
  @param {string} uri
###
este.uri.utils.getPathAndQuery = (uri) ->
  pieces = goog.uri.utils.split uri
  return goog.uri.utils.buildFromEncodedParts null, null, null, null,
      pieces[goog.uri.utils.ComponentIndex.PATH],
      pieces[goog.uri.utils.ComponentIndex.QUERY_DATA]