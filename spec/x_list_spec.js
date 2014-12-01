var XList = require('../src/x_list');
var React = require('react/addons');
var simulateScroll = React.addons.TestUtils.Simulate.scroll;
var simulateWheel  = React.addons.TestUtils.Simulate.wheel;

describe('XList', function() {
  var node;

  beforeEach(function() {
    node = document.createElement('div');
    document.body.appendChild(node);
  });

  afterEach(function() {
    React.unmountComponentAtNode(node);
    document.body.removeChild(node);
  });

  describe('child arguments', function() {
    describe('[]', function() {
      beforeEach(function() {
        renderXList([]);
      });

      itRendersAList();
      itRendersItems();
    });

    describe('[child]', function() {
      beforeEach(function() {
        renderXList([i(1)]);
      });

      itRendersAList();
      itRendersItems(1);
    });

    describe('[child, child]', function() {
      beforeEach(function() {
        renderXList([i(1), i(2)]);
      });

      itRendersAList();
      itRendersItems(1, 2);
    });

    describe('no args', function() {
      beforeEach(function() {
        renderXList();
      });

      itRendersAList();
      itRendersItems();
    });

    describe('child', function() {
      beforeEach(function() {
        renderXList(i(1));
      });

      itRendersAList();
      itRendersItems(1);
    });

    describe('child, child', function() {
      beforeEach(function() {
        renderXList(i(1), i(2));
      });

      itRendersAList();
      itRendersItems(1, 2);
    });
  });

  describe('a large list', function() {
    beforeEach(function() {
      renderXList(i(1), i(2), i(3), i(4), i(5), i(6), i(7), i(8), i(9), i(10), i(11), i(12));
    });

    itRendersAList();

    it('is the full height', function() {
      expect($$('ul').offsetHeight).toEqual(240);
    });

    describe('scrolled to the top', function() {
      beforeEach(function() {
        expect(outerList().scrollTop).toEqual(0);
      });

      itRendersItems(1, 2, 3, 4, 5, 6);
    });

    describe('scrolled to the bottom', function() {
      beforeEach(function() {
        outerList().scrollTop = Number.MAX_SAFE_INTEGER
        simulateScroll(outerList())
      });

      itRendersItems(8, 9, 10, 11, 12);
    });
  });

  function itRendersAList() {
    it('renders a list', function() {
      expect($('ul').length).toEqual(1);
    });
  }

  function itRendersItems() {
    var args = Array.prototype.slice.call(arguments);
    it('renders items', function() {
      expect(renderedIndexes()).toEqual(args);
    });
  }

  function i(index) {
    var Item = React.createClass({
      displayName: 'Item',
      render: function() {
        var attrs = {
          'className':  'item',
          'data-index': this.props.index,
          'style':      {height: 20}
        };
        return React.createElement('div', attrs, 'I am an item');
      }
    });

    return React.createElement(Item, {key: index, index: index});
  }

  function renderXList() {
    var args = Array.prototype.slice.call(arguments);
    var xListAttrs = {style: {height: 100}};
    var xListArgs = [XList, xListAttrs].concat(args);
    React.render(React.createElement.apply(React, xListArgs), node);
  }

  function renderedIndexes() {
    return Array.prototype.map.call($('ul .item'), function(el) {
      return Number(el.dataset.index);
    });
  }

  function $(selector) {
    return node.querySelectorAll(selector);
  }

  function $$(selector) {
    expect(node.querySelectorAll(selector).length).toEqual(1);
    return node.querySelector(selector);
  }

  function innerList() {
    return $$('.is-list');
  }

  function outerList() {
    return $$('.is-list-container');
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