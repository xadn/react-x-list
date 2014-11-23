/** @jsx React.DOM */
var React         = require('react/addons');
var ListContainer = require('./list_container');
var ItemWrapper   = require('./item_wrapper');
var Utils         = require('./utils');

var List = React.createClass({
  getDefaultProps: function() {
    return {defaultHeight: 20};
  },

  getInitialState: function() {
    return {
      isScrollingUp: true,
      lastScrolled: -1,
      firstVisible:  0,
      lastVisible:   0,
      scrollHeight:  0,
      scrollTop:     0,
      topOf:    new Uint32Array(0),
      heightOf: new Uint32Array(0),
      keyToIndex: {}
    };
  },

  componentWillMount: function() {
    this.setStateIfChanged(
      this.initializeMetrics(
        this.initializeVisibility({
          props: this.props,
          state: this.state,
          stateChanges: {}})));
  },

  componentDidMount: function() {
    this.setStateIfChanged(
      this.calculateVisibility(
        this.getMetrics({
          props: this.props,
          state: this.state,
          stateChanges: {}})));

    if (this.isMounted()) {
      this.observer_ = new MutationObserver(this.handleMutations);
      this.observer_.observe(this.getDOMNode(), {attributes: true, childList: true, characterData: true, subtree: true});
    }
  },

  componentWillUnmount: function() {
    this.observer_ && this.observer_.disconnect();
    this.observer_ = null;
  },

  componentWillUpdate: function() {
    this.setStateIfChanged(
      this.getScroll({
          props: this.props,
          state: this.state,
          stateChanges: {}}));
  },

  componentWillReceiveProps: function(nextProps) {
    this.setStateIfChanged(
      this.calculateVisibility(
        this.reinitializeMetrics({
          nextProps: nextProps,
          props: this.props,
          state: this.state,
          stateChanges: {}})));
  },

  componentDidUpdate: function() {
    this.setStateIfChanged(
      this.calculateVisibility(
        this.getMetrics(
          this.fixScrollPosition({
          props: this.props,
          state: this.state,
          stateChanges: {}}))));
  },

  handleMutations: function() {
    this.setStateIfChanged(
      this.calculateVisibility(
        this.getMetrics(
          this.fixScrollPosition({
          props: this.props,
          state: this.state,
          stateChanges: {}}))));
  },

  handleScroll: function() {
    this.setStateIfChanged(
      this.calculateVisibility({
          props: this.props,
          state: this.state,
          stateChanges: {}}));
  },

  handleWheel: function(index, e) {
    this.setStateIfChanged({stateChanges: {lastScrolled: index, isScrollingUp: e.deltaY < 0}});
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return this.state.firstVisible !== nextState.firstVisible ||
           this.state.lastVisible  !== nextState.lastVisible  ||
           this.state.lastScrolled !== nextState.lastScrolled ||
           this.state.heightOf     !== nextState.heightOf     ||
           this.state.keyToIndex   !== nextState.keyToIndex;
  },

  render: function() {
    var firstVisible = this.state.firstVisible;
    var lastVisible = this.state.lastVisible;
    var lastScrolled = this.state.lastScrolled;
    var child = firstVisible;
    var index = 0;
    var length = lastVisible - firstVisible + 2;
    var visibleChildren = [];
    visibleChildren.length = length|0;

    if (firstVisible > lastScrolled && lastScrolled > -1) {
      visibleChildren[0] = this.wrapChild(lastScrolled, true);
      index = 1;
    } else if (this.props.children.length > lastScrolled && lastScrolled > lastVisible) {
      visibleChildren[length - 1] = this.wrapChild(lastScrolled);
    }

    while (child <= lastVisible) {
      visibleChildren[index] = this.wrapChild(child, false);
      child++;
      index++;
    }

    return (
      <ListContainer onScroll={this.handleScroll} style={{height: this.totalHeight()}}>
        {visibleChildren}
      </ListContainer>
    );
  },

  wrapChild: function(index, fixedHeight) {
    var childComponent = this.props.children[index];
    var key = childComponent.key;

    return (
      <ItemWrapper
        key={key}
        ref={key}
        index={index}
        onWheel={this.handleWheel}
        offsetTop={this.state.topOf[index]}
        fixedHeight={fixedHeight}
        visible={this.state.heightOf[index] !== this.props.defaultHeight}>
        {childComponent}
      </ItemWrapper>
    );
  },

  getScroll: function(params) {
    var node         = this.getDOMNode();
    var scrollHeight = node.scrollHeight;
    var scrollTop    = node.scrollTop;

    if (scrollHeight !== params.state.scrollHeight) {
      params.stateChanges.scrollHeight = scrollHeight;
    }
    if (scrollTop !== params.state.scrollTop) {
      params.stateChanges.scrollTop = scrollTop;
    }
    return params;
  },

  fixScrollPosition: function(params) {
    if (this.state.isScrollingUp) {
      var node = this.getDOMNode();
      var newScrollTop = this.state.scrollTop + (node.scrollHeight - this.state.scrollHeight);

      if (node.scrollTop !== newScrollTop) {
        node.scrollTop = newScrollTop;
      }
    }
    return params;
  },

  initializeVisibility: function(params) {
    if (params.props.children.length > 1) {
      params.stateChanges.lastVisible = 1;
    } else {
      params.stateChanges.lastVisible = 0;
    }
    return params;
  },

  calculateVisibility: function(params) {
    var topOf         = params.stateChanges.topOf || params.state.topOf;
    var node          = this.getDOMNode();
    var viewportStart = node.scrollTop;
    var viewportEnd   = viewportStart + node.offsetHeight;
    params.stateChanges.scrollHeight = node.scrollHeight;
    params.stateChanges.scrollTop    = viewportStart;
    params.stateChanges.firstVisible = Utils.binarySearch(topOf, viewportStart);
    params.stateChanges.lastVisible  = Utils.binarySearch(topOf, viewportEnd + 1);
    return params;
  },

  initializeMetrics: function(params) {
    var children      = params.props.children;
    var len           = children.length;
    var defaultHeight = params.props.defaultHeight;
    var heightOf      = new Uint32Array(len);
    var topOf         = new Uint32Array(len);
    var keyToIndex    = {};

    for (var child = 0; child < len; child++) {
      var key         = children[child].key;
      heightOf[child] = defaultHeight;
      topOf[child]    = defaultHeight * child;
      keyToIndex[key] = child;
    }

    params.stateChanges.heightOf   = heightOf;
    params.stateChanges.topOf      = topOf;
    params.stateChanges.keyToIndex = keyToIndex;
    return params;
  },

  reinitializeMetrics: function(params) {
    var children       = params.nextProps.children;
    var len            = children.length;
    var defaultHeight  = params.nextProps.defaultHeight;
    var prevHeightOf   = params.state.heightOf;
    var prevKeyToIndex = params.state.keyToIndex;
    var heightOf       = new Uint32Array(len);
    var topOf          = new Uint32Array(len);
    var keyToIndex     = {};
    var runningTotal   = 0;

    for (var child = 0; child < len; child++) {
      var key         = children[child].key;
      var height      = prevKeyToIndex[key] ? prevHeightOf[prevKeyToIndex[key]] : defaultHeight;
      heightOf[child] = height
      topOf[child]    = runningTotal;
      runningTotal    = runningTotal + height;
      keyToIndex[key] = child;
    }

    if (params.state.lastScrolled !== -1) {
      var lastScrolledKey = params.props.children[params.state.lastScrolled].key;
      params.stateChanges.lastScrolled = keyToIndex[lastScrolledKey] || -1;
    }

    params.stateChanges.heightOf   = heightOf;
    params.stateChanges.topOf      = topOf;
    params.stateChanges.keyToIndex = keyToIndex;
    params.props = params.nextProps;
    return params;
  },

  getMetrics: function(params) {
    var firstChanged = this.indexOfFirstChanged(params);

    if (firstChanged === -1) {
      params.stateChanges.heightOf = params.state.heightOf;
      params.stateChanges.topOf    = params.state.topOf;
      return params;
    }

    var refs         = this.refs;
    var children     = params.props.children;
    var len          = children.length;
    var prevHeightOf = params.state.heightOf;
    var prevTopOf    = params.state.topOf;
    var firstVisible = params.state.firstVisible;
    var lastVisible  = params.state.lastVisible;
    var heightOf     = new Uint32Array(len);
    var topOf        = new Uint32Array(len);
    var runningTotal = 0;
    var child = 0;

    while (child < firstChanged) {
      var height      = prevHeightOf[child];
      heightOf[child] = height;
      topOf[child]    = runningTotal;
      runningTotal    = runningTotal + height;
      child++;
    }

    while (child <= lastVisible) {
      var height      = refs[children[child].key].getDOMNode().offsetHeight;
      heightOf[child] = height;
      topOf[child]    = runningTotal;
      runningTotal    = runningTotal + height;
      child++;
    }

    while (child < len) {
      var height      = prevHeightOf[child];
      heightOf[child] = height;
      topOf[child]    = runningTotal;
      runningTotal    = runningTotal + height;
      child++;
    }

    params.stateChanges.heightOf = heightOf;
    params.stateChanges.topOf    = topOf;
    return params;
  },

  indexOfFirstChanged: function(params) {
    var firstVisible = params.state.firstVisible;
    var lastVisible  = params.state.lastVisible;
    var prevHeightOf = params.state.heightOf;
    var children     = params.props.children;
    var refs         = this.refs;
    var child        = firstVisible;

    while (child <= lastVisible) {
      if (prevHeightOf[child] !== refs[children[child].key].getDOMNode().offsetHeight) {
        return child;
      }
      child++;
    }
    return -1;
  },

  totalHeight: function() {
    var lastIndex = this.props.children.length - 1;
    return this.state.topOf[lastIndex] + this.state.heightOf[lastIndex];
  },

  setStateIfChanged: function(params) {
    for (var prop in params.stateChanges) {
      this.setState(params.stateChanges);
      return;
    }
  }
});

module.exports = List;