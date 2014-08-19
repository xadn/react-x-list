goog.provide 'este.object'

goog.require 'goog.object'

###*
  If value is array with length == 1, replace array with array[0].
  @param {Object} object
  @return {Object}
###
este.object.normalizeOneItemArrayValues = (object) ->
  normalized = {}
  for key, value of object
    if goog.isArray(value) && value.length == 1
      normalized[key] = value[0]
      continue
    normalized[key] = value
  normalized