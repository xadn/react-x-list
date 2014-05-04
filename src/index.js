/** @jsx React.DOM */
var React = require('react'),
    Panel = require('./panel'),
    Chance = require('chance'),
    chance = new Chance();

var items = generateItems(100);

React.renderComponent(<Panel items={items} />, document.getElementById('main'));

function generateItems(count) {
  var items = [];
  for (var i = 0; i < count; i++) {
    items.push({
      id: i + 1,
      name: chance.sentence(),
      height: 20
    });
  }
  return items;
}