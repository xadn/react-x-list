/** @jsx React.DOM */

goog.provide('ris.FiniteList');
goog.require('_');
goog.require('goog.array');

var cloneWithProps = React.addons.cloneWithProps;

var SCROLL_DIR_UP = 'up';
var SCROLL_DIR_DOWN = 'down';

function childMetadataAtViewportStart(children, metadata, viewportStart) {
  while(children.length > 1) {
    var middleIndex = Math.floor(children.length / 2);
    var child = children[middleIndex];
    var childMetadata = metadata[child.props.key];

    if (childMetadata.top <= viewportStart) {
      // right
      children = children.slice(middleIndex, children.length);
    } else {
      // left
      children = children.slice(0, middleIndex);
    }
  }

  return metadata[children[0].props.key];
}

function childMetadataAtViewportEnd(children, metadata, viewportEnd) {
  while(children.length > 1) {
    var middleIndex = Math.floor(children.length / 2);
    var child = children[middleIndex];
    var childMetadata = metadata[child.props.key];

    if (childMetadata.bottom < viewportEnd) {
      // right
      children = children.slice(middleIndex, children.length);
    } else {
      // left
      children = children.slice(0, middleIndex);
    }
  }

  return metadata[children[0].props.key];
}


ris.FiniteList = React.createClass({displayName: 'FiniteList',
  getDefaultProps: function() {
    return {
      defaultHeight: 20,
      padding: 0
    };
  },

  getInitialState: function() {
    return {
      height: 20,
      scrollTop: 0,
      scrollHeight: 0,
      isScrollingUp: true,
      lastScrolledKey: NaN,
      childrenMetadata: {},

      viewportTop: 0,
      viewportBottom: 20,
      treadTop: 0,
      treadBottom: 20,
      scrollDirection: SCROLL_DIR_UP,
    };
  },

  render: function() {
    // console.time('render');

    var height = this.state.height;
    // var padding = Math.ceil(height / 2);
    var padding = this.props.padding;

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

    // var topMetadata = childMetadataAtViewportStart(children.slice(0), childrenMetadata, viewportStart)
    var topMetadata;
    if (this.state.topKey) {
      topMetadata = childrenMetadata[this.state.topKey];
    } else {
      topMetadata = childMetadataAtViewportStart(children.slice(0), childrenMetadata, viewportStart);
    }

    var bottomMetadata;
    if (this.state.bottomKey) {
      bottomMetadata = childrenMetadata[this.state.bottomKey];
    } else {
      bottomMetadata = childMetadataAtViewportEnd(children.slice(topMetadata.index, children.length), childrenMetadata, viewportEnd)
    }

    // var bottomMetadata = childrenMetadata[this.state.bottomKey];

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
          React.DOM.li({key: "-1", style: {height: (topMetadata.top) + 'px'}}),
          React.DOM.li({key: "-2", style: {height: '0'}}),
          visibleChildren,
          React.DOM.li({key: "-3", style: {height: '0'}}),
          React.DOM.li({key: "-4", style: {height: (calcScrollHeight - bottomMetadata.bottom) + 'px'}})
        );
        break;
      case 'above':
        list = [].concat(
          React.DOM.li({key: "-1", style: {height: (lastScrolledMetadata.top) + 'px'}}),
          lastScrolledChild,
          React.DOM.li({key: "-2", style: {height: topMetadata.top - lastScrolledMetadata.bottom}}),
          visibleChildren,
          React.DOM.li({key: "-3", style: {height: '0'}}),
          React.DOM.li({key: "-4", style: {height: (calcScrollHeight - bottomMetadata.bottom) + 'px'}})
        );
        break;
      case 'below':
        list = [].concat(
          React.DOM.li({key: "-1", style: {height: (topMetadata.top) + 'px'}}),
          React.DOM.li({key: "-2", style: {height: '0'}}),
          visibleChildren,
          React.DOM.li({key: "-3", style: {height: (lastScrolledMetadata.top - bottomMetadata.bottom)}}),
          lastScrolledChild,
          React.DOM.li({key: "-4", style: {height: (calcScrollHeight - lastScrolledMetadata.bottom) + 'px'}})
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
      React.DOM.div({className: "is-panel", onScroll: this.handleScroll}, 
        React.DOM.ol({className: "is-content"}, 
          list
        )
      )
    );


    // console.timeEnd('render');
    return elements;
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // console.time('shouldComponentUpdate');

    var shouldUpdate = false ||
      this.state.topKey !== nextState.topKey ||
      this.state.bottomKey !== nextState.bottomKey;

    if (this.state.topKey && this.state.bottomKey) {
      shouldUpdate = shouldUpdate || !_.isEqual(
        _.pluck(_.pluck(this.props.children.slice(this.state.topKey.index, this.state.bottomKey), 'props'), 'key'),
        _.pluck(_.pluck(nextProps.children.slice(this.state.topKey.index, this.state.bottomKey), 'props'), 'key')
      );
    }

    // console.timeEnd('shouldComponentUpdate');
    return shouldUpdate;
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

    var height = this.state.height;
    var padding = this.props.padding;
    var viewportStart = Math.max(scrollTop - padding, 0);
    var viewportEnd = Math.min(scrollTop + height + padding, this.state.scrollHeight);
    var childrenMetadata = this.state.childrenMetadata;
    var children = this.props.children;

    var topMetadata = childMetadataAtViewportStart(children.slice(0), childrenMetadata, viewportStart)
    var bottomMetadata = childMetadataAtViewportEnd(children.slice(topMetadata.index, children.length), childrenMetadata, viewportEnd)

    this.setState({
      isScrollingUp: isScrollingUp,
      scrollTop: scrollTop,
      scrollHeight: scrollHeight,
      topKey: topMetadata.key,
      bottomKey: bottomMetadata.key
    });
  },
});

goog.exportSymbol('ris.finite_list', ris.finite_list);