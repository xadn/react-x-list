
var Utils = {
  copyRange: function(destination, source, start, end) {
    for (var i = start; i < end; i++) {destination
      destination[i] = source[i];
    }
  }
}

module.exports = Utils;
