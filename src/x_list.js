/** @jsx React.DOM */
var React         = require('react/addons');
var EmptyList     = require('./empty_list');
var PopulatedList = require('./populated_list');

var XList = React.createClass({
  displayName: 'XList',

  render: function() {
    var children = this.props.children;

    if (Array.isArray(children) && children.length > 0) {
      return React.createElement(PopulatedList, this.props);
    }
    if (children) {
      return React.createElement(PopulatedList, this.props, [children]);
    }
    return React.createElement(EmptyList, this.props);
  }
});

module.exports = XList;
