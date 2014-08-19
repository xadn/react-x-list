goog.provide 'este.array'

goog.require 'goog.array'

###*
  Removes all values that satisfies the given condition.
  @param {goog.array.ArrayLike} arr
  @param {Function} f The function to call for every element. This function
  takes 3 arguments (the element, the index and the array) and should
  return a boolean.
  @param {Object=} obj An optional "this" context for the function.
  @return {boolean} True if an element was removed.
###
este.array.removeAllIf = (arr, f, obj) ->
  idx = arr.length
  removed = false
  while idx--
    continue if !f.call obj, arr[idx], idx, arr
    arr.splice idx, 1
    removed = true
  removed

###*
  Removes undefined values from array.
  @param {goog.array.ArrayLike} arr
###
este.array.removeUndefined = (arr) ->
  este.array.removeAllIf arr, (item) -> item == undefined