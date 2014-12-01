function $li(index) {
  return $i(index) ? $i(index).parentElement : void 0;
}

function $i(index) {
  return document.querySelectorAll('[data-index="'+ index + '"]')[0];
}

module.exports = {

  toHaveTransform: function(util, customEqualityTesters) {
    return {
      compare: function(actualIndex, expectedTransform) {
        var node = $li(actualIndex);
        var transform = node.style.transform;
        var matches = transform.match(/translate3d\((\d+)px, (\d+)px, (\d+)px\)/);

        var translate = {
          x: Number(matches[1]),
          y: Number(matches[2]),
          z: Number(matches[3])
        };

        var pass = true;
        var message = 'Expected ' + matches[0] + ' to have ';

        for (var prop in expectedTransform) {
          if (!util.equals(translate[prop], expectedTransform[prop], customEqualityTesters)) {
            message += prop + '-transform: ' + expectedTransform[prop]
            pass = false;
          }
        }

        return {
          pass: pass,
          message: message
        };
      }
    };
  },

  toBeRendered: function(util, customEqualityTesters) {
    return {
      compare: function(actualIndex) {
        var matches = document.body.querySelectorAll('[data-index="'+ actualIndex + '"]');

        return {
          pass: matches.length > 0,
          message: 'Expected item ' + actualIndex + ' to be rendered'
        };
      },

      negativeCompare: function(actualIndex) {
        var matches = document.body.querySelectorAll('[data-index="'+ actualIndex + '"]');

        return {
          pass: matches.length === 0,
          message: 'Expected item ' + actualIndex + ' not to be rendered'
        };
      }
    };
  }

  // toRenderItem: function(util, customEqualityTesters) {
  //   return {
  //     compare: function(actualNode, expectedIndex) {
  //       var matches = actualNode.querySelectorAll('[data-index="'+ expectedIndex + '"]');

  //       return {
  //         pass: matches.length > 0,
  //         message: 'Expected item ' + expectedIndex + ' to be rendered'
  //       };
  //     },

  //     negativeCompare: function(actualNode, expectedIndex) {
  //       var matches = actualNode.querySelectorAll('[data-index="'+ expectedIndex + '"]');

  //       return {
  //         pass: matches.length === 0,
  //         message: 'Expected item ' + expectedIndex + ' not to be rendered'
  //       };
  //     }
  //   };
  // }

};