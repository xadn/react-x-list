const Utils = {
  copyRange: function(destination, source, startRange, endRange) {
    for (let i = startRange; i < endRange; i++) {
      destination[i] = source[i];
    }
  },

  binarySearch: function(values, target) {
    let max = values.length - 1;
    let left = 0;
    let right = max;
    let middle = 0;

    if (target <= values[left]) {
      return left;
    }

    if (target >= values[right]) {
      return right;
    }

    while (right - left > 1) {
      middle = Math.floor((right - left) / 2 + left);

      if (values[middle] <= target) {
        left = middle;
      } else {
        right = middle;
      }
    }
    return Math.min(left, max);
  },

  areArraysEqual: function(a, b) {
    let len = a.length;

    if (len !== b.length) { return false; }

    for (let i = 0; i < len; i++) {
      if (a[i] !== b[i]) { return false; }
    }

    return true;
  }
};

export default Utils;
