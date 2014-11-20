/** @jsx React.DOM */
var React = require('react/addons');

var ItemWrapper = React.createClass({
  componentDidMount: function() {
    if (this.isMounted()) {
      this.observer_ = new MutationObserver(this.handleMutations);
      this.observer_.observe(this.getDOMNode(), {attributes: true, childList: true, characterData: true, subtree: true});
    }
  },

  componentWillUnmount: function() {
    this.observer_ && this.observer_.disconnect();
    this.observer_ = null;
  },

  render: function() {
    var transform = 'translate3d(0px, ' + this.props.offsetTop + 'px, 0px)';

    var style = {
      WebkitTransform: transform,
      transform: transform,
      opacity: this.props.visible ? 1 : 0
    };

    return (
      <li className='is-item' style={style} onWheel={this.handleWheel}>
        {this.props.children}
      </li>
    );
  },

  handleWheel: function(e) {
    this.props.onWheel(this.props.index, e);
  },

  handleMutations: function(ms) {
    ms.forEach(this.handleMutation);
  },

  handleMutation: function(m) {
    this.props.onMutate(this.props.index);
  }
});

module.exports = ItemWrapper;
