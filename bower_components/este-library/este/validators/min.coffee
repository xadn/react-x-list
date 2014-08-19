###*
  @fileoverview Validate number or string number.
###
goog.provide 'este.validators.Min'
goog.provide 'este.validators.min'

goog.require 'este.validators.Base'
goog.require 'goog.math'
goog.require 'goog.string'

class este.validators.Min extends este.validators.Base

  ###*
    @param {number} min
    @param {function(): string=} getMsg
    @constructor
    @extends {este.validators.Base}
  ###
  constructor: (@min, getMsg) ->
    super getMsg

  ###*
    @type {number}
    @protected
  ###
  min: 0

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
    value >= @min

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc Min validator message.
    ###
    Min.MSG_VALIDATOR_MIN = goog.getMsg 'Please enter a value greater than or equal to {$min}.',
      'min': @min

###*
  @param {number} min
  @param {function(): string=} getMsg
  @return {function(): este.validators.Min}
###
este.validators.min = (min, getMsg) ->
  -> new este.validators.Min min, getMsg