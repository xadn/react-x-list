###*
  @fileoverview Validate number or string number.
###
goog.provide 'este.validators.Max'
goog.provide 'este.validators.max'

goog.require 'este.validators.Base'
goog.require 'goog.math'
goog.require 'goog.string'

class este.validators.Max extends este.validators.Base

  ###*
    @param {number} max
    @param {function(): string=} getMsg
    @constructor
    @extends {este.validators.Base}
  ###
  constructor: (@max, getMsg) ->
    super getMsg

  ###*
    @type {number}
    @protected
  ###
  max: 0

  ###*
    @override
  ###
  validate: ->
    isStringOrNumber = typeof @value in ['string', 'number']
    goog.asserts.assert isStringOrNumber, 'Expected string or number.'
    value = @value
    value = goog.string.toNumber value if goog.isString value
    value = (`/** @type {number} */`) value
    return false unless goog.math.isFiniteNumber value
    value <= @max

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc Max validator message.
    ###
    Max.MSG_VALIDATOR_MAX = goog.getMsg 'Please enter a value less than or equal to {$max}.',
      'max': @max

###*
  @param {number} max
  @param {function(): string=} getMsg
  @return {function(): este.validators.Max}
###
este.validators.max = (max, getMsg) ->
  -> new este.validators.Max max, getMsg