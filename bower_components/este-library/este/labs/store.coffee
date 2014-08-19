goog.provide 'este.labs.Store'
goog.provide 'este.labs.Store.Event'

goog.require 'goog.array'
goog.require 'goog.asserts'
goog.require 'goog.events.EventTarget'

class este.labs.Store extends goog.events.EventTarget

  ###*
    @param {string} name
    @constructor
    @extends {goog.events.EventTarget}
  ###
  constructor: (name) ->
    super()

    ###*
      @const
      @type {string}
    ###
    @name = name

  ###*
    @return {Object}
  ###
  toJson: goog.abstractMethod

  ###*
    @param {Object} json
  ###
  fromJson: goog.abstractMethod

  ###*
    Helper method to create instance fulfiled with provided json.
    @param {function(new:T)} constructor
    @param {Object=} json
    @return {?} I don't know how to annotate this properly.
    @template T
  ###
  instanceFromJson: (constructor, json) ->
    # Example for one instance:
    # @newSong = @instanceFromJson app.songs.Song, songJson
    if arguments.length == 2
      instance = new constructor
      goog.mixin instance, json || {}
      return instance
    # Example for array map:
    # @songs = (@asArray(json.songs) || []).map @instanceFromJson app.songs.Song
    (json) =>
      @instanceFromJson constructor, json

  ###*
    Call this method after any change you made on store.
  ###
  notify: ->
    @dispatchEvent new este.labs.Store.Event false

  ###*
    Call this method after any change server made on store.
  ###
  serverNotify: ->
    @dispatchEvent new este.labs.Store.Event true

  ###*
    Transform array to object where key is item id.
    PATTERN(steida): Never use array if you need concurrent access to its items.
    On the contrary, use array for items without id's, where array is always
    overriden with new version.
    https://www.firebase.com/docs/web/guide/saving-data.html#section-push
    @param {Array} array
    @return {Object}
  ###
  asObject: (array) ->
    goog.asserts.assertArray array
    object = {}
    for item in array
      goog.asserts.assertString item.id
      object[item.id] = item
    object

  ###*
    Transform object to array.
    https://www.firebase.com/docs/web/guide/saving-data.html#section-push
    @param {Object} object
    @return {Array}
  ###
  asArray: (object) ->
    goog.asserts.assertObject object
    for key, value of object
      goog.asserts.assertString value.id
      value

class este.labs.Store.Event extends goog.events.Event

  ###*
    @param {boolean} server
    @constructor
    @extends {goog.events.Event}
    @final
  ###
  constructor: (@server) ->
    super 'change'