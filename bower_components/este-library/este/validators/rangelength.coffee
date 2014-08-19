###*
  @fileoverview Validate string length range.
###
goog.provide 'este.validators.RangeLength'
goog.provide 'este.validators.rangeLength'

goog.require 'este.validators.Base'
goog.require 'este.validators.min'
goog.require 'este.validators.max'

class este.validators.RangeLength extends este.validators.Base

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
    goog.asserts.assertString @value
    @min <= @value.length <= @max

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc RangeLength validator message.
    ###
    RangeLength.MSG_VALIDATOR_RANGE_LENGTH = goog.getMsg 'Please enter a value between {$min} and {$max} characters long.',
      'min': @min
      'max': @max

###*
  @param {number} min
  @param {number} max
  @param {function(): string=} getMsg
  @return {function(): este.validators.RangeLength}
###
este.validators.rangeLength = (min, max, getMsg) ->
  -> new este.validators.RangeLength min, max, getMsg