###*
  @fileoverview Validate string number format.
###
goog.provide 'este.validators.Number'
goog.provide 'este.validators.number'

goog.require 'este.validators.Base'
goog.require 'goog.string'

class este.validators.Number extends este.validators.Base

  ###*
    @param {function(): string=} getMsg
    @constructor
    @extends {este.validators.Base}
  ###
  constructor: (getMsg) ->
    super getMsg

  ###*
    @override
  ###
  validate: ->
    goog.asserts.assertString @value
    value = goog.string.toNumber @value
    typeof value == 'number' && goog.math.isFiniteNumber value

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc Number validator message.
    ###
    Number.MSG_VALIDATOR_NUMBER = goog.getMsg 'Please enter a valid number.'

###*
  @param {function(): string=} getMsg
  @return {function(): este.validators.Number}
###
este.validators.number = (getMsg) ->
  -> new este.validators.Number getMsg