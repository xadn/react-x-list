/** @jsx React.DOM */
var React = require('react'),
    PanelItem = require('./panel_item');

function categorizeItems(items, viewportStart, viewportEnd) {
  var cursor = 0,
      cats = {
        above: [],
        below: [],
        within: []
      };

  items.forEach(function(item) {
    if ((cursor + item.height) < viewportStart) {
      cats.above.push(item);
    } else if (cursor > viewportEnd) {
      cats.below.push(item);
    } else {
      cats.within.push(item);
    }
    cursor += item.height;
  });

  return cats;
}

var Panel = React.createClass({
  getInitialState: function() {
    return {scrollTop: 0};
  },

  handleScroll: function(e) {
    this.setState({scrollTop: this.getDOMNode().scrollTop});
  },

  render: function() {
    var top = this.state.scrollTop + 0,
        bottom = top + 400,
        items = categorizeItems(this.props.items, top, bottom);

    return (
      <div className='is-panel' onScroll={this.handleScroll}>
        <ol className='is-content' >
          {[].concat(
            items.above.map(function(item) {
              return <PanelItem key={item.id} ref={item.id} item={item} visible={false} />
            }),
            items.within.map(function(item) {
              return <PanelItem key={item.id} ref={item.id} item={item} visible={true} />
            }),
            items.below.map(function(item) {
              return <PanelItem key={item.id} ref={item.id} item={item} visible={false} />
            })
          )}
        </ol>
      </div>
    );
  }
});

module.exports = Panel;

