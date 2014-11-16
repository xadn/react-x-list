/** @jsx React.DOM */
var React = require('react/addons');

var Placeholder = React.createClass({
  render: function() {
    var transform = 'translate3d(0px, ' + this.props.start + 'px, 0px)';

    var style = {
      WebkitTransform: transform,
      transform: transform,
      height: this.props.end - this.props.start
    };

    return <li className='is-item' style={style} />;
  }
});

module.exports = Placeholder;
