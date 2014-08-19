###*
  @fileoverview Validate string length.
###
goog.provide 'este.validators.MinLength'
goog.provide 'este.validators.minLength'

goog.require 'este.validators.Base'

class este.validators.MinLength extends este.validators.Base

  ###*
    @param {number} minLength
    @param {function(): string=} getMsg
    @constructor
    @extends {este.validators.Base}
  ###
  constructor: (@minLength, getMsg) ->
    super getMsg

  ###*
    @type {number}
    @protected
  ###
  minLength: 0

  ###*
    @override
  ###
  validate: ->
    goog.asserts.assertString @value
    @value.length >= @minLength

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc MinLength validator message.
    ###
    MinLength.MSG_VALIDATOR_MIN_LENGTH = goog.getMsg 'Please enter at least {$minLength} characters.',
      'minLength': @minLength

###*
  @param {number} minLength
  @param {function(): string=} getMsg
  @return {function(): este.validators.MinLength}
###
este.validators.minLength = (minLength, getMsg) ->
  -> new este.validators.MinLength minLength, getMsg