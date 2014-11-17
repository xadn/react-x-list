/** @jsx React.DOM */
var React         = require('react/addons');
var ListContainer = require('./list_container');

var EmptyList = React.createClass({
  render: function() {
    return <ListContainer style={{height: 0}} />;
  }
});

module.exports = EmptyList;
