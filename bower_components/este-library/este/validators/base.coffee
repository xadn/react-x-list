###*
  @fileoverview Abstract base class for validators.
  @see /demos/model/validators.html
###
goog.provide 'este.validators.Base'

goog.require 'goog.asserts'

class este.validators.Base

  ###*
    @param {function(): string=} getMsg
    @constructor
  ###
  constructor: (getMsg) ->
    @getMsg = getMsg if getMsg

  ###*
    Model to be validated.
    @type {Object}
  ###
  model: null

  ###*
    Model's property.
    @type {string}
  ###
  key: ''

  ###*
    Model's property value.
    @type {*}
  ###
  value: undefined

  ###*
    Returns true for truthy values except empty string.
    @return {boolean}
  ###
  isValidable: ->
    @value? && @value != ''

  ###*
    @return {boolean} True, if value is valid.
  ###
  validate: goog.abstractMethod

  ###*
    @return {string}
  ###
  getMsg: goog.abstractMethod