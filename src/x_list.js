/** @jsx React.DOM */
var React         = require('react/addons');
var EmptyList     = require('./empty_list');
var PopulatedList = require('./populated_list');

var XList = React.createClass({
  displayName: 'XList',

  render: function() {
    var children = [].concat(this.props.children);

    if (children.length > 0) {
      return <PopulatedList {...this.props} />
    }
    return <EmptyList {...this.props} />
  }
});

module.exports = XList;
