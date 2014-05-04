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
      totalHeight: 0
    };
  },

  render: function() {
    var self = this,
        viewportStart = this.state.scrollTop + 0,
        viewportEnd = viewportStart + 400,
        cursor = 0,
        items = [],
        placeholder = null;

    this.props.items.forEach(function(item) {
      if (item.isScrolling || isInViewport(cursor, cursor + item.height, viewportStart, viewportEnd)) {
        if (placeholder) {
          items.push(<PlaceholderItem key={placeholder.id} height={placeholder.height} />);
          placeholder = null;
        }

        items.push(<PanelItem key={item.id} ref={item.id} item={item} onItemChange={self.handleItemChange} />);

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
      </div>
    );
  },

  totalHeight: function() {
    return _.reduce(this.props.item, function(memo, item) {
      return memo + item.height;
    }, 0);
  },

  handleItemChange: function() {
    this.setState({totalHeight: this.totalHeight()})
  },

  handleScroll: function(e) {
    this.setState({scrollTop: this.getDOMNode().scrollTop});
  }
});

module.exports = Panel;

