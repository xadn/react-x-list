###*
  @fileoverview Validate number or string number range.
###
goog.provide 'este.validators.Range'
goog.provide 'este.validators.range'

goog.require 'este.validators.Base'
goog.require 'este.validators.min'
goog.require 'este.validators.max'

class este.validators.Range extends este.validators.Base

  ###*
    @param {number} min
    @param {number} max
    @param {function(): string=} getMsg
    @constructor
    @extends {este.validators.Base}
  ###
  constructor: (@min, @max, getMsg) ->
    super getMsg

  ###*
    @type {number}
    @protected
  ###
  min: 0

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
    @min <= value <= @max

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc Range validator message.
    ###
    Range.MSG_VALIDATOR_RANGE = goog.getMsg 'Please enter a value between {$min} and {$max}.',
      'min': @min
      'max': @max

###*
  @param {number} min
  @param {number} max
  @param {function(): string=} getMsg
  @return {function(): este.validators.Range}
###
este.validators.range = (min, max, getMsg) ->
  -> new este.validators.Range min, max, getMsg