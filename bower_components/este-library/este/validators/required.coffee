###*
  @fileoverview Validate value existence. Returns false for null, undefined,
  empty string and empty array. String is trimmed before length check.
###
goog.provide 'este.validators.Required'
goog.provide 'este.validators.required'

goog.require 'este.validators.Base'
goog.require 'goog.string'

class este.validators.Required extends este.validators.Base

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
  isValidable: ->
    true

  ###*
    @override
  ###
  validate: ->
    switch goog.typeOf @value
      when 'string'
        goog.string.trim(@value + '').length > 0
      when 'array'
        @value.length > 0
      else
        @value?

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc Required validator message.
    ###
    Required.MSG_VALIDATOR_REQUIRED = goog.getMsg 'This field is required.'

###*
  @param {function(): string=} getMsg
  @return {function(): este.validators.Required}
###
este.validators.required = (getMsg) ->
  -> new este.validators.Required getMsg