###*
  @fileoverview Validate string with regex.
###
goog.provide 'este.validators.Format'
goog.provide 'este.validators.format'

goog.require 'este.validators.Base'

class este.validators.Format extends este.validators.Base

  ###*
    @param {RegExp} regexp
    @param {function(): string=} getMsg
    @constructor
    @extends {este.validators.Base}
  ###
  constructor: (@regexp, getMsg) ->
    super getMsg

  ###*
    @type {RegExp}
    @protected
  ###
  regexp: null

  ###*
    @override
  ###
  validate: ->
    goog.asserts.assertString @value
    @regexp.test @value

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc Format validator message.
    ###
    Format.MSG_VALIDATOR_FORMAT = goog.getMsg 'Please enter a value in correct format.'

###*
  @param {RegExp} regexp
  @param {function(): string=} getMsg
  @return {function(): este.validators.Format}
###
este.validators.format = (regexp, getMsg) ->
  -> new este.validators.Format regexp, getMsg