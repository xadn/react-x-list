/** @jsx React.DOM */
var React = require('react');

var Scrim = React.createClass({
  render: function() {
    var style = {
      height: this.props.height + 'px'
    };

    return <div className='is-scrim' style={style}></div>;
  }
});

module.exports = Scrim;