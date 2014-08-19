goog.provide 'este.style'

goog.require 'goog.style'
goog.require 'este.dom'
goog.require 'goog.editor.style'
goog.require 'goog.array'

###*
  @param {Element} element
  @param {string} stylePropertyName
  @return {string}
###
este.style.getComputedStyle = (element, stylePropertyName) ->
  element = (`/** @type {Element} */`) element
  if goog.userAgent.IE
    goog.style.getCascadedStyle element, stylePropertyName
  else
    goog.style.getComputedStyle element, stylePropertyName

###*
  @param {Element} element
  @return {boolean}
###
este.style.isVisible = (element) ->
  ancestors = este.dom.getAncestors element
  goog.array.every ancestors, (el) ->
    goog.dom.isElement(el) &&
    este.style.getComputedStyle(el, 'display') != 'none'