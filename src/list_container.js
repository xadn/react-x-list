/** @jsx React.DOM */
var React = require('react/addons');

var ListContainer = React.createClass({
  render: function() {
    return (
      <div className='is-list-container' onScroll={this.props.onScroll}>
        <ul className='is-list' style={this.props.style}>
          {this.props.children}
        </ul>
      </div>
    );
  }
});

module.exports = ListContainer;
