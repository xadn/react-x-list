var _ = require('lodash');

function List(defaultHeight, length) {
  defaultHeight = defaultHeight|0;
  this.length = length|0;
  this.top = new Uint32Array(this.length);
  this.bottom = new Uint32Array(this.length);
  this.height = new Uint32Array(this.length);

  for (var i = 0; i < this.length; i++) {
    this.height[i] = defaultHeight;
  }

  this.commit();
}

List.prototype.updateHeight = function add(index, height) {
  this.height[index] = height|0;
};

List.prototype.commit = function commit() {
  this.top[0] = 0;
  this.bottom[0] = this.height[0];

  for (var i = 1; i < this.length; i++) {
    this.top[i] = this.bottom[i - 1];
    this.bottom[i] = (this.top[i] + this.height[i]);
  }
};

List.prototype.totalHeight = function totalHeight() {
  return this.bottom[this.length - 1];
};

List.prototype.indexOfViewportTop = function indexOfViewportTop(viewportTop) {
  // console.time('indexOfViewportTop');
  var left = 0;
  var right = this.length - 1;
  var middle = 0;

  while (right - left > 1) {
    middle = Math.floor((right - left) / 2 + left);

    if (this.top[middle] <= viewportTop) {
      left = middle;
    } else {
      right = middle;
    }
  }

  // console.timeEnd('indexOfViewportTop');
  return left;
};

List.prototype.indexOfViewportBottom = function indexOfViewportBottom(viewportEnd, left) {
  // console.time('indexOfViewportBottom');
  var right = this.length - 1;
  var middle = 0;

  while (right - left > 1) {
    middle = Math.floor((right - left) / 2 + left);

    if (this.bottom[middle] < viewportEnd) {
      left = middle;
    } else {
      right = middle;
    }
  }

  // console.timeEnd('indexOfViewportBottom');
  return Math.min(right + 1, this.length - 1);
}

module.exports = List