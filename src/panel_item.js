/** @jsx React.DOM */
var React = require('react/addons'),
    cx = React.addons.classSet;

var PanelItem = React.createClass({
  getInitialState: function() {
    return {highlight: false};
  },

  componentDidMount: function() {
    // console.time('componentDidUpdate')
    if (!this.isMounted()) {
      return;
    }

    var height = this.getDOMNode().offsetHeight;

    if (this.props.item.height !== height) {
      this.props.item.height = height;
    }
    // console.timeEnd('componentDidUpdate')
  },

  render: function() {
    var classes = cx({
      'is-item': true,
      'is-highlight': this.state.highlight
    });

    return (
      <li className={classes} onClick={this.handleClick} onWheel={this.handleWheel}>
        <div>{this.props.item.id}</div>
        <div>{this.props.item.name}</div>
      </li>
    );
  },

  handleClick: function() {
    this.highlight();
    setTimeout(this.unhighlight, 1000);
  },

  handleWheel: function() {
    // console.time('handleWheel')
    this.props.item.isScrolling = true;
    this.props.item.scrolledAt = Date.now();
    // console.timeEnd('handleWheel')
  },

  highlight: function() {
    this.setState({highlight: true});
  },

  unhighlight: function() {
    this.setState({highlight: false});
  }
});

module.exports = PanelItem;