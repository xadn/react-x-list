goog.provide 'este.dom'

goog.require 'este.object'
goog.require 'goog.array'
goog.require 'goog.dom'
goog.require 'goog.dom.classlist'
goog.require 'goog.dom.forms'
goog.require 'goog.string'
goog.require 'goog.Uri'

###*
  Check if node matches given simple selector. Only tag and class are
  supported now.
  Examples:
    este.dom.match el, 'button'
    este.dom.match el, '.box'
    este.dom.match el, '*'
  @param {Node} node
  @param {string} simpleSelector
  @return {boolean} Whether the given element matches the selector.
###
este.dom.match = (node, simpleSelector) ->
  return true if simpleSelector == '*'
  return false if !goog.dom.isElement node
  queryParts = este.dom.getQueryParts simpleSelector
  for part in queryParts
    return false if part.tag && part.tag != '*' &&
      node.tagName.toLowerCase() != part.tag.toLowerCase()
    return false if part.id &&
      node.id != part.id
    for className in part.classes
      node = (`/** @type {Element} */`) node
      return false if !goog.dom.classlist.contains node, className
  true

###*
  Get node ancestors.
  @param {Node} node
  @param {boolean=} includeNode
  @param {boolean=} stopOnBody
  @return {Array.<Element>}
###
este.dom.getAncestors = (node, includeNode, stopOnBody) ->
  elements = []
  node = node.parentNode if !includeNode
  while node
    break if stopOnBody && node.tagName == 'BODY'
    break if node.nodeType == goog.dom.NodeType.DOCUMENT
    elements.push node
    node = node.parentNode
  elements

###*
  @param {Array.<Element>} elements
###
este.dom.getDomPath = (elements) ->
  path = []
  for element in elements
    path.push element.tagName.toUpperCase()
    path.push '#', element.id if element.id
    for className in goog.dom.classlist.get element
      path.push '.', className
    path.push ' '
  path.pop()
  path.join ''

###*
  @param {Element} newNode
  @param {Element} refNode
  @param {string} where Before, after, prepend, append.
###
este.dom.insert = (newNode, refNode, where) ->
  switch where
    when 'before'
      goog.dom.insertSiblingBefore newNode, refNode
    when 'after'
      goog.dom.insertSiblingAfter newNode, refNode
    when 'prepend'
      goog.dom.insertChildAt refNode, newNode, 0
    when 'append'
      goog.dom.appendChild refNode, newNode
  return

###*
  @param {goog.events.BrowserEvent} e
  @param {Object.<string, Function>} object Key is className, value is
    callback.
  @return {boolean}
###
este.dom.onTargetWithClass = (e, object) ->
  node = e.target
  while node && node.nodeType == 1
    for className, callback of object
      node = (`/** @type {Element} */`) node
      if goog.dom.classlist.contains node, className
        callback node
        return true
    node = node.parentNode
  false

###*
  Alias for goog.dom.forms.getFormDataMap(form).toObject().
  getFormDataMap method always returns array which is not handy. That's why
  this method normalize ['foo'] into 'foo'.
  @param {Element} form
  @return {Object}
###
este.dom.serializeForm = (form) ->
  form = (`/** @type {HTMLFormElement} */`) form
  object = goog.dom.forms.getFormDataMap(form).toObject()
  este.object.normalizeOneItemArrayValues object

###*
  Returns a single value of a form element.

  If there are more elements with given name, returns value of the first one.
  If none is found, returns null.

  @param {Element} form
  @param {string} name
  @return {?string}
###
este.dom.getSingleFormValueByName = (form, name) ->
  form = (`/** @type {HTMLFormElement} */`) form
  value = goog.dom.forms.getValueByName form, name
  return value if !goog.isArray value
  return null if value.length == 0
  value[0]

###*
  @param {Element} element
  @return {Array.<number>}
###
este.dom.getDomPathIndexes = (element) ->
  indexes = []
  parent = null
  loop
    parent = (`/** @type {Element} */`) element.parentNode
    break if !parent || parent.nodeType != 1
    index = goog.array.indexOf parent.childNodes, element
    indexes.push index
    element = parent
  indexes.reverse()
  indexes

###*
  @param {Array.<number>} path
  @param {Document=} doc
  @return {Element}
###
este.dom.getElementByDomPathIndex = (path, doc = document) ->
  element = doc.documentElement
  while path.length
    index = path.shift()
    element = element.childNodes[index]
  element

###*
  @param {Element} el
###
este.dom.focus = (el) ->
  try
    el.focus()
  catch e

###*
  @param {Element} el
###
este.dom.focusAsync = (el) ->
  setTimeout ->
    este.dom.focus el
  , 0

###*
  Hack to force blur.
###
este.dom.forceBlur = ->
  setTimeout ->
    input = goog.dom.createDom 'input',
      # prevents scroll jumps
      style: 'position: fixed; left: 0; top: 0'
    document.body.appendChild input
    input.focus()
    document.body.removeChild input
  , 0

###*
  Check if click is useable for client side routing.
  @param {goog.events.BrowserEvent} e
  @return {boolean}
###
este.dom.isRoutingClick = (e) ->
  return false if !este.dom.isRoutingEvent e
  target = (`/** @type {Element} */`) e.target
  while not target.href and target.parentElement
    target = target.parentElement
  return false if !este.dom.isRoutingAnchor target
  true

###*
  @param {goog.events.BrowserEvent} e
  @return {boolean}
###
este.dom.isRoutingEvent = (e) ->
  # Handle only primary mouse button.
  return false if !e.isMouseActionButton()
  # Handle only plain click without keys. On Chrome Mac shift opens link in
  # new window, cmd in new tab, alt means download, ctrl emulates right click.
  # Client side routing should ignore all these actions.
  return false if e.ctrlKey || e.altKey || e.shiftKey || e.metaKey
  # Ignore default prevented.
  # NOTE: Does not work with emulated pointer events from Polymer.
  return false if e.getBrowserEvent().defaultPrevented
  true

###*
  @param {Element} anchor
  @return {boolean}
###
este.dom.isRoutingAnchor = (anchor) ->
  # Ignore anchor with target.
  return false if anchor.target
  # Ignore x-domain anchor.
  locationUri = new goog.Uri window.location
  anchorUri = new goog.Uri anchor.href
  return false if !locationUri.hasSameDomainAs anchorUri
  true

###*
  @param {Element} form
  @param {boolean} enable
###
este.dom.setFormEnabled = (form, enable) ->
  field.disabled = !enable for field in form.elements

###*
  @param {Element|Node} form
  @param {Object} errors
###
este.dom.showErrorsOnForm = (form, errors) ->
  for name, field of form.elements
    goog.dom.classlist.remove field, 'e-dom-field-error'
  return if not errors
  error = errors[0]
  alert error.getMsg()
  invalidField = form.elements[error.key]
  goog.dom.classlist.add invalidField, 'e-dom-field-error'
  este.dom.focus invalidField

###*
  For mousehover (mouseenter, mouseleave) detection.
  @param {goog.events.BrowserEvent} e
  @param {Node} target
  @return {boolean}
###
este.dom.isMouseHoverEventWithinElement = (e, target) ->
  e.type in ['mouseover', 'mouseout'] &&
  !!e.relatedTarget &&
  goog.dom.contains target, e.relatedTarget

# Extracted from goog.dom.query.
`
/**
  Extracted and modified goog.dom.query getQueryParts method.
  Returns [
    query: null, // the full text of the part's rule
    pseudos: [], // CSS supports multiple pseudo-class matches in a single
        // rule
    attrs: [],  // CSS supports multi-attribute match, so we need an array
    classes: [], // class matches may be additive,
        // e.g.: .thinger.blah.howdy
    tag: null,  // only one tag...
    oper: null, // ...or operator per component. Note that these wind up
        // being exclusive.
    id: null   // the id component of a rule
  , ..
  ]
  @private
*/
este.dom.getQueryPartsCache_ = {};
este.dom.getQueryParts = function(query) {
  var queryKey = query;
  var cached = este.dom.getQueryPartsCache_[queryKey];
  if (cached) {
    return cached;
  }

  //  summary:
  //    state machine for query tokenization
  //  description:
  //    instead of using a brittle and slow regex-based CSS parser,
  //    dojo.query implements an AST-style query representation. This
  //    representation is only generated once per query. For example,
  //    the same query run multiple times or under different root nodes
  //    does not re-parse the selector expression but instead uses the
  //    cached data structure. The state machine implemented here
  //    terminates on the last " " (space) character and returns an
  //    ordered array of query component structures (or "parts"). Each
  //    part represents an operator or a simple CSS filtering
  //    expression. The structure for parts is documented in the code
  //    below.


  // NOTE:
  //    this code is designed to run fast and compress well. Sacrifices
  //    to readability and maintainability have been made.
  if ('>~+'.indexOf(query.slice(-1)) >= 0) {
    // If we end with a ">", "+", or "~", that means we're implicitly
    // searching all children, so make it explicit.
    query += ' * '
  } else {
    // if you have not provided a terminator, one will be provided for
    // you...
    query += ' ';
  }

  var ts = function(/*Integer*/ s, /*Integer*/ e) {
    // trim and slice.

    // take an index to start a string slice from and an end position
    // and return a trimmed copy of that sub-string
    return goog.string.trim(query.slice(s, e));
  };

  // The overall data graph of the full query, as represented by queryPart
  // objects.
  var queryParts = [];


  // state keeping vars
  var inBrackets = -1,
      inParens = -1,
      inMatchFor = -1,
      inPseudo = -1,
      inClass = -1,
      inId = -1,
      inTag = -1,
      lc = '',
      cc = '',
      pStart;

  // iteration vars
  var x = 0, // index in the query
      ql = query.length,
      currentPart = null, // data structure representing the entire clause
      cp = null; // the current pseudo or attr matcher

  // several temporary variables are assigned to this structure during a
  // potential sub-expression match:
  //    attr:
  //      a string representing the current full attribute match in a
  //      bracket expression
  //    type:
  //      if there's an operator in a bracket expression, this is
  //      used to keep track of it
  //    value:
  //      the internals of parenthetical expression for a pseudo. for
  //      :nth-child(2n+1), value might be '2n+1'

  var endTag = function() {
    // called when the tokenizer hits the end of a particular tag name.
    // Re-sets state variables for tag matching and sets up the matcher
    // to handle the next type of token (tag or operator).
    if (inTag >= 0) {
      var tv = (inTag == x) ? null : ts(inTag, x);
      if ('>~+'.indexOf(tv) < 0) {
        currentPart.tag = tv;
      } else {
        currentPart.oper = tv;
      }
      inTag = -1;
    }
  };

  var endId = function() {
    // Called when the tokenizer might be at the end of an ID portion of a
    // match.
    if (inId >= 0) {
      currentPart.id = ts(inId, x).replace(/\\/g, '');
      inId = -1;
    }
  };

  var endClass = function() {
    // Called when the tokenizer might be at the end of a class name
    // match. CSS allows for multiple classes, so we augment the
    // current item with another class in its list.
    if (inClass >= 0) {
      currentPart.classes.push(ts(inClass + 1, x).replace(/\\/g, ''));
      inClass = -1;
    }
  };

  var endAll = function() {
    // at the end of a simple fragment, so wall off the matches
    endId(); endTag(); endClass();
  };

  var endPart = function() {
    endAll();
    if (inPseudo >= 0) {
      currentPart.pseudos.push({ name: ts(inPseudo + 1, x) });
    }
    // Hint to the selector engine to tell it whether or not it
    // needs to do any iteration. Many simple selectors don't, and
    // we can avoid significant construction-time work by advising
    // the system to skip them.
    currentPart.loops = currentPart.pseudos.length ||
                        currentPart.attrs.length ||
                        currentPart.classes.length;

    // save the full expression as a string
    currentPart.oquery = currentPart.query = ts(pStart, x);


    // otag/tag are hints to suggest to the system whether or not
    // it's an operator or a tag. We save a copy of otag since the
    // tag name is cast to upper-case in regular HTML matches. The
    // system has a global switch to figure out if the current
    // expression needs to be case sensitive or not and it will use
    // otag or tag accordingly
    currentPart.otag = currentPart.tag = (currentPart.oper) ?
                                                   null :
                                                   (currentPart.tag || '*');

    if (currentPart.tag) {
      // if we're in a case-insensitive HTML doc, we likely want
      // the toUpperCase when matching on element.tagName. If we
      // do it here, we can skip the string op per node
      // comparison
      currentPart.tag = currentPart.tag.toUpperCase();
    }

    // add the part to the list
    if (queryParts.length && (queryParts[queryParts.length - 1].oper)) {
      // operators are always infix, so we remove them from the
      // list and attach them to the next match. The evaluator is
      // responsible for sorting out how to handle them.
      currentPart.infixOper = queryParts.pop();
      currentPart.query = currentPart.infixOper.query + ' ' +
          currentPart.query;
    }
    queryParts.push(currentPart);

    currentPart = null;
  }

  // iterate over the query, character by character, building up a
  // list of query part objects
  for (; lc = cc, cc = query.charAt(x), x < ql; x++) {
    //    cc: the current character in the match
    //    lc: the last character (if any)

    // someone is trying to escape something, so don't try to match any
    // fragments. We assume we're inside a literal.
    if (lc == '\\') {
      continue;
    }
    if (!currentPart) { // a part was just ended or none has yet been created
      // NOTE: I hate all this alloc, but it's shorter than writing tons of
      // if's
      pStart = x;
      //  rules describe full CSS sub-expressions, like:
      //    #someId
      //    .className:first-child
      //  but not:
      //    thinger > div.howdy[type=thinger]
      //  the individual components of the previous query would be
      //  split into 3 parts that would be represented a structure
      //  like:
      //    [
      //      {
      //        query: 'thinger',
      //        tag: 'thinger',
      //      },
      //      {
      //        query: 'div.howdy[type=thinger]',
      //        classes: ['howdy'],
      //        infixOper: {
      //          query: '>',
      //          oper: '>',
      //        }
      //      },
      //    ]
      currentPart = {
        query: null, // the full text of the part's rule
        pseudos: [], // CSS supports multiple pseudo-class matches in a single
            // rule
        attrs: [],  // CSS supports multi-attribute match, so we need an array
        classes: [], // class matches may be additive,
            // e.g.: .thinger.blah.howdy
        tag: null,  // only one tag...
        oper: null, // ...or operator per component. Note that these wind up
            // being exclusive.
        id: null   // the id component of a rule
      };

      // if we don't have a part, we assume we're going to start at
      // the beginning of a match, which should be a tag name. This
      // might fault a little later on, but we detect that and this
      // iteration will still be fine.
      inTag = x;
    }

    if (inBrackets >= 0) {
      // look for a the close first
      if (cc == ']') { // if we're in a [...] clause and we end, do assignment
        if (!cp.attr) {
          // no attribute match was previously begun, so we
          // assume this is an attribute existence match in the
          // form of [someAttributeName]
          cp.attr = ts(inBrackets + 1, x);
        } else {
          // we had an attribute already, so we know that we're
          // matching some sort of value, as in [attrName=howdy]
          cp.matchFor = ts((inMatchFor || inBrackets + 1), x);
        }
        var cmf = cp.matchFor;
        if (cmf) {
          // try to strip quotes from the matchFor value. We want
          // [attrName=howdy] to match the same
          //  as [attrName = 'howdy' ]
          if ((cmf.charAt(0) == '"') || (cmf.charAt(0) == "'")) {
            cp.matchFor = cmf.slice(1, -1);
          }
        }
        // end the attribute by adding it to the list of attributes.
        currentPart.attrs.push(cp);
        cp = null; // necessary?
        inBrackets = inMatchFor = -1;
      } else if (cc == '=') {
        // if the last char was an operator prefix, make sure we
        // record it along with the '=' operator.
        var addToCc = ('|~^$*'.indexOf(lc) >= 0) ? lc : '';
        cp.type = addToCc + cc;
        cp.attr = ts(inBrackets + 1, x - addToCc.length);
        inMatchFor = x + 1;
      }
      // now look for other clause parts
    } else if (inParens >= 0) {
      // if we're in a parenthetical expression, we need to figure
      // out if it's attached to a pseudo-selector rule like
      // :nth-child(1)
      if (cc == ')') {
        if (inPseudo >= 0) {
          cp.value = ts(inParens + 1, x);
        }
        inPseudo = inParens = -1;
      }
    } else if (cc == '#') {
      // start of an ID match
      endAll();
      inId = x + 1;
    } else if (cc == '.') {
      // start of a class match
      endAll();
      inClass = x;
    } else if (cc == ':') {
      // start of a pseudo-selector match
      endAll();
      inPseudo = x;
    } else if (cc == '[') {
      // start of an attribute match.
      endAll();
      inBrackets = x;
      // provide a new structure for the attribute match to fill-in
      cp = {
        /*=====
        attr: null, type: null, matchFor: null
        =====*/
      };
    } else if (cc == '(') {
      // we really only care if we've entered a parenthetical
      // expression if we're already inside a pseudo-selector match
      if (inPseudo >= 0) {
        // provide a new structure for the pseudo match to fill-in
        cp = {
          name: ts(inPseudo + 1, x),
          value: null
        }
        currentPart.pseudos.push(cp);
      }
      inParens = x;
    } else if (
      (cc == ' ') &&
      // if it's a space char and the last char is too, consume the
      // current one without doing more work
      (lc != cc)
    ) {
      endPart();
    }
  }
  return este.dom.getQueryPartsCache_[queryKey] = queryParts;
};
`