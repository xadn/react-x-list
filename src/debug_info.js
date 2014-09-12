/** @jsx React.DOM */
var React = require('react/addons');

var DebugInfo = React.createClass({
  render: function() {
    return (
      <div className='is-debug-info'>
        <table>
          <tr>
            <td>nodes:</td>
            <td>{this.props.nodeCount}</td>
          </tr>
          <tr>
            <td>items:</td>
            <td>{this.props.itemCount}</td>
          </tr>
        </table>
      </div>
    );
  }
});

module.exports = DebugInfo;
