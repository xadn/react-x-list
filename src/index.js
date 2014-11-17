/** @jsx React.DOM */
var React      = require('react/addons');
var FiniteList = require('./list');
var Chance     = require('chance');
var chance     = new Chance();

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
      <div>
        <div>{item.id}</div>
        <div>{item.name}</div>
      </div>
    );
  }
});

console.log(chance.string());

React.render(
  <div>
    <FiniteList>
      {generateItems(1).map(function(item) {
        return <ListItem key={item.id} item={item} />;
      })}
    </FiniteList>
  </div>,
  document.getElementById('main'));

