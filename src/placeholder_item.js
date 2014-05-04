/** @jsx React.DOM */
var React = require('react');

var PlaceholderItem = React.createClass({
  render: function() {
    var style = {
      height: this.props.height + 'px'
    };

    return <li className='is-item' style={style}></li>;
  }
});

module.exports = PlaceholderItem