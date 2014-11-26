var XList     = require('../src/x_list');
var jquery    = require('jquery');
var React     = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('XList', function() {
  var $node,
      Item;

  beforeEach(function() {
    var node = document.createElement('div');
    document.body.appendChild(node);
    $node = jquery(node);

    Item = React.createClass({
      render: function() {
        return React.createElement('div', {className: 'item'}, 'Dummy Item');
      }
    });
  });

  afterEach(function() {
    React.unmountComponentAtNode($node.get(0));
  });

  describe('0 items', function() {
    beforeEach(function() {
      React.render(
        React.createElement(XList)
      , $node.get(0));
    });

    it('creates an unordered list', function() {
      expect($('ul').length).toEqual(1);
    });
  });

  xdescribe('1 item', function() {
    beforeEach(function() {
      React.render(
        React.createElement(XList, null,
          React.createElement(Item, {key: 1})
        )
      , $node.get(0));
    });

    it('creates an unordered list', function() {
      expect($('ul').length).toEqual(1);
    });

    it('has the item', function() {
      expect($('ul .item').length).toEqual(1);
    });
  });

  describe('2+ items', function() {
    beforeEach(function() {
      React.render(
        React.createElement(XList, null,
          React.createElement(Item, {key: 1}),
          React.createElement(Item, {key: 2})
        )
      , $node.get(0));
    });

    it('creates an unordered list', function() {
      expect($('ul').length).toEqual(1);
    });

    it('has the items', function() {
      expect($('ul .item').length).toEqual(2);
    });
  });

  function $(selector) {
    return $node.find(selector);
  }
});
// describe('#model', function () {
//   var model;

//   beforeEach(function() {
//     model = new List(10, 10);
//   });

//   it('calculates the totalHeight', function () {
//     expect(model.totalHeight()).toEqual(100);
//   });

//   describe("#indexOfViewportTop", function() {
//     it("finds the first index when the viewport is at the top", function() {
//       expect(model.indexOfViewportTop(0)).toEqual(0);
//     });

//     it("finds the first index when the viewport is near the top", function() {
//       expect(model.indexOfViewportTop(1)).toEqual(0);
//     });

//     it("finds the second to last index when the viewport is at the bottom", function() {
//       expect(model.indexOfViewportTop(100)).toEqual(8);
//     });

//     it("finds the second to last index when the viewport is near the bottom", function() {
//       expect(model.indexOfViewportTop(99)).toEqual(8);
//     });

//     it("finds the middle index when the viewport is at the middle", function() {
//       expect(model.indexOfViewportTop(50)).toEqual(5);
//     });
//   });

//   describe("#indexOfViewportBottom", function() {
//     it("finds the second to first index when the viewport is at the top", function() {
//       expect(model.indexOfViewportBottom(0, 0)).toEqual(1);
//     });

//     it("finds the last index when the viewport is at the bottom", function() {
//       expect(model.indexOfViewportBottom(100, 0)).toEqual(9);
//     });

//     it("finds the middle index when the viewport is at the middle", function() {
//       expect(model.indexOfViewportBottom(50, 0)).toEqual(4);
//     });
//   });
// });