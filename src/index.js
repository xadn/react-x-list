/** @jsx React.DOM */
var React = require('react'),
    Panel = require('./panel'),
    Chance = require('chance'),
    chance = new Chance();

var items = generateItems(10000);

React.renderComponent(<Panel items={items} />, document.getElementById('main'));

function generateItems(count) {
  var items = [];
  for (var i = 0; i < count; i++) {
    items.push({
      id: i + 1,
      name: chance.sentence(),
      height: 20,
      scrolledAt: -1,
      isScrolling: false,
      isVisible: false
    });
  }
  return items;
}

setInterval(function expireScrolling() {
  // console.time('expireScrolling')
  var itemsLen = items.length|0,
      now = Date.now();

  for (var i = 0; i < itemsLen; i++) {
    if (items[i].isScrolling && items[i].scrolledAt + 3000 < now) {
      items[i].isScrolling = false;
    }
  }
  // console.timeEnd('expireScrolling')
}, 1000);

setTimeout(function() {
  document.querySelector('.is-panel').scrollTop = 100000;
}, 300)