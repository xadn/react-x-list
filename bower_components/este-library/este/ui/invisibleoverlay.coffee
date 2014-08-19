goog.provide 'este.ui.InvisibleOverlay'

goog.require 'goog.ui.Component'

class este.ui.InvisibleOverlay extends goog.ui.Component

  ###*
    @constructor
    @extends {goog.ui.Component}
  ###
  constructor: ->
    super()

  ###*
    @override
  ###
  createDom: ->
    super()
    @decorateInternal @getElement()
    return

  ###*
    @override
  ###
  decorateInternal: (element) ->
    super element
    @getElement().style.cssText = """
      position: fixed;
      left: 0; right: 0; top: 0; bottom: 0;
      z-index: 2147483647;
      background-color: #000
    """
    goog.style.setOpacity @getElement(), 0
    return