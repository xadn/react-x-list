goog.provide 'este.router.create'

goog.require 'este.Router'
goog.require 'este.History'
goog.require 'este.events.RoutingClickHandler'

###*
  @param {boolean=} forceHash
  @return {este.Router}
###
este.router.create = (forceHash) ->
  history = new este.History forceHash: forceHash
  routingClickHandler = new este.events.RoutingClickHandler

  new este.Router history, routingClickHandler