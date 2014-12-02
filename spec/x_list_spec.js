var XList         = require('../src/x_list');
var PopulatedList = require('../src/populated_list');
var EmptyList     = require('../src/empty_list');
var React         = require('react/addons');

describe('XList', function() {
  var PopulatedList;
  var EmptyList;

  beforeEach(function() {
    jasmine.addMatchers(require('./custom_matchers'));

    var MockComponent = React.createClass({
      render: function() {
        return React.createElement('div', null);
      }
    });

    PopulatedList = jasmine.createSpy('PopulatedList').and.returnValue(MockComponent);
    EmptyList = jasmine.createSpy('EmptyList').and.returnValue(MockComponent);
  });

  describe('no children', function() {
    it('creates an EmptyList', function() {
      renderXList();
      expect(EmptyList).toHaveBeenCalled();
    });
  });

  // xdescribe('child arguments', function() {
  //   describe('[]', function() {
  //     beforeEach(function() {
  //       renderXList([]);
  //     });

  //     itRendersAList();
  //     itRendersItems();
  //   });

  //   describe('[child]', function() {
  //     beforeEach(function() {
  //       renderXList([i(1)]);
  //     });

  //     itRendersAList();
  //     itRendersItems(1);
  //   });

  //   describe('[child, child]', function() {
  //     beforeEach(function() {
  //       renderXList([i(1), i(2)]);
  //     });

  //     itRendersAList();
  //     itRendersItems(1, 2);
  //   });

  //   describe('no args', function() {
  //     beforeEach(function() {
  //       renderXList();
  //     });

  //     itRendersAList();
  //     itRendersItems();
  //   });

  //   describe('child', function() {
  //     beforeEach(function() {
  //       renderXList(i(1));
  //     });

  //     itRendersAList();
  //     itRendersItems(1);
  //   });

  //   describe('child, child', function() {
  //     beforeEach(function() {
  //       renderXList(i(1), i(2));
  //     });

  //     itRendersAList();
  //     itRendersItems(1, 2);
  //   });
  // });

  // // function itRendersAList() {
  // //   it('renders a list', function() {
  // //     expect($('ul').length).toEqual(1);
  // //   });
  // // }

  // // function itRendersItems() {
  // //   var args = Array.prototype.slice.call(arguments);
  // //   it('renders items', function() {
  // //     expect(renderedIndexes()).toEqual(args);
  // //   });
  // // }

  // function i(index) {
  //   var Item = React.createClass({
  //     displayName: 'Item',
  //     render: function() {
  //       var attrs = {
  //         'className': 'i-' + this.props.index,
  //         'data-index': this.props.index,
  //         'style':     {height: 20}
  //       };
  //       return React.createElement('div', attrs, 'I am an item');
  //     }
  //   });

  //   return React.createElement(Item, {key: index, index: index});
  // }

  function renderXList() {
    var args = Array.prototype.slice.call(arguments);
    var xListAttrs = {
      style: {height: 100},
      EmptyList: EmptyList,
      PopulatedList: PopulatedList
    };
    var xListArgs = [XList, xListAttrs].concat(args);
    React.addons.TestUtils.renderIntoDocument(React.createElement.apply(React, xListArgs));
  }

  // function renderedIndexes() {
  //   return Array.prototype.map.call($('ul > li > div'), function(el) {
  //     return Number(el.dataset.index);
  //   });
  // }

  // function $(selector) {
  //   return node.querySelectorAll(selector);
  // }
});
