/** @jsx React.DOM */
var _ = require('lodash');
var React = require('react/addons');
var reactCloneWithProps = React.addons.cloneWithProps;
var Model = require('./model');
var ItemWrapper = require('./item_wrapper');

var List = React.createClass({
  getDefaultProps: function() {
    return {defaultHeight: 20};
  },

  getInitialState: function() {
    return {
      isScrollingUp: true,
      lastScrolledKey: NaN,
      firstVisible: 0,
      lastVisible: 1
    };
  },

  componentWillMount: function() {
    this.model = new Model(this.props.defaultHeight, this.props.children.length);
    this.other = {};
    this.other.scrollHeight = 0;
    this.other.scrollTop = 0;

    this.setState(this.saveHeights({}));
  },

  componentDidMount: function() {
    this.setState(this.calculateVisible(this.saveHeights({})));
  },

  componentWillUpdate: function() {
    var node = this.getDOMNode();
    this.other.scrollHeight = node.scrollHeight;
    this.other.scrollTop = node.scrollTop;
  },

  componentDidUpdate: function() {
    this.fixScrollPosition();
    this.setState(this.calculateVisible(this.saveHeights({})));
  },

  handleWheel: function(key) {
    var self = this;
    return function(e) {
      self.setState({lastScrolledKey: key, isScrollingUp: e.deltaY < 0});
    }
  },

  handleScroll: function() {
    this.setState(this.calculateVisible({}));
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return  this.state.firstVisible !== nextState.firstVisible ||
            this.state.lastVisible !== nextState.lastVisible ||
            this.state.calcScrollHeight !== nextState.calcScrollHeight ||
            // this.state.isScrollingUp !== nextState.isScrollingUp ||
            // this.state.lastScrolledKey !== nextState.lastScrolledKey ||
            // (nextState.isScrollingUp && this.state.calcScrollHeight !== nextState.calcScrollHeight);
            false;
  },

  render: function() {
    var firstVisible = this.state.firstVisible;
    var lastVisible = this.state.lastVisible;
    var lastScrolled = this.indexOfKey(this.state.lastScrolledKey);
    var child = firstVisible;
    var index = 0;
    var length = lastVisible - firstVisible + 2;
    var visibleChildren = [];
    visibleChildren.length = length;

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
        <ul className='is-list' style={{height: this.model.totalHeight()}}>
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
        onWheel={this.handleWheel(key)}
        offsetTop={this.model.top[index]}
        visible={this.model.height[index] !== this.props.defaultHeight}>
        {child}
      </ItemWrapper>
    );
  },

  calculateVisible: function(newState) {
    var node = this.getDOMNode();
    var scrollTop = node.scrollTop;
    var scrollHeight = node.scrollHeight;
    var offsetHeight = node.offsetHeight;

    this.other.scrollHeight = scrollHeight;
    this.other.scrollTop = scrollTop;

    newState.firstVisible = this.model.indexOfViewportTop(scrollTop);
    newState.lastVisible = this.model.indexOfViewportBottom(scrollTop + offsetHeight, newState.firstVisible)
    return newState;
  },

  saveHeights: function(newState) {
    var children = this.props.children;
    var refs = this.refs;

    for (var j = 0; j < children.length; j++) {
      var key = children[j].key;

      if (refs[key]) {
        this.model.updateHeight(j, refs[key].getDOMNode().offsetHeight);
      }
    }

    this.model.commit();
    newState.calcScrollHeight = this.model.totalHeight();
    return newState;
  },

  fixScrollPosition: function() {
    if (this.state.isScrollingUp) {
      var node = this.getDOMNode();
      var newScrollTop = this.other.scrollTop + (node.scrollHeight - this.other.scrollHeight);

      if (node.scrollTop !== newScrollTop) {
        node.scrollTop = newScrollTop;
      }
    }
  },

  indexOfKey: function(key) {
    var children = this.props.children,
        len = children.length;

    for (var i = 0; i < len; i++) {
      if (children[i].key === key) { return i; }
    }
    return -1;
  }
});

module.exports = List;