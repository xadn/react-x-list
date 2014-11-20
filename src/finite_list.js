/** @jsx React.DOM */
var React       = require('react/addons');
var ListContainer = require('./list_container');
var ItemWrapper = require('./item_wrapper');
var Utils       = require('./utils');
var _ = require('lodash');

var safety = 0;

var List = React.createClass({
  getDefaultProps: function() {
    return {defaultHeight: 20};
  },

  getInitialState: function() {
    return {
      isScrollingUp: true,
      lastScrolled: -1,
      firstVisible: 0,
      lastVisible: 0,
      scrollHeight: 0,
      scrollTop: 0,
      topOf:    new Uint32Array(0),
      bottomOf: new Uint32Array(0),
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
  },

  componentWillUpdate: function() {
    this.setStateIfChanged(
      this.getScroll({
          props: this.props,
          state: this.state,
          stateChanges: {}}));
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

  componentWillReceiveProps: function(nextProps) {
    // console.log('componentWillReceiveProps');
    this.setStateIfChanged(
      this.calculateVisibility(
        this.reinitializeMetrics({
          nextProps: nextProps,
          props: this.props,
          state: this.state,
          stateChanges: {}})));
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
    var shouldUpdate = this.state.firstVisible !== nextState.firstVisible ||
           this.state.lastVisible  !== nextState.lastVisible  ||
           this.state.lastScrolled !== nextState.lastScrolled ||
           !_.isEqual(this.state.heightOf, nextState.heightOf) ||
           !_.isEqual(this.state.keyToIndex, nextState.keyToIndex) ||
           false;
           // this.state.heightOf     !== nextState.heightOf;

    if (shouldUpdate) {
      safety++;
      if (safety > 50) {
        throw new Error('too many renders in a row')
      }
    } else {
      safety = 0;
    }


    // console.log('shouldComponentUpdate', 'shouldUpdate', shouldUpdate, {
    //   1: this.state.firstVisible !== nextState.firstVisible,
    //   2: this.state.lastVisible  !== nextState.lastVisible ,
    //   3: this.state.lastScrolled !== nextState.lastScrolled,
    //   4: !_.isEqual(this.state.heightOf, nextState.heightOf),
    //   5: !_.isEqual(this.state.keyToIndex, nextState.keyToIndex),
    //   'this.state.heightOf': JSON.stringify(this.state.heightOf),
    //   'nextState.heightOf': JSON.stringify(nextState.heightOf)
    // });
    return shouldUpdate;
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

    // console.log('render', {
    //   firstVisible: firstVisible,
    //   lastVisible: lastVisible,
    //   lastScrolled: lastScrolled
    // })

    if (lastScrolled >= 0 && firstVisible > lastScrolled) {
      visibleChildren[0] = this.wrapChild(lastScrolled);
      index = 1;
    } else if (lastScrolled > lastVisible) {
      visibleChildren[length - 1] = this.wrapChild(lastScrolled);
    }

    while (child <= lastVisible) {
      visibleChildren[index] = this.wrapChild(child);
      child++;
      index++;
    }

    return (
      <ListContainer onScroll={this.handleScroll} style={{height: this.totalHeight()}}>
        {visibleChildren}
      </ListContainer>
    );
  },

  wrapChild: function(index) {
    var child = this.props.children[index],
        key = child.key;

    return (
      <ItemWrapper
        key={key}
        ref={key}
        index={index}
        onWheel={this.handleWheel}
        offsetTop={this.state.topOf[index]}
        visible={this.state.heightOf[index] !== this.props.defaultHeight}>
        {child}
      </ItemWrapper>
    );
  },

  getScroll: function(params) {
    var node = this.getDOMNode();
    var scrollHeight = node.scrollHeight;
    var scrollTop = node.scrollTop;

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

  calculateVisibility: function(params) {
    var topOf = params.stateChanges.topOf || params.state.topOf;
    var node = this.getDOMNode();
    var viewportStart = node.scrollTop;
    var viewportEnd = viewportStart + node.offsetHeight;

    params.stateChanges.scrollHeight = node.scrollHeight;
    params.stateChanges.scrollTop = viewportStart;
    params.stateChanges.firstVisible = Utils.binarySearch(topOf, viewportStart);
    params.stateChanges.lastVisible = Utils.binarySearch(topOf, viewportEnd + 1);

    // params.stateChanges.firstVisible = Math.max(params.stateChanges.firstVisible, 0);
    // params.stateChanges.lastVisible = Math.min(params.stateChanges.lastVisible, params.props.children.length);

    // Utils.binarySearch(topOf, 1573)
    // debugger

    // console.log('calculateVisibility', {
    //   viewportStart: viewportStart,
    //   'viewportEnd + 1': viewportEnd+1,
    //   firstVisible: params.stateChanges.firstVisible,
    //   lastVisible: params.stateChanges.lastVisible
    // })
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

  initializeMetrics: function(params) {
    var children = params.props.children;
    var len = children.length;
    var defaultHeight = params.props.defaultHeight;
    var heightOf = new Uint32Array(len);
    var topOf    = new Uint32Array(len);
    var bottomOf = new Uint32Array(len);
    var keyToIndex = {};

    for (var i = 0; i < len; i++) {
      heightOf[i] = defaultHeight;
      topOf[i]    = defaultHeight * i;
      bottomOf[i] = defaultHeight * i + defaultHeight;
      keyToIndex[children[i].key] = i;
    }

    params.stateChanges.heightOf = heightOf;
    params.stateChanges.topOf    = topOf;
    params.stateChanges.bottomOf = bottomOf;
    params.stateChanges.keyToIndex = keyToIndex;
    return params;
  },

  reinitializeMetrics: function(params) {
    var children = params.nextProps.children;
    var len = children.length;
    var defaultHeight = params.nextProps.defaultHeight;
    var prevHeightOf = params.state.heightOf;
    var prevKeyToIndex = params.state.keyToIndex;
    var runningTotal = 0;
    var heightOf = new Uint32Array(len);
    var topOf    = new Uint32Array(len);
    var bottomOf = new Uint32Array(len);
    var keyToIndex = {};

    for (var child = 0; child < len; child++) {
      var key = children[child].key;
      heightOf[child] = prevKeyToIndex[key] ? prevHeightOf[prevKeyToIndex[key]] : defaultHeight;
      topOf[child]    = runningTotal;
      bottomOf[child] = topOf[child] + heightOf[child];
      runningTotal    = bottomOf[child];
      keyToIndex[key] = child;
    }

    // console.log('reinitializeMetrics', topOf.length)

    if (params.state.lastScrolled !== -1) {
      var lastScrolledKey = params.props.children[params.state.lastScrolled].key;
      params.stateChanges.lastScrolled = keyToIndex[lastScrolledKey] || -1;
    }

    params.stateChanges.heightOf = heightOf;
    params.stateChanges.topOf    = topOf;
    params.stateChanges.bottomOf = bottomOf;
    params.stateChanges.keyToIndex = keyToIndex;

    params.props = params.nextProps;
    return params;
  },

  getMetrics: function(params) {
    var refs = this.refs;
    var children = params.props.children;
    var len = children.length;

    var defaultHeight = params.props.defaultHeight;
    var prevHeightOf = params.state.heightOf;
    var prevKeyToIndex = params.state.keyToIndex;
    // var keyToIndex = params.state.keyToIndex;

    var runningTotal = 0;
    var heightOf = new Uint32Array(len);
    var topOf    = new Uint32Array(len);
    var bottomOf = new Uint32Array(len);
    var keyToIndex = {};

    for (var child = 0; child < len; child++) {
      var key = children[child].key;

      if (refs[key]) {
        heightOf[child] = refs[key].getDOMNode().offsetHeight;
      }
      else if (prevKeyToIndex[key]) {
        heightOf[child] = prevHeightOf[prevKeyToIndex[key]];
      }
      else {
        heightOf[child] = prevHeightOf[child];
      }

      topOf[child]    = runningTotal;
      bottomOf[child] = topOf[child] + heightOf[child];
      runningTotal    = bottomOf[child];
      keyToIndex[key] = child;
    }

    // console.log('reinitializeMetrics', topOf.length)

    // if (params.state.lastScrolled !== -1) {
    //   var lastScrolledKey = params.props.children[params.state.lastScrolled].key;
    //   params.stateChanges.lastScrolled = keyToIndex[lastScrolledKey] || -1;
    // }

    params.stateChanges.heightOf = heightOf;
    params.stateChanges.topOf    = topOf;
    params.stateChanges.bottomOf = bottomOf;
    params.stateChanges.keyToIndex = keyToIndex;

    // params.props = params.nextProps;
    return params;
  },

  // getMetrics: function(params) {
  //   var firstChanged = this.indexOfChangedHeight(params);

  //   if (firstChanged === -1) {
  //     return params;
  //   }

  //   var refs = this.refs;
  //   var children = params.props.children;
  //   var len = children.length;
  //   var defaultHeight = params.props.defaultHeight;
  //   var lastVisible = params.state.lastVisible;
  //   var prevHeightOf = params.state.heightOf;
  //   var runningTotal = 0;
  //   var heightOf = new Uint32Array(len);
  //   var topOf    = new Uint32Array(len);
  //   var bottomOf = new Uint32Array(len);

  //   // Top of the list to somewhere in the viewport - copy the previous attributes
  //   Utils.copyRange(heightOf, params.state.heightOf, 0, firstChanged);
  //   Utils.copyRange(topOf,    params.state.topOf,    0, firstChanged);
  //   Utils.copyRange(bottomOf, params.state.bottomOf, 0, firstChanged);

  //   if (firstChanged > 1) {
  //     runningTotal = bottomOf[firstChanged - 1];
  //   }

  //   // Within the viewport - grab the attributes from the DOM
  //   for (var visibleChild = firstChanged; visibleChild < lastVisible + 1; visibleChild++) {
  //     var key = children[visibleChild].key;
  //     heightOf[visibleChild] = refs[key].getDOMNode().offsetHeight;
  //     topOf[visibleChild]    = runningTotal;
  //     bottomOf[visibleChild] = topOf[visibleChild] + heightOf[visibleChild];
  //     runningTotal           = bottomOf[visibleChild];
  //   }

  //   // Below the viewport - copy attributes and calculate cascading changes
  //   for (var child = lastVisible + 1; child < len; child++) {
  //     heightOf[child] = prevHeightOf[child] || defaultHeight;
  //     topOf[child]    = runningTotal;
  //     bottomOf[child] = topOf[child] + heightOf[child];
  //     runningTotal    = bottomOf[child];
  //   }

  //   // console.log('getMetrics', topOf.length)

  //   params.stateChanges.heightOf = heightOf;
  //   params.stateChanges.topOf    = topOf;
  //   params.stateChanges.bottomOf = bottomOf;
  //   return params;
  // },

  indexOfChangedHeight: function(params) {
    var children = params.props.children;
    var heightOf = params.state.heightOf;
    var refs = this.refs;
    var firstVisible = params.state.firstVisible;
    var lastVisible = params.state.lastVisible;

    for (var child = firstVisible; child <= lastVisible; child++) {
      var key = children[child].key;
      if (!refs[key]) { throw 'node not rendered' }
      var height = refs[key].getDOMNode().offsetHeight;

      if (height !== heightOf[child]) {
        return child;
      }
    }
    return -1;
  },

  totalHeight: function() {
    return this.state.bottomOf[this.props.children.length - 1];
  },

  setStateIfChanged: function(params) {
    for (var prop in params.stateChanges) {
      this.setState(params.stateChanges);
      return;
    }
  }
});

module.exports = List;