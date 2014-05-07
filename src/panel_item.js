/** @jsx React.DOM */
var React = require('react/addons'),
    cx = React.addons.classSet;

var PanelItem = React.createClass({
  getInitialState: function() {
    return {
      highlight: false,
      doneScrollingTimeout: null
    };
  },

  componentDidMount: function() {
    if (!this.isMounted()) {
      return;
    }

    var height = this.getDOMNode().offsetHeight;

    if (this.props.item.height !== height) {
      this.props.item.height = height;
      this.props.onItemChange();
    }
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
    this.props.item.isScrolling = true;

    clearTimeout(this.doneScrollingTimeout);
    this.setState({
      doneScrollingTimeout: setTimeout(this.doneScrolling, 3000)
    });
  },

  doneScrolling: function() {
    this.props.item.isScrolling = false;
    this.props.onItemChange();
  },

  highlight: function() {
    this.setState({highlight: true});
  },

  unhighlight: function() {
    this.setState({highlight: false});
  }
});

module.exports = PanelItem;