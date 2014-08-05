/** @jsx React.DOM */
var _ = require('underscore');
var React = require('react');
var FiniteListItemWrapper = require('./finite_list_item_wrapper');
var PlaceholderItem = require('./placeholder_item');
var cloneWithProps = React.addons.cloneWithProps;

var FiniteList = React.createClass({
  getDefaultProps: function() {
    return {defaultHeight: 20};
  },

  getInitialState: function() {
    return {
      height: 0,
      scrollTop: 0,
      scrollHeight: 0,
      isScrollingUp: true,
      listHeights: {},
      lastScrolledKey: NaN
    };
  },

  render: function() {
    console.time('render');

    var height = this.state.height;
    var padding = height;
    var scrollTop = this.state.scrollTop;
    var viewportStart = scrollTop - padding;
    var viewportEnd = scrollTop + height + padding;
    var listHeights = this.state.listHeights;
    var children = this.props.children;
    var defaultHeight = this.props.defaultHeight;
    var lastScrolledKey = this.state.lastScrolledKey;

    var runningHeight = 0;
    var placeholder = {height: 0, key: void 0};
    var list = [];

    for (var i = 0; i < children.length; i++) {
      var key = children[i].props.key;
      var top = runningHeight;
      var height = listHeights[key] || defaultHeight;
      var bottom = top + height;

      if (key === lastScrolledKey || bottom >= viewportStart && top <= viewportEnd) {
        if (placeholder.height > 0) {
          list.push(<li style={{height: placeholder.height + 'px'}} />)
          placeholder.key = void 0;
          placeholder.height = 0;
        }
        list.push(cloneWithProps(children[i], {key: key, ref: key, onWheel: this.setLastScrolledKey(key)}));
      } else {
        if (!placeholder.key) {
          placeholder.key = key;
        }
        placeholder.height += height;
      }

      runningHeight += height;
    }

    if (placeholder.height !== 0) {
      list.push(<li key={placeholder.key} style={{height: placeholder.height + 'px'}} />)
      placeholder.height = 0;
    }

    var elements = (
      <div className='is-panel' onScroll={this.handleScroll}>
        <ol className='is-content'>
          {list}
        </ol>
      </div>
    );

    console.timeEnd('render');
    return elements;
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  },

  setLastScrolledKey: function(key) {
    var self = this;
    return function() {
      self.setState({lastScrolledKey: key});
    }
  },

  updateHeights: function() {
    console.time('updateHeights');

    var keys = this.keys();
    var newListHeights = {};
    var oldListHeights = this.state.listHeights;
    var refs = this.refs;
    var defaultHeight = this.props.defaultHeight;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (oldListHeights[key]) {
        newListHeights[key] = oldListHeights[key];
      } else {
        newListHeights[key] = 20;
      }

      if (refs[key]) {
        newListHeights[key] = refs[key].getDOMNode().offsetHeight;
      }
    }

    this.setState({
      listHeights: newListHeights,
      height: this.getDOMNode().offsetHeight
    });

    console.timeEnd('updateHeights');
  },

  keys: function() {
    // console.time('keys')

    var children = this.props.children;
    var keys = [];
    keys.length = children.length;

    for(var i = 0; i < children.length; i++) {
      keys[i] = children[i].props.key;
    }

    // console.timeEnd('keys')
    return keys;
  },

  componentDidMount: function() {
    this.updateHeights();
  },

  componentDidUpdate: function() {
    if (this.state.isScrollingUp) {
      var node = this.getDOMNode();
      var oldScrollTop = node.scrollTop;
      var oldScrollHeight = node.scrollHeight;
      var newScrollTop = this.state.scrollTop + (oldScrollHeight - this.state.scrollHeight);

      if (oldScrollTop !== newScrollTop) {
        node.scrollTop = newScrollTop;
      }
    }

    this.updateHeights();
  },

  handleScroll: function(e) {
    var node = this.getDOMNode();
    var scrollTop = node.scrollTop;
    var scrollHeight = node.scrollHeight;
    var isScrollingUp = true;

    if (scrollTop > this.state.scrollTop) {
      isScrollingUp = false;
    }

    this.setState({
      isScrollingUp: isScrollingUp,
      scrollTop: scrollTop,
      scrollHeight: scrollHeight
    });
  }
});

module.exports = FiniteList;

