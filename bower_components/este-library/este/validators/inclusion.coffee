###*
  @fileoverview Validate existence value in list.
###
goog.provide 'este.validators.Inclusion'
goog.provide 'este.validators.inclusion'

goog.require 'este.validators.Base'

class este.validators.Inclusion extends este.validators.Base

  ###*
    @param {!Array} inclusion
    @param {function(): string=} getMsg
    @constructor
    @extends {este.validators.Base}
  ###
  constructor: (@inclusion, getMsg) ->
    super getMsg

  ###*
    @type {Array}
    @protected
  ###
  inclusion: null

  ###*
    @override
  ###
  validate: ->
    @value in @inclusion

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc Inclusion validator message.
    ###
    Inclusion.MSG_VALIDATOR_INCLUSION = goog.getMsg 'Please enter one of these values: {$inclusion}.',
      'inclusion': @inclusion.join ', '

###*
  @param {!Array} inclusion
  @param {function(): string=} getMsg
  @return {function(): este.validators.Inclusion}
###
este.validators.inclusion = (inclusion, getMsg) ->
  -> new este.validators.Inclusion inclusion, getMsg