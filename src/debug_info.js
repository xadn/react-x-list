/** @jsx React.DOM */
var React = require('react/addons');

var DebugInfo = React.createClass({displayName: 'DebugInfo',
  render: function() {
    return (
      React.DOM.div({className: "is-debug-info"}, 
        React.DOM.table(null, 
          React.DOM.tr(null, 
            React.DOM.td(null, "nodes:"), 
            React.DOM.td(null, this.props.nodeCount)
          ), 
          React.DOM.tr(null, 
            React.DOM.td(null, "items:"), 
            React.DOM.td(null, this.props.itemCount)
          )
        )
      )
    );
  }
});

module.exports = DebugInfo;
