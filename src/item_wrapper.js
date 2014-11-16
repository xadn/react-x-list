/** @jsx React.DOM */
var React = require('react/addons');

var ItemWrapper = React.createClass({
  render: function() {
    var transform = 'translate3d(0px, ' + this.props.offsetTop + 'px, 0px)';

    var style = {
      WebkitTransform: transform,
      transform: transform,
      opacity: this.props.visible ? 1 : 0
    };

    return (
      <li className='is-item' style={style} onWheel={this.props.onWheel}>
        {this.props.children}
      </li>
    );
  }
});

module.exports = ItemWrapper;
