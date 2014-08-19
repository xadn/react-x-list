###*
  @fileoverview Validate inexistence value in list.
###
goog.provide 'este.validators.Exclusion'
goog.provide 'este.validators.exclusion'

goog.require 'este.validators.Base'

class este.validators.Exclusion extends este.validators.Base

  ###*
    @param {!Array} exclusion
    @param {function(): string=} getMsg
    @constructor
    @extends {este.validators.Base}
  ###
  constructor: (@exclusion, getMsg) ->
    super getMsg

  ###*
    @type {Array}
    @protected
  ###
  exclusion: null

  ###*
    @override
  ###
  validate: ->
    @value not in @exclusion

  ###*
    @override
  ###
  getMsg: ->
    ###*
      @desc Exclusion validator message.
    ###
    Exclusion.MSG_VALIDATOR_EXCLUSION = goog.getMsg '\'{$value}\' is not allowed.',
      'value': @value

###*
  @param {!Array} exclusion
  @param {function(): string=} getMsg
  @return {function(): este.validators.Exclusion}
###
este.validators.exclusion = (exclusion, getMsg) ->
  -> new este.validators.Exclusion exclusion, getMsg