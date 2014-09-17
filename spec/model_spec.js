var List = require('../src/finite_list_model');

describe('#model', function () {
  var model;

  beforeEach(function() {
    model = new List(10, 10);
  });

  it('calculates the totalHeight', function () {
    expect(model.totalHeight()).toEqual(100);
  });

  describe("#indexOfViewportTop", function() {
    it("finds the first index when the viewport is at the top", function() {
      expect(model.indexOfViewportTop(0)).toEqual(0);
    });

    it("finds the first index when the viewport is near the top", function() {
      expect(model.indexOfViewportTop(1)).toEqual(0);
    });

    it("finds the second to last index when the viewport is at the bottom", function() {
      expect(model.indexOfViewportTop(100)).toEqual(8);
    });

    it("finds the second to last index when the viewport is near the bottom", function() {
      expect(model.indexOfViewportTop(99)).toEqual(8);
    });

    it("finds the middle index when the viewport is at the middle", function() {
      expect(model.indexOfViewportTop(50)).toEqual(5);
    });
  });

  describe("#indexOfViewportBottom", function() {
    it("finds the second to first index when the viewport is at the top", function() {
      expect(model.indexOfViewportBottom(0, 0)).toEqual(1);
    });

    it("finds the last index when the viewport is at the bottom", function() {
      expect(model.indexOfViewportBottom(100, 0)).toEqual(9);
    });

    it("finds the middle index when the viewport is at the middle", function() {
      expect(model.indexOfViewportBottom(50, 0)).toEqual(4);
    });
  });
});