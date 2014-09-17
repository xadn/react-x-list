/** @jsx React.DOM */
var _ = require('lodash');
var React = require('react/addons');
var cloneWithProps = React.addons.cloneWithProps;
var List = require('./finite_list_model');

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
    this.model = new List(this.props.defaultHeight, this.props.children.length);

    this.other = {};
    this.other.isScrollingUp = true;
    this.other.scrollHeight = 0;
    this.other.scrollTop = 0;
    this.lastRenderedKeys = [];
    this.updateHeights();
  },

  componentDidMount: function componentDidMount() {
    this.updateHeights();
    this.handleScroll();
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
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return this.state.topIndex !== nextState.topIndex || this.state.bottomIndex !== nextState.bottomIndex;
  },

  render: function render() {
    // console.time('render');
    var list;

    if (this.state.lastScrolledIndex && this.state.lastScrolledIndex < this.state.topIndex) {
      list = this.renderListWithScrolledChildAbove();
    }
    else if (this.state.lastScrolledIndex && this.state.lastScrolledIndex > this.state.bottomIndex) {
      list = this.renderListWithScrolledChildBelow();
    } else {
      list = this.renderListWithoutScrolledChild();
    }

    var elements = (
      <div className='is-panel' onScroll={this.handleScroll}>
        <ol className='is-content'>
          {list}
        </ol>
      </div>
    );

    // console.timeEnd('render');
    return elements;
  },

  renderListWithoutScrolledChild: function(visibleChildren) {
    return Array.prototype.concat(
      <li key='-1' style={{height: this.model.top[this.state.topIndex] + 'px'}} />,
      <li key='-2' style={{height: '0'}} />,
      this.childrenInViewport(),
      <li key='-3' style={{height: '0'}} />,
      <li key='-4' style={{height: (this.model.totalHeight() - this.model.bottom[this.state.bottomIndex]) + 'px'}} />
    );
  },

  renderListWithScrolledChildAbove: function(visibleChildren) {
    var child = this.props.children[this.state.lastScrolledIndex];
    var key = child.props.key;

    return Array.prototype.concat(
      <li key='-1' style={{height: this.model.top[this.state.indexOf] + 'px'}} />,
      cloneWithProps(child, {key: key, ref: key, onWheel: this.setLastScrolledKey(key)}),
      <li key='-2' style={{height: (this.model.top[this.state.topIndex] - this.model.bottom[this.state.lastScrolledIndex]) + 'px'}} />,
      this.childrenInViewport(),
      <li key='-3' style={{height: '0'}} />,
      <li key='-4' style={{height: (this.model.totalHeight() - this.model.bottom[this.state.bottomIndex]) + 'px'}} />
    );
  },

  renderListWithScrolledChildBelow: function(visibleChildren) {
    var child = this.props.children[this.state.lastScrolledIndex];
    var key = child.props.key;

    return Array.prototype.concat(
      <li key='-1' style={{height: this.model.top[this.state.topIndex] + 'px'}} />,
      <li key='-2' style={{height: '0'}} />,
      this.childrenInViewport(),
      <li key='-3' style={{height: (this.model.top[this.state.lastScrolledIndex] - this.model.bottom[this.state.bottomIndex])}} />,
      cloneWithProps(child, {key: key, ref: key, onWheel: this.setLastScrolledKey(key)}),
      <li key='-4' style={{height: (this.model.totalHeight() - this.model.bottom[this.state.lastScrolledIndex]) + 'px'}} />
    );
  },

  childrenInViewport: function() {
    var children = this.props.children.slice(this.state.topIndex, this.state.bottomIndex + 1);

    for (var i = 0; i < children.length; i++) {
      var key = children[i].props.key;
      children[i] = cloneWithProps(children[i], {key: key, ref: key, onWheel: this.setLastScrolledKey(key)});
    }

    return children;
  },

  setLastScrolledKey: function setLastScrolledKey(key) {
    var self = this;
    return function() {
      // console.time('setLastScrolledKey')
      if (key !== self.state.lastScrolledKey) {
        self.setState({
          lastScrolledKey: key,
          lastScrolledIndex: self.indexOfKey(key)
        });
      }
      // console.timeEnd('setLastScrolledKey')
    }
  },

  indexOfKey: function(key) {
    var children = this.props.children;

    for (var i = 0; i < children.length; i++) {
      if (children[i].props.key === key) { return i; }
    }

    return -1;
  },

  handleScroll: function handleScroll(e) {
    // console.time('handleScroll')
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
    var bottomIndex = this.model.indexOfViewportBottom(scrollTop + offsetHeight, topIndex);

    if (this.state.topIndex !== topIndex || this.state.bottomIndex !== bottomIndex) {
      this.setState({
        topIndex: topIndex,
        bottomIndex: bottomIndex
      });
    }

    // console.timeEnd('handleScroll')
  },

  updateHeights: function updateHeights() {
    // console.time('updateHeights');
    var children = this.props.children;
    var refs = this.refs;

    for(var j = 0; j < children.length; j++) {
      var key = children[j].props.key;

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