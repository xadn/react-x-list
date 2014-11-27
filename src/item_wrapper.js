/** @jsx React.DOM */
var React = require('react/addons');

var ItemWrapper = React.createClass({
  render: function() {
    var transform = 'translate3d(0px, ' + this.props.offsetTop + 'px, 0px)';

    var style = {
      position: 'absolute',
      opacity: this.props.visible ? 1 : 0,
      WebkitTransform: transform,
      transform: transform
    };

    if (this.props.fixedHeight) {
      style.height = 20;
    }

    return (
      <li className='is-item' style={style} onWheel={this.handleWheel}>
        {this.props.children}
      </li>
    );
  },

  handleWheel: function(e) {
    this.props.onWheel(this.props.index, e);
  }
});

module.exports = ItemWrapper;
