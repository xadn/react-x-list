###*
  @fileoverview Click handler for client side routing.

  - Handle only relevant anchors, see este.dom.isRoutingClick.
  - Support fast click on touch devices.
    - When available, it uses pointerup event. Use this polyfill:
        http://www.polymer-project.org/platform/pointer-events.html
    - Another trick: https://plus.google.com/u/0/+RickByers/posts/ej7nsuoaaDa
      But this one does not work with iOS. Also, sometimes zoom is required.

###
goog.provide 'este.events.RoutingClickHandler'

goog.require 'este.dom'
goog.require 'goog.events.BrowserEvent'
goog.require 'goog.events.EventHandler'
goog.require 'goog.events.EventTarget'
goog.require 'goog.events.KeyCodes'

class este.events.RoutingClickHandler extends goog.events.EventTarget

  ###*
    @param {Element=} element
    @constructor
    @extends {goog.events.EventTarget}
    @final
  ###
  constructor: (element) ->
    super()
    @element_ = element ? document.documentElement
    @eventHandler_ = new goog.events.EventHandler @
    @registerEvents_()

  ###*
    @type {Element}
    @private
  ###
  element_: null

  ###*
    @type {goog.events.EventHandler}
    @private
  ###
  eventHandler_: null

  ###*
    @type {boolean}
    @private
  ###
  pointerEventsSupported_: false

  ###*
    @private
  ###
  registerEvents_: ->
    # Use pointerup where available.
    @eventHandler_.listen @element_, 'pointerup', @onElementPointerUp_
    # Still listen click to be able to prevent browser redirect.
    @eventHandler_.listen @element_, 'click', @onElementClick_

  ###*
    @param {goog.events.BrowserEvent} e
    @protected
  ###
  onElementPointerUp_: (e) ->
    if !@pointerEventsSupported_
      # Ignore click events since we can listen pointerup.
      @pointerEventsSupported_ = true
      # By default key enter on focused anchor creates click event.
      # But with pointer events we are ignoring clicks.
      # So that's why keyup comes to help.
      @eventHandler_.listen @element_, 'keyup', @onElementKeyUp_

    anchor = @tryGetRoutingAnchor e
    return if !anchor
    @dispatchClick anchor, e

  ###*
    @param {goog.events.BrowserEvent} e
    @protected
  ###
  onElementClick_: (e) ->
    anchor = @tryGetRoutingAnchor e
    return if !anchor
    # Prevent default anchor action (redirection).
    e.preventDefault()
    return if @pointerEventsSupported_
    @dispatchClick anchor, e

  ###*
    @param {goog.events.BrowserEvent} e
    @protected
  ###
  onElementKeyUp_: (e) ->
    return if e.keyCode != goog.events.KeyCodes.ENTER
    anchor = @tryGetRoutingAnchor e, true
    return if !anchor
    @dispatchClick anchor, e

  ###*
    @param {goog.events.BrowserEvent} e
    @param {boolean=} ignoreIsRoutingEvent
    @return {Element}
    @protected
  ###
  tryGetRoutingAnchor: (e, ignoreIsRoutingEvent) ->
    return null if !ignoreIsRoutingEvent && !este.dom.isRoutingEvent e
    anchor = goog.dom.getAncestorByTagNameAndClass e.target, goog.dom.TagName.A
    return null if !anchor || !este.dom.isRoutingAnchor anchor
    anchor

  ###*
    @param {Element} anchor
    @param {goog.events.BrowserEvent} e
    @protected
  ###
  dispatchClick: (anchor, e) ->
    clickEvent = new goog.events.BrowserEvent e.getBrowserEvent()
    clickEvent.target = anchor
    clickEvent.type = goog.events.EventType.CLICK
    @dispatchEvent clickEvent

  ###*
    @override
  ###
  disposeInternal: ->
    @eventHandler_.dispose()
    super()
    return