/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react/addons');

var cloneWithProps = React.addons.cloneWithProps;

var SCROLL_DIR_UP = 'up';
var SCROLL_DIR_DOWN = 'down';

function childMetadataAtViewportStart(children, metadata, viewportStart) {
  var leftIndex = 0;
  var rightIndex = children.length - 1;
  var middleIndex = 0;

  while(rightIndex - leftIndex > 1) {
    var middleIndex = Math.floor(((rightIndex - leftIndex) / 2) + leftIndex);
    var child = children[middleIndex];
    var childMetadata = metadata[child.props.key];

    if (childMetadata.top <= viewportStart) {
      leftIndex = middleIndex;
    } else {
      rightIndex = middleIndex;
    }
  }

  return metadata[children[leftIndex].props.key];
}

function childMetadataAtViewportEnd(children, metadata, viewportEnd, leftIndex) {
  var rightIndex = children.length - 1;
  var middleIndex = 0;

  while(rightIndex - leftIndex > 1) {
    var middleIndex = Math.floor(((rightIndex - leftIndex) / 2) + leftIndex);
    var child = children[middleIndex];
    var childMetadata = metadata[child.props.key];

    if (childMetadata.bottom < viewportEnd) {
      leftIndex = middleIndex;
    } else {
      rightIndex = middleIndex;
    }
  }

  return metadata[children[rightIndex].props.key];
}

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
      treadBottomIndex: 20
    };
  },

  componentWillMount: function componentWillMount() {
    this.other = {};
    this.other.childrenMetadata = {};
    this.other.isScrollingUp = true;
    this.other.scrollHeight = 0;
    this.other.scrollTop = 0;

    this.lastRenderedKeys = [];
    this.listMax = 0;
    this.perfs = [];
    this.lastListCount = 0;
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
    return this.state.topKey !== nextState.topKey || this.state.bottomKey !== nextState.bottomKey;
  },

  render: function render() {
    // console.time('render');

    var height = this.state.height;
    var padding = this.props.padding;

    var scrollTop = this.other.scrollTop;
    var viewportStart = Math.max(scrollTop - padding, 0);
    var viewportEnd = Math.min(scrollTop + height + padding, this.other.scrollHeight);
    var childrenMetadata = this.other.childrenMetadata;
    var defaultHeight = this.props.defaultHeight;
    var lastScrolledKey = this.state.lastScrolledKey;
    var children = this.props.children;
    var calcScrollHeight = this.state.calcScrollHeight;

    var newListMax = (Math.ceil((viewportEnd - viewportStart) / defaultHeight) + 3);
    this.listMax = Math.min(Math.max(newListMax, this.listMax), children.length)|0;

    var topMetadata;
    if (this.state.topKey) {
      topMetadata = childrenMetadata[this.state.topKey];
    } else {
      topMetadata = childMetadataAtViewportStart(children, childrenMetadata, viewportStart);
    }

    var bottomMetadata;
    if (this.state.bottomKey) {
      bottomMetadata = childrenMetadata[this.state.bottomKey];
    } else {
      bottomMetadata = childMetadataAtViewportEnd(children, childrenMetadata, viewportEnd, topMetadata.index)
    }

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

  setLastScrolledKey: function setLastScrolledKey(key) {
    var self = this;
    return function() {
      self.setState({lastScrolledKey: key});
    }
  },

  handleScroll: function handleScroll(e) {
    // console.time('handleScroll')
    var node = this.getDOMNode();
    var scrollTop = node.scrollTop;
    var scrollHeight = node.scrollHeight;
    var isScrollingUp = true;

    if (scrollTop > this.other.scrollTop) {
      isScrollingUp = false;
    }

    var height = this.state.height;
    var padding = this.props.padding;
    var viewportStart = Math.max(scrollTop - padding, 0);
    var viewportEnd = Math.min(scrollTop + height + padding, this.other.scrollHeight);
    var childrenMetadata = this.other.childrenMetadata;
    var children = this.props.children;

    var topMetadata = childMetadataAtViewportStart(children, childrenMetadata, viewportStart);
    var bottomMetadata = childMetadataAtViewportEnd(children, childrenMetadata, viewportEnd, topMetadata.index);

    this.other.isScrollingUp = isScrollingUp;
    this.other.scrollHeight = scrollHeight;
    this.other.scrollTop = scrollTop;

    if (this.state.topKey !== topMetadata.key || this.state.bottomKey !== bottomMetadata.key) {
      this.setState({
        topKey: topMetadata.key,
        bottomKey: bottomMetadata.key
      })
    }
    // console.timeEnd('handleScroll')
  },

  updateHeights: function updateHeights() {
    // console.time('updateHeights');

    var newChildrenMetadata = {};
    var childrenMetadata = this.other.childrenMetadata;
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

    this.other.childrenMetadata = newChildrenMetadata;

    this.setState({
      calcScrollHeight: prevBottom
    });

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