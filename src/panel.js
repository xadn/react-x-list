/** @jsx React.DOM */
var _ = require('underscore'),
    React = require('react'),
    PanelItem = require('./panel_item'),
    PlaceholderItem = require('./placeholder_item');

var Panel = React.createClass({
  getInitialState: function() {
    return {
      totalHeight: 0,
      scrollTop: 0,
      scrollHeight: 0,
      scrollDirection: 'down'
    };
  },

  render: function() {
    var self = this,
        viewportStart = this.state.scrollTop - 300,
        viewportEnd = this.state.scrollTop + 400 + 300,
        cursor = 0,
        items = [],
        propItems = this.props.items,
        propItemsLen = propItems.length|0,
        i = 0,
        item = null,
        placeholder = null;

    // console.time('sortItems');
    for (; i < propItemsLen; i++) {
      item = propItems[i];

      if (item.isScrolling || cursor + item.height >= viewportStart && cursor <= viewportEnd) {
        if (placeholder) {
          items.push(<PlaceholderItem key={placeholder.id} height={placeholder.height} />);
          placeholder = null;
        }
        items.push(<PanelItem key={item.id} ref={item.id} item={item} onItemChange={self.handleItemChange} onHeightChange={self.handleHeightChange} />);
      } else {
        if (!placeholder) {
          placeholder = {id: item.id, height: 0};
        }
        placeholder.height += item.height;
      }
      cursor += item.height;
    }
    if (placeholder) {
      items.push(<PlaceholderItem key={placeholder.id} height={placeholder.height} />);
    }
    // console.timeEnd('sortItems');

    return (
      <div className='is-panel' onScroll={this.handleScroll}>
        <ol className='is-content'>{items}</ol>
        <div className='is-debug-info'>
          <table>
            <tr>
              <td>nodes:</td>
              <td>{items.length}</td>
            </tr>
            <tr>
              <td>items:</td>
              <td>{propItemsLen}</td>
            </tr>
          </table>
        </div>
      </div>
    );
  },

  totalHeight: function() {
    // console.time('totalHeight');
    var ret = 0,
        i = 0,
        propItems = this.props.items,
        propItemsLen = propItems.length|0;

    for (; i < propItemsLen; i++) {
      ret += propItems[i].height;
    }
    // console.timeEnd('totalHeight');
    return ret;
  },

  componentDidUpdate: function() {
    if (this.state.scrollDirection === 'up') {
      // console.time('componentDidUpdate');
      var node = this.getDOMNode(),
          oldScrollTop = node.scrollTop,
          oldScrollHeight = node.scrollHeight,
          newScrollTop = this.state.scrollTop + (oldScrollHeight - this.state.scrollHeight);

      if (oldScrollTop !== newScrollTop) {
        node.scrollTop = newScrollTop;
      }
      // console.timeEnd('componentDidUpdate');
    }
  },

  handleItemChange: function() {
    this.setState({totalHeight: this.totalHeight()})
  },

  handleScroll: function(e) {
    // console.time('handleScroll');
    var node = this.getDOMNode(),
        scrollTop = node.scrollTop,
        scrollHeight = node.scrollHeight,
        scrollDirection = 'up';

    if (scrollTop > this.state.scrollTop) {
      scrollDirection = 'down';
    }

    this.setState({
      scrollDirection: scrollDirection,
      scrollTop: scrollTop,
      scrollHeight: scrollHeight
    });
    // console.timeEnd('handleScroll');
  }
});

module.exports = Panel;

