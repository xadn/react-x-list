/** @jsx React.DOM */
var React = require('react'),
    FiniteList = require('./finite_list'),
    Chance = require('chance'),
    chance = new Chance();

React.renderComponent(
  <div>
    <FiniteList>
      {generateItems(200).map(function(item) {
        return (
          <li key={item.id}>
            <div>{item.id}</div>
            <div>{item.name}</div>
          </li>
        );
      })}
    </FiniteList>
    <FiniteList>
      {generateItems(5000).map(function(item) {
        return (
          <li key={item.id}>
            <div>{item.id}</div>
            <div>{item.name}</div>
          </li>
        );
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