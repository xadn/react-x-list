/** @jsx React.DOM */
var _ = require('underscore');
var React = require('react/addons');
var cloneWithProps = React.addons.cloneWithProps;
var DebugInfo = require('./debug_info');

function sumFn(memo, num) { return memo + num };

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
      lastScrolledKey: NaN,
      childrenMetadata: {}
    };
  },

  render: function() {
    var t1 = performance.now();
    // console.time('render');

    var height = this.state.height;
    var padding = height;
    var scrollTop = this.state.scrollTop;
    var viewportStart = scrollTop - padding;
    var viewportEnd = scrollTop + height + padding;
    var childrenMetadata = this.state.childrenMetadata;
    var children = this.props.children;
    var defaultHeight = this.props.defaultHeight;
    var lastScrolledKey = this.state.lastScrolledKey;

    var placeholder = {height: 0, key: void 0};
    var list = [];

    for (var i = 0; i < children.length; i++) {
      var key = children[i].props.key;
      var top = childrenMetadata[key].top;
      var height = childrenMetadata[key].height;
      var bottom = childrenMetadata[key].bottom;

      if (key === lastScrolledKey || top <= viewportEnd && bottom >= viewportStart) {
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
    }

    if (placeholder.height !== 0) {
      list.push(<li key={placeholder.key} style={{height: placeholder.height + 'px'}} />)
      placeholder.height = 0;
    }

    if (list.length !== this.lastListCount) {
      this.lastListCount = list.length;
      // console.log('listCount', this.lastListCount);
    }

    var elements = (
      <div className='is-panel' onScroll={this.handleScroll}>
        <ol className='is-content'>
          {list}
        </ol>
        <DebugInfo itemCount={children.length} nodeCount={this.lastListCount} />
      </div>
    );

    var t2 = performance.now();
    if (this.perfs.length === 20) {
      var perf = (this.perfs.reduce(sumFn) / this.perfs.length) / 1000;
      this.perfs = [];
      console.log({time: perf, nodes: this.lastListCount});
    } else {
      this.perfs.push(t2);
    }
    // console.timeEnd('render');

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
    // console.time('updateHeights');

    var newChildrenMetadata = {};
    var childrenMetadata = this.state.childrenMetadata;
    var children = this.props.children;
    var defaultHeight = this.props.defaultHeight;
    var refs = this.refs;
    var prevBottom = 0;

    for(var i = 0; i < children.length; i++) {
      var childMetadata;
      var key = children[i].props.key;

      if (childrenMetadata[key]) {
        childMetadata = childrenMetadata[key];
      } else {
        childMetadata = {
          height: defaultHeight
        };
      }

      childMetadata.top = prevBottom;

      if (refs[key]) {
        childMetadata.height = refs[key].getDOMNode().offsetHeight;
      }

      childMetadata.bottom = childMetadata.top + childMetadata.height;
      prevBottom = childMetadata.bottom;

      newChildrenMetadata[key] = childMetadata;
    }

    this.setState({
      childrenMetadata: newChildrenMetadata,
      height: this.isMounted() && this.getDOMNode().offsetHeight
    });

    // console.timeEnd('updateHeights');
  },

  componentWillMount: function() {
    this.perfs = [];
    this.lastListCount = 0;
    this.updateHeights();
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

