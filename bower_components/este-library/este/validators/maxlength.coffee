###*
  @fileoverview Validate string length.
###
goog.provide 'este.validators.MaxLength'
goog.provide 'este.validators.maxLength'

goog.require 'este.validators.Base'

class este.validators.MaxLength extends este.validators.Base

  ###*
    @param {number} maxLength
    @param {function(): string=} getMsg
    @constructor
    @extends {este.validators.Base}
  ###
  constructor: (@maxLength, getMsg) ->
    super getMsg

  ###*
    @type {number}
    @protected
  ###
  maxLength: 0

  ###*
    @override
  ###
  validate: ->
    goog.asserts.assertString @value
    @value.length <= @maxLength

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc MaxLength validator message.
    ###
    MaxLength.MSG_VALIDATOR_MAX_LENGTH = goog.getMsg 'Please enter no more than {$maxLength} characters.',
      'maxLength': @maxLength

###*
  @param {number} maxLength
  @param {function(): string=} getMsg
  @return {function(): este.validators.MaxLength}
###
este.validators.maxLength = (maxLength, getMsg) ->
  -> new este.validators.MaxLength maxLength, getMsg