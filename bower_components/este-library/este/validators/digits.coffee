###*
  @fileoverview Digits validator.
###
goog.provide 'este.validators.Digits'
goog.provide 'este.validators.digits'

goog.require 'este.validators.Base'

class este.validators.Digits extends este.validators.Base

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
    /^\d+$/.test @value

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc Digits validator message.
    ###
    Digits.MSG_VALIDATOR_DIGITS = goog.getMsg 'Please enter only digits.'

###*
  @param {function(): string=} getMsg
  @return {function(): este.validators.Digits}
###
este.validators.digits = (getMsg) ->
  -> new este.validators.Digits getMsg