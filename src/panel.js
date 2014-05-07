/** @jsx React.DOM */
var _ = require('underscore'),
    React = require('react'),
    PanelItem = require('./panel_item'),
    PlaceholderItem = require('./placeholder_item');

function isInViewport(itemStart, itemEnd, viewportStart, viewportEnd) {
  return itemEnd >= viewportStart && itemStart <= viewportEnd;
}

var Panel = React.createClass({
  getInitialState: function() {
    return {
      scrollTop: 0,
      totalHeight: 0,
      scrollDirection: 'down'
    };
  },

  render: function() {
    var self = this,
        viewportStart = this.state.scrollTop - 20,
        viewportEnd = this.state.scrollTop + 400 + 20,
        cursor = 0,
        items = [],
        placeholder = null;

    this.props.items.forEach(function(item) {
      if (item.isScrolling || isInViewport(cursor, cursor + item.height, viewportStart, viewportEnd)) {
        if (placeholder) {
          items.push(<PlaceholderItem key={placeholder.id} height={placeholder.height} />);
          placeholder = null;
        }

        items.push(<PanelItem key={item.id} ref={item.id} item={item} onItemChange={self.handleItemChange} onHeightChange={self.handleHeightChange} />);

      } else {
        placeholder = placeholder || {id: item.id, height: 0};
        placeholder.height += item.height;
      }
      cursor += item.height;
    });

    if (placeholder) {
      items.push(<PlaceholderItem key={placeholder.id} height={placeholder.height} />);
    }

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
              <td>{this.props.items.length}</td>
            </tr>
          </table>
        </div>
      </div>
    );
  },

  totalHeight: function() {
    return _.reduce(this.props.item, function(memo, item) {
      return memo + item.height;
    }, 0);
  },

  componentWillUpdate: function() {
    var node = this.getDOMNode();
    this.scrollHeight = node.scrollHeight;
    this.scrollTop = node.scrollTop;
  },

  componentDidUpdate: function() {
    if (this.state.scrollDirection === 'up') {
      var node = this.getDOMNode();
      node.scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
    }
  },

  handleItemChange: function() {
    this.setState({totalHeight: this.totalHeight()})
  },

  handleScroll: function(e) {
    var newScrollTop = this.getDOMNode().scrollTop,
        newScrollDirection = 'up';

    if (newScrollTop > this.state.scrollTop) {
      newScrollDirection = 'down';
    }

    this.setState({
      scrollTop: newScrollTop,
      scrollDirection: newScrollDirection
    });
  }
});

module.exports = Panel;

