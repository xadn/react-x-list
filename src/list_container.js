/** @jsx React.DOM */
var React = require('react/addons');

var ListContainer = React.createClass({
  render: function() {
    var outerStyle = {
      // overflowY: 'scroll',
      // padding: 0,
      // width: 300,
      height: '100%'
    };

    var innerStyle = {
      position: 'relative',
      margin: 0,
      padding: 0,
      willChange: 'transform',
      height: this.props.scrollHeight
    };

    return (
      <div className='is-list-container' style={outerStyle} onScroll={this.props.onScroll}>
        <ul className='is-list' style={innerStyle}>
          {this.props.children}
        </ul>
      </div>
    );
  }
});

module.exports = ListContainer;
