/** @jsx React.DOM */
var React = require('react'),
    Panel = require('./panel'),
    Chance = require('chance'),
    chance = new Chance();

React.renderComponent(
  <div>
    <Panel items={generateItems(10000)} />
    <Panel items={generateItems(200)} />
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