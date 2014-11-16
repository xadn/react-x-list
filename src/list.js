/** @jsx React.DOM */
var _ = require('lodash');
var React = require('react/addons');
var reactCloneWithProps = React.addons.cloneWithProps;
var ItemWrapper = require('./item_wrapper');
var Utils = require('./utils');

var List = React.createClass({
  getDefaultProps: function() {
    return {defaultHeight: 20};
  },

  getInitialState: function() {
    return {
      isScrollingUp: true,
      lastScrolled: -1,
      firstVisible: 0,
      lastVisible: 1,
      scrollHeight: 0,
      scrollTop: 0,
      topOf: null,
      bottomOf: null,
      heightOf: null
    };
  },

  componentWillMount: function() {
    this.setState(this.initializeHeights({}));
  },

  componentDidMount: function() {
    this.setState(this.calculateVisible(this.saveHeights({})));
  },

  componentWillUpdate: function() {
    var node = this.getDOMNode();
    var scrollHeight = node.scrollHeight;
    var scrollTop = node.scrollTop;

    if (scrollHeight !== this.state.scrollHeight || scrollTop !== this.state.scrollTop) {
      this.setState({scrollHeight: scrollHeight, scrollTop: scrollTop});
    }
  },

  componentDidUpdate: function() {
    this.fixScrollPosition();
    this.setState(this.calculateVisible(this.saveHeights({})));
  },

  handleWheel: function(index) {
    var self = this;
    return function(e) {
      self.setState({lastScrolled: index, isScrollingUp: e.deltaY < 0});
    }
  },

  handleScroll: function() {
    this.setState(this.calculateVisible({}));
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return  this.state.firstVisible !== nextState.firstVisible ||
            this.state.lastVisible !== nextState.lastVisible ||
            this.state.lastScrolled !== nextState.lastScrolled ||
            this.state.heightOf !== nextState.heightOf;
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
      <div className='is-list-container' onScroll={this.handleScroll}>
        <ul className='is-list' style={{height: this.totalHeight()}}>
          {visibleChildren}
        </ul>
      </div>
    );
  },

  wrapChild: function(index) {
    var child = this.props.children[index],
        key = child.key;

    return (
      <ItemWrapper
        key={key}
        ref={key}
        onWheel={this.handleWheel(index)}
        offsetTop={this.state.topOf[index]}
        visible={this.state.heightOf[index] !== this.props.defaultHeight}>
        {child}
      </ItemWrapper>
    );
  },

  calculateVisible: function(nextState) {
    var node = this.getDOMNode();
    var viewportStart = node.scrollTop;
    var viewportEnd = viewportStart + node.offsetHeight;

    nextState.scrollHeight = node.scrollHeight;
    nextState.scrollTop = viewportStart;
    nextState.firstVisible = this.getFirstVisible(viewportStart);
    nextState.lastVisible = this.getLastVisible(viewportEnd, nextState.firstVisible)

    return nextState;
  },

  initializeHeights: function(nextState) {
    var len = this.props.children.length;
    var defaultHeight = this.props.defaultHeight;
    var prevBottom = 0;
    var heightOf = new Uint32Array(len);
    var topOf    = new Uint32Array(len);
    var bottomOf = new Uint32Array(len);

    for (var i = 0; i < len; i++) {
      heightOf[i] = defaultHeight;
      topOf[i]    = prevBottom;
      bottomOf[i] = topOf[i] + heightOf[i];
      prevBottom  = bottomOf[i];
    }

    nextState.heightOf = heightOf;
    nextState.topOf    = topOf;
    nextState.bottomOf = bottomOf;
    return nextState;
  },

  saveHeights: function(nextState) {
    var firstChanged = this.indexOfChangedHeight();

    if (firstChanged === -1) {
      // console.timeEnd('saveHeights')
      return nextState;
    }

    // console.time('saveHeights')

    var refs = this.refs;
    var children = this.props.children;
    var len = children.length;
    var defaultHeight = this.props.defaultHeight;
    var lastVisible = this.state.lastVisible;
    var prevHeightOf = this.state.heightOf;
    var prevBottom = 0;
    var heightOf = new Uint32Array(len);
    var topOf    = new Uint32Array(len);
    var bottomOf = new Uint32Array(len);

    Utils.copyRange(heightOf, this.state.heightOf, 0, firstChanged);
    Utils.copyRange(topOf,    this.state.topOf,    0, firstChanged);
    Utils.copyRange(bottomOf, this.state.bottomOf, 0, firstChanged);

    if (firstChanged > 1) {
      prevBottom = bottomOf[firstChanged - 1];
    }

    for (var visibleChild = firstChanged; visibleChild < lastVisible + 1; visibleChild++) {
      var key = children[visibleChild].key;

      heightOf[visibleChild] = refs[key].getDOMNode().offsetHeight;
      topOf[visibleChild]    = prevBottom;
      bottomOf[visibleChild] = topOf[visibleChild] + heightOf[visibleChild];
      prevBottom             = bottomOf[visibleChild];
    }

    for (var child = lastVisible + 1; child < len; child++) {
      var key = children[child].key;

      heightOf[child] = this.state.heightOf[child] || defaultHeight;
      topOf[child]    = prevBottom;
      bottomOf[child] = topOf[child] + heightOf[child];
      prevBottom      = bottomOf[child];
    }

    nextState.heightOf = heightOf;
    nextState.topOf    = topOf;
    nextState.bottomOf = bottomOf;

    // console.timeEnd('saveHeights')
    return nextState;
  },

  indexOfChangedHeight: function() {
    var children = this.props.children;
    var heightOf = this.state.heightOf;
    var refs = this.refs;
    var firstVisible = this.state.firstVisible;
    var lastVisible = this.state.lastVisible;

    for (var child = firstVisible; child <= lastVisible; child++) {
      var key = children[child].key;
      var height = refs[key].getDOMNode().offsetHeight;

      if (height !== heightOf[child]) {
        return child;
      }
    }
    return -1;
  },

  fixScrollPosition: function() {
    if (this.state.isScrollingUp) {
      var node = this.getDOMNode();
      var newScrollTop = this.state.scrollTop + (node.scrollHeight - this.state.scrollHeight);

      if (node.scrollTop !== newScrollTop) {
        node.scrollTop = newScrollTop;
      }
    }
  },

  totalHeight: function() {
    return this.state.bottomOf[this.props.children.length - 1];
  },

  getFirstVisible: function(viewportTop) {
    var left = 0;
    var right = this.props.children.length - 1;
    var middle = 0;

    while (right - left > 1) {
      middle = Math.floor((right - left) / 2 + left);

      if (this.state.topOf[middle] <= viewportTop) {
        left = middle;
      } else {
        right = middle;
      }
    }

    return left;
  },

  getLastVisible: function(viewportEnd, left) {
    var right = this.props.children.length - 1;
    var middle = 0;

    while (right - left > 1) {
      middle = Math.floor((right - left) / 2 + left);

      if (this.state.bottomOf[middle] < viewportEnd) {
        left = middle;
      } else {
        right = middle;
      }
    }

    return right;
  }
});

module.exports = List;