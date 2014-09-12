/** @jsx React.DOM */
var React = require('react/addons'),
    FiniteList = require('./finite_list'),
    Chance = require('chance'),
    chance = new Chance();

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

console.log(chance.string());

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
  </div>,
  document.getElementById('main'));

