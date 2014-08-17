/** @jsx React.DOM */
var React = require('react/addons'),
    FiniteList = require('./finite_list'),
    Chance = require('chance'),
    chance = new Chance();

var ListItem = React.createClass({
  shouldComponentUpdate: function() {
    return false;
  },

  render: function() {
    var item = this.props.item;

    return (
      <li onWheel={this.props.onWheel}>
        <div>{item.id}</div>
        <div>{item.name}</div>
      </li>
    );
  }
});

React.renderComponent(
  <div>
    <FiniteList>
      {generateItems(200).map(function(item) {
        return <ListItem key={item.id} item={item} />;
      })}
    </FiniteList>
    <FiniteList>
      {generateItems(5000).map(function(item) {
        return <ListItem key={item.id} item={item} />;
      })}
    </FiniteList>
  </div>, document.getElementById('main'));

function generateItems(count) {
  var items = [];
  for (var i = 0; i < count; i++) {
    items.push({
      id: i + 1,
      name: chance.sentence({words: chance.natural({min: 1, max: 40})}),
      height: 20,
      scrolledAt: -1,
      isScrolling: false,
      isVisible: false
    });
  }
  return items;
}

setTimeout(function() {
  [].forEach.call(document.querySelectorAll('.is-panel'), function(node) {
    node.scrollTop = 100000;
  });
}, 300)