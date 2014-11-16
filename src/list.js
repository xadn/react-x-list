/** @jsx React.DOM */
var _ = require('lodash');
var React = require('react/addons');
var reactCloneWithProps = React.addons.cloneWithProps;
var Model = require('./model');
var ItemWrapper = require('./item_wrapper');

var FiniteList = React.createClass({
  getDefaultProps: function getDefaultProps() {
    return {
      defaultHeight: 20,
      padding: 0
    };
  },

  getInitialState: function getInitialState() {
    return {
      height: 20,
      isScrollingUp: true,
      lastScrolledKey: NaN,
      treadTopIndex: 0,
      treadBottomIndex: 20,
      topIndex: 0,
      bottomIndex: 1
    };
  },

  componentWillMount: function componentWillMount() {
    this.model = new Model(this.props.defaultHeight, this.props.children.length);
    this.other = {};
    this.other.isScrollingUp = true;
    this.other.scrollHeight = 0;
    this.other.scrollTop = 0;
    this.lastRenderedKeys = [];
    this.updateHeights();
  },

  componentDidMount: function componentDidMount() {
    this.updateHeights();
    this.calculateVisible();
    this.setState({height: this.getDOMNode().offsetHeight});
  },

  componentWillUpdate: function componentWillUpdate() {
    var node = this.getDOMNode();
    this.other.scrollHeight = node.scrollHeight;
    this.other.scrollTop = node.scrollTop;
  },

  componentDidUpdate: function componentDidUpdate() {
    this.fixScrollPosition();
    this.updateHeights();
    this.calculateVisible();
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return this.state.topIndex !== nextState.topIndex || this.state.bottomIndex !== nextState.bottomIndex;
  },

  render: function render() {
    // console.time('render');
    var topOf = this.model.top;
    var bottomOf = this.model.bottom;
    var veryBottom = this.model.totalHeight();
    var firstVisible = this.state.topIndex;
    var lastVisible = this.state.bottomIndex;
    var lastScrolled = this.indexOfKey(this.state.lastScrolledKey);

    if (lastScrolled >= 0 && firstVisible > lastScrolled) {
      return (
        <div className='is-list-container' onScroll={this.handleScroll}>
          <ul className='is-list' style={{height: veryBottom}}>
            {[this.wrapChild(lastScrolled)].concat(this.visibleChildren())}
          </ul>
        </div>
      );
    }
    else if (lastScrolled > lastVisible) {
      return (
        <div className='is-list-container' onScroll={this.handleScroll}>
          <ul className='is-list' style={{height: veryBottom}}>
            {this.visibleChildren().concat(this.wrapChild(lastScrolled))}
          </ul>
        </div>
      );
    }
    else {
      return (
        <div className='is-list-container' onScroll={this.handleScroll}>
          <ul className='is-list' style={{height: veryBottom}}>
            {this.visibleChildren()}
          </ul>
        </div>
      );
    }
  },

  visibleChildren: function visibleChildren() {
    var bottomIndex = this.state.bottomIndex;
    var topIndex = this.state.topIndex;
    var wrappedChildren = [];
    wrappedChildren.length = bottomIndex - topIndex;

    var childrenIndex = topIndex;
    var clonesIndex = 0;

    while (childrenIndex <= bottomIndex) {
      wrappedChildren[clonesIndex] = this.wrapChild(childrenIndex);
      childrenIndex++;
      clonesIndex++;
    }

    return wrappedChildren;
  },

  wrapChild: function wrapChild(index) {
    var child = this.props.children[index],
        key = child.key;

    return (
      <ItemWrapper
        key={key}
        ref={key}
        onWheel={this.setLastScrolledKey(key)}
        offsetTop={this.model.top[index]}
        visible={this.model.height[index] !== this.props.defaultHeight}>
        {child}
      </ItemWrapper>
    );
  },

  setLastScrolledKey: function setLastScrolledKey(key) {
    var self = this;
    return function() {
      // console.time('setLastScrolledKey')
      if (key !== self.state.lastScrolledKey) {
        self.setState({lastScrolledKey: key});
      }
      // console.timeEnd('setLastScrolledKey')
    }
  },

  indexOfKey: function(key) {
    var children = this.props.children,
        len = children.length;

    for (var i = 0; i < len; i++) {
      if (children[i].key === key) { return i; }
    }
    return -1;
  },

  handleScroll: function handleScroll(e) {
    this.calculateVisible();
  },

  startCalculating: function startCalculating() {
    this.calculateVisible();
    requestAnimationFrame(this.startCalculating);
  },

  calculateVisible: function calculateVisible() {
    // console.time('calculateVisible')
    var node = this.getDOMNode();
    var scrollTop = node.scrollTop;
    var scrollHeight = node.scrollHeight;
    var offsetHeight = node.offsetHeight;

    var isScrollingUp = true;
    if (scrollTop > this.other.scrollTop) {
      isScrollingUp = false;
    }

    this.other.isScrollingUp = isScrollingUp;
    this.other.scrollHeight = scrollHeight;
    this.other.scrollTop = scrollTop;

    var topIndex = this.model.indexOfViewportTop(scrollTop);
    var bottomIndex = this.model.indexOfViewportBottom(scrollTop + offsetHeight, topIndex)

    if (this.state.topIndex !== topIndex || this.state.bottomIndex !== bottomIndex) {
      this.setState({
        topIndex: topIndex,
        bottomIndex: bottomIndex
      });
    }
    // console.timeEnd('calculateVisible')
  },

  updateHeights: function updateHeights() {
    // console.time('updateHeights');
    var children = this.props.children;
    var refs = this.refs;

    for(var j = 0; j < children.length; j++) {
      var key = children[j].key;

      if (refs[key]) {
        this.model.updateHeight(j, refs[key].getDOMNode().offsetHeight);
      }
    }

    this.model.commit();
    this.setState({calcScrollHeight: this.model.totalHeight()});
    // console.timeEnd('updateHeights');
  },

  fixScrollPosition: function fixScrollPosition() {
    if (this.other.isScrollingUp) {
      var node = this.getDOMNode();
      var newScrollTop = this.other.scrollTop + (node.scrollHeight - this.other.scrollHeight);

      if (node.scrollTop !== newScrollTop) {
        node.scrollTop = newScrollTop;
      }
    }
  }
});

module.exports = FiniteList;