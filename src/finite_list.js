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
      height: 20,
      scrollTop: 0,
      scrollHeight: 0,
      isScrollingUp: true,
      lastScrolledKey: NaN,
      childrenMetadata: {}
    };
  },

  render: function() {
    // var t1 = performance.now();
    // console.time('render');

    var height = this.state.height;
    // var padding = Math.ceil(height / 2);
    var padding = 0;
    var scrollTop = this.state.scrollTop;
    var viewportStart = Math.max(scrollTop - padding, 0);
    var viewportEnd = Math.min(scrollTop + height + padding, this.state.scrollHeight);
    var childrenMetadata = this.state.childrenMetadata;
    var defaultHeight = this.props.defaultHeight;
    var lastScrolledKey = this.state.lastScrolledKey;
    var children = this.props.children;
    var calcScrollHeight = this.state.calcScrollHeight;

    var newListMax = (Math.ceil((viewportEnd - viewportStart) / defaultHeight) + 3);
    this.listMax = Math.min(Math.max(newListMax, this.listMax), children.length)|0;


    var topMetadata = _.find(childrenMetadata, function(childMetadata) {
      return childMetadata.top <= viewportStart && childMetadata.bottom > viewportStart;
    });

    var bottomMetadata = _.find(childrenMetadata, function(childMetadata) {
      return childMetadata.bottom >= viewportEnd && childMetadata.top < viewportEnd;
    }) || childrenMetadata[children[this.listMax - 1].props.key];


    // if (topMetadata && bottomMetadata) {

    // } else {}

    var newBottomIndex = bottomMetadata.index + (this.listMax - (bottomMetadata.index - topMetadata.index));
    newBottomIndex = Math.min(newBottomIndex, children.length - 1);
    bottomMetadata = childrenMetadata[children[newBottomIndex].props.key];


    // var visibleChildren = children.slice(topMetadata.index, bottomMetadata.index + 1);
    var visibleChildren = children.slice(topMetadata.index, newBottomIndex + 1);
    for (var i = 0; i < visibleChildren.length; i++) {
      var key = visibleChildren[i].props.key;
      visibleChildren[i] = cloneWithProps(visibleChildren[i], {key: key, ref: key, onWheel: this.setLastScrolledKey(key)});
    }

    var lastScrolledPosition = 'inside';
    var lastScrolledMetadata = lastScrolledKey && childrenMetadata[lastScrolledKey];
    var lastScrolledChild;

    if (lastScrolledMetadata) {
      var child = children[lastScrolledMetadata.index];
      var key = child.props.key;
      lastScrolledChild = cloneWithProps(child, {key: key, ref: key, onWheel: this.setLastScrolledKey(key)});

      if (lastScrolledMetadata.index < topMetadata.index) {
        lastScrolledPosition = 'above';
      }
      else if (lastScrolledMetadata.index > bottomMetadata.index) {
        lastScrolledPosition = 'below';
      }
    }



    var list;
    switch (lastScrolledPosition) {
      case 'inside':
        list = [].concat(
          <li key='-1' style={{height: (topMetadata.top) + 'px'}} />,
          <li key='-2' style={{height: '0'}} />,
          visibleChildren,
          <li key='-3' style={{height: '0'}} />,
          <li key='-4' style={{height: (calcScrollHeight - bottomMetadata.bottom) + 'px'}} />
        );
        break;
      case 'above':
        list = [].concat(
          <li key='-1' style={{height: (lastScrolledMetadata.top) + 'px'}} />,
          lastScrolledChild,
          <li key='-2' style={{height: topMetadata.top - lastScrolledMetadata.bottom}} />,
          visibleChildren,
          <li key='-3' style={{height: '0'}} />,
          <li key='-4' style={{height: (calcScrollHeight - bottomMetadata.bottom) + 'px'}} />
        );
        break;
      case 'below':
        list = [].concat(
          <li key='-1' style={{height: (topMetadata.top) + 'px'}} />,
          <li key='-2' style={{height: '0'}} />,
          visibleChildren,
          <li key='-3' style={{height: (lastScrolledMetadata.top - bottomMetadata.bottom)}} />,
          lastScrolledChild,
          <li key='-4' style={{height: (calcScrollHeight - lastScrolledMetadata.bottom) + 'px'}} />
        );
        break;
    }



    // var topHeight = topMetadata.top;
    // list.unshift(<li key='-1' style={{height: topHeight + 'px'}} />);

    // var bottomHeight = this.state.calcScrollHeight - bottomMetadata.bottom;
    // list.push(<li key='-2' style={{height: bottomHeight + 'px'}} />);



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

    // var t2 = performance.now();
    // if (this.perfs.length === 20) {
    //   var perf = (this.perfs.reduce(sumFn) / this.perfs.length) / 1000;
    //   this.perfs = [];
    //   console.log({time: perf, nodes: this.lastListCount});
    // } else {
    //   this.perfs.push(t2);
    // }
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
          key: key,
          height: defaultHeight
        };
      }

      childMetadata.top = prevBottom;

      if (refs[key]) {
        childMetadata.height = refs[key].getDOMNode().offsetHeight;
      }

      childMetadata.bottom = childMetadata.top + childMetadata.height;
      childMetadata.index = i;
      prevBottom = childMetadata.bottom;

      newChildrenMetadata[key] = childMetadata;
    }

    this.setState({
      childrenMetadata: newChildrenMetadata,
      height: this.isMounted() && this.getDOMNode().offsetHeight,
      calcScrollHeight: prevBottom
    });

    // console.timeEnd('updateHeights');
  },

  componentWillMount: function() {
    this.lastRenderedKeys = [];
    this.listMax = 0;
    this.perfs = [];
    this.lastListCount = 0;
    this.updateHeights();
  },

  componentDidMount: function() {
    this.updateHeights();
    this.handleScroll();
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

