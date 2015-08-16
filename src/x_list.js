const React         = require('react/addons');
const EmptyList     = require('./empty_list');
const PopulatedList = require('./populated_list');

const XJumboList = React.createClass({
  render: function() {
    const children = this.props.children;

    if (Array.isArray(children)) {
      if (children.length) {
        return React.createElement(PopulatedList, this.props);
      } else {
        return React.createElement(EmptyList, this.props);
      }
    } else {
      if (children) {
        return React.createElement(PopulatedList, this.props, [children]);
      } else {
        return React.createElement(EmptyList, this.props);
      }
    }
  }
});

module.exports = XJumboList;
