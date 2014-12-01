/** @jsx React.DOM */
var React         = require('react/addons');
var EmptyList     = require('./empty_list');
var PopulatedList = require('./populated_list');

var XList = React.createClass({
  displayName: 'XList',

  render: function() {
    var children = this.props.children;

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

module.exports = XList;
