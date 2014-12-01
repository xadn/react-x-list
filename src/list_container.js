/** @jsx React.DOM */
var React = require('react/addons');

var ListContainer = React.createClass({
  render: function() {
    var innerStyle = {
      height: this.props.scrollHeight,
      overflowY: 'scroll',
      position: 'relative',
      willChange: 'transform',
      margin: 0,
      padding: 0
    };

    var outerStyle = this.props.style || {};
    outerStyle.overflowY = 'scroll';
    outerStyle.width = 300;

    return (
      <div className='x-list' style={outerStyle} onScroll={this.props.onScroll}>
        <ul className='x-list-inner' style={innerStyle}>
          {this.props.children}
        </ul>
      </div>
    );
  }
});

module.exports = ListContainer;
