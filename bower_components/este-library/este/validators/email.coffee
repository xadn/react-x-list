###*
  @fileoverview Validate string email format.
###
goog.provide 'este.validators.Email'
goog.provide 'este.validators.email'

goog.require 'este.validators.Base'
goog.require 'goog.format.EmailAddress'

class este.validators.Email extends este.validators.Base

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
    goog.format.EmailAddress.isValidAddress @value

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc Email validator message.
    ###
    Email.MSG_VALIDATOR_EMAIL = goog.getMsg 'Please enter a valid email address.'

###*
  @param {function(): string=} getMsg
  @return {function(): este.validators.Email}
###
este.validators.email = (getMsg) ->
  -> new este.validators.Email getMsg