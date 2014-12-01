var XList = require('../src/x_list');
var React = require('react/addons');
// var simulateScroll = React.addons.TestUtils.Simulate.scroll;
// var simulateWheel  = React.addons.TestUtils.Simulate.wheel;

describe('XList', function() {
  var node;

  beforeEach(function() {
    jasmine.addMatchers(require('./custom_matchers'));

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

    it('is scrolled to the top', function() {
      expect(outerList().scrollTop).toEqual(0);
    });

    it('is the full height', function() {
      expect($$('ul').offsetHeight).toEqual(240);
    });

    describe('scrolled to the top', function() {
      itRendersItems(1, 2, 3, 4, 5, 6);
    });

    describe('scrolled to the second item', function() {
      beforeEach(function() {
        simulateScroll(20);
      });

      it('includes onscreen items', function() {
        expect(2).toBeRendered();
        expect(3).toBeRendered();
        expect(4).toBeRendered();
        expect(5).toBeRendered();
        expect(6).toBeRendered();
        expect(7).toBeRendered();
      });

      it('positions the items', function() {
        expect(2).toHaveTransform({y: 20});
        expect(3).toHaveTransform({y: 40});
        expect(4).toHaveTransform({y: 60});
        expect(5).toHaveTransform({y: 80});
        expect(6).toHaveTransform({y: 100});
        expect(7).toHaveTransform({y: 120});
      });

      it('excludes offscreen items', function() {
        expect(1).not.toBeRendered();
        expect(8).not.toBeRendered();
        expect(9).not.toBeRendered();
        expect(10).not.toBeRendered();
        expect(11).not.toBeRendered();
        expect(12).not.toBeRendered();
      });
    });

    describe('scrolled to the bottom', function() {
      beforeEach(function() {
        simulateScroll(140);
      });

      // it('positions the items', function() {
      //   expect(2).toHaveTransform({y: 20});
      //   expect(3).toHaveTransform({y: 40});
      //   expect(4).toHaveTransform({y: 60});
      //   expect(5).toHaveTransform({y: 80});
      //   expect(6).toHaveTransform({y: 100});
      //   expect(7).toHaveTransform({y: 120});
      // });

      itRendersItems(8, 9, 10, 11, 12);
    });
  });

  function itPositionsItemAt(index, offset) {
    it('positions item ' + index + ' at ' + offset, function() {
      var yTransform = $li(index).style.transform.match(/translate3d\(0px, (\d+)px, 0px\)/)[1]
      expect(Number(yTransform)).toEqual(offset);
    });
  }

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

  function itDoesNotRender() {
    var args = Array.prototype.slice.call(arguments);

    // it('does not render ' + args.join(', '), function() {
    //   $i()
    // });
  }

  function i(index) {
    var Item = React.createClass({
      displayName: 'Item',
      render: function() {
        var attrs = {
          'className': 'i-' + this.props.index,
          'data-index': this.props.index,
          'style':     {height: 20}
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
    return Array.prototype.map.call($('ul > li > div'), function(el) {
      return Number(el.dataset.index);
    });
  }

  function simulateScroll(scrollTop) {
    outerList().scrollTop = scrollTop;
    expect(outerList().scrollTop).toEqual(scrollTop);
    React.addons.TestUtils.Simulate.scroll(outerList());
  }

  function innerList() {
    return $$('.x-list-inner');
  }

  function outerList() {
    return $$('.x-list');
  }

  function $li(index) {
    return $i(index) ? $i(index).parentElement : void 0;
  }

  function $i(index) {
    return $('[data-index="'+ index + '"]')[0];
  }

  function $(selector) {
    return node.querySelectorAll(selector);
  }

  function $$(selector) {
    expect(node.querySelectorAll(selector).length).toEqual(1);
    return node.querySelector(selector);
  }
});
