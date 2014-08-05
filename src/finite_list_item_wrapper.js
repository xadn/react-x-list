/** @jsx React.DOM */
var React = require('react/addons'),
    cloneWithProps = React.addons.cloneWithProps,
    cx = React.addons.classSet;

var FiniteListItemWrapper = React.createClass({
  render: function() {
    return cloneWithProps(this.props.children, {onWheel: this.handleWheel});
  },

  componentDidMount: function() {
    // this.props.metadata = {};
    this.updateHeight();
  },

  componentDidUpdate: function() {
    this.updateHeight();
  },

  componentWillUnmount: function() {
    // this.props.metadata = null;
  },

  updateHeight: function() {
    if (!this.isMounted()) { return; }

    console.log('updateHeight')

    var height = this.getDOMNode().offsetHeight;

    if (this.props.metadata.height !== height) {
      this.props.metadata.height = height;
    }
  },

  handleWheel: function() {
    this.props.metadata.lastScrolledAt = Date.now();
  }
});

module.exports = FiniteListItemWrapper;