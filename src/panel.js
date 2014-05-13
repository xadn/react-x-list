/** @jsx React.DOM */
var _ = require('underscore'),
    React = require('react'),
    PanelItem = require('./panel_item'),
    PlaceholderItem = require('./placeholder_item');

var Panel = React.createClass({
  getInitialState: function() {
    return {
      height: 0,
      width: 0,
      scrollTop: 0,
      scrollHeight: 0,
      isScrollingUp: true
    };
  },

  render: function() {
    var height = this.state.height,
        padding = height,
        scrollTop = this.state.scrollTop,
        viewportStart = scrollTop - padding,
        viewportEnd = scrollTop + height + padding,
        cursor = 0,
        items = [],
        propItems = this.props.items,
        propItemsLen = propItems.length|0,
        i = 0,
        item = null,
        placeholder = null,
        checksum = '';

    // console.time('calculate');
    for (; i < propItemsLen; i++) {
      item = propItems[i];

      if (item.isScrolling || cursor + item.height >= viewportStart && cursor <= viewportEnd) {
        checksum += item.id + 'v';
      } else {
        checksum += item.id + 'h';
      }
      cursor += item.height;
    }
    console.timeEnd('calculate');

    i = 0;
    cursor = 0;

    // console.time('render');
    // console.profile('render');
    for (; i < propItemsLen; i++) {
      item = propItems[i];

      if (item.isScrolling || cursor + item.height >= viewportStart && cursor <= viewportEnd) {
        if (placeholder) {
          items.push(<PlaceholderItem key={placeholder.id} height={placeholder.height} />);
          placeholder = null;
        }
        items.push(<PanelItem key={item.id} ref={item.id} item={item} />);
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
    // console.timeEnd('render');
    // console.profileEnd('render');

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

  componentDidMount: function() {
    this.setState({height: this.getDOMNode().offsetHeight});
  },

  componentDidUpdate: function() {
    if (this.state.isScrollingUp) {
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

  handleScroll: function(e) {
    // console.time('handleScroll');
    var node = this.getDOMNode(),
        scrollTop = node.scrollTop,
        scrollHeight = node.scrollHeight,
        isScrollingUp = true;

    if (scrollTop > this.state.scrollTop) {
      isScrollingUp = false;
    }

    this.setState({
      isScrollingUp: isScrollingUp,
      scrollTop: scrollTop,
      scrollHeight: scrollHeight
    });
    // console.timeEnd('handleScroll');
  }
});

module.exports = Panel;

