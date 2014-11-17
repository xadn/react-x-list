/** @jsx React.DOM */
var React = require('react/addons');
var EmptyList = require('./empty_list');
var FiniteList = require('./finite_list');

var List = React.createClass({
  render: function() {
    if (this.props.children.length > 0) {
      return <FiniteList {...this.props} />
    }
    return <EmptyList {...this.props} />
  }
});

module.exports = List;
