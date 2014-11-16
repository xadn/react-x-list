var Utils = {
  copyRange: function(destination, source, startRange, endRange) {
    for (var i = startRange; i < endRange; i++) {
      destination[i] = source[i];
    }
  },

  binarySearch: function(values, target) {
    var left = 0;
    var right = values.length - 1;
    var middle = 0;

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
    return left;
  }
}

module.exports = Utils;
