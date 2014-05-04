/** @jsx React.DOM */
var React = require('react/addons'),
    cx = React.addons.classSet;

var Placeholder = React.createClass({
  render: function() {
    var style = {
      height: this.props.height + 'px'
    };

    return <li className='is-item' style={style}></li>;
  }
});

var PanelItem = React.createClass({
  getInitialState: function() {
    return {
      highlight: false,
      lastScrolledAt: -1,
      doneScrollingTimeout: null
    };
  },

  componentDidUpdate: function() {
    this.props.item.height = this.getDOMNode().offsetHeight;
  },

  render: function() {
    if (this.props.visible || this.state.isScrolling) {
      return this.visibleItem();
    } else {
      return <Placeholder />;
    }
  },

  visibleItem: function() {
    var classes = cx({
      'is-item': true,
      'is-highlight': this.state.highlight
    });

    return (
      <li className={classes} onClick={this.handleClick} onWheel={this.handleWheel}>
        <div>{this.props.item.name}</div>
      </li>
    );
  },

  hiddenItem: function() {
    var style = {height: this.props.item.height + 'px',};

    return (
      <li className='is-item' style={style}>nothin</li>
    );
  },

  handleClick: function() {
    this.highlight();
    setTimeout(this.unhighlight, 1000);
  },

  handleWheel: function() {
    clearTimeout(this.doneScrollingTimeout);

    this.setState({
      isScrolling: true,
      doneScrollingTimeout: setTimeout(this.doneScrolling, 3000)
    });
  },

  doneScrolling: function() {
    this.setState({isScrolling: false});
  },

  highlight: function() {
    this.setState({highlight: true});
  },

  unhighlight: function() {
    this.setState({highlight: false});
  }
});

module.exports = PanelItem;