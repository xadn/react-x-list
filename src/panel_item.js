/** @jsx React.DOM */
var React = require('react');

var PanelItem = React.createClass({
  componentDidUpdate: function() {
    this.props.item.height = this.getDOMNode().offsetHeight;
  },

  render: function() {
    return this.props.visible ? this.visibleItem() : this.hiddenItem();
  },

  visibleItem: function() {
    return (
      <li className='is-item'>{this.props.item.name}</li>
    );
  },

  hiddenItem: function() {
    var style = {
          height: this.props.item.height + 'px',
        };

    return (
      <li className='is-item' style={style}>nothin</li>
    );
  },
});

module.exports = PanelItem;