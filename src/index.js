/** @jsx React.DOM */
var React      = require('react/addons');
var FiniteList = require('./list');
var Chance     = require('chance');
var chance     = new Chance();

function generateItems(count) {
  var items = [];
  for (var i = 0; i < count; i++) {
    items.push({
      id: i + 1,
      name: chance.sentence({words: chance.natural({min: 1, max: 40})}),
      height: 20,
      scrolledAt: -1,
      isScrolling: false,
      isVisible: false
    });
  }
  return items;
}

var DemoItem = React.createClass({
  shouldComponentUpdate: function() {
    return false;
  },

  render: function() {
    var item = this.props.item;

    return (
      <div>
        <div>{item.id}</div>
        <div>{item.name}</div>
      </div>
    );
  }
});

var DemoList = React.createClass({
  getInitialState: function() {
    return {count: 10, render: 0};
  },

  componentDidMount: function() {
    // setInterval(this.update, 2000);
  },

  update: function() {
    this.setState({
      count: chance.natural({min: 20, max: 80}),
      renders: this.state.renders + 1
    });
  },

  render: function() {
    var state = this.state;
    console.log('DemoList', state);

    return (
      <div>
        <FiniteList>
          {generateItems(state.count).map(function(item) {
            return <DemoItem key={state.renders + '-' + item.id} item={item} />;
          })}
        </FiniteList>
      </div>
    );
  }
});

console.log(chance.string());

React.render(<DemoList />, document.getElementById('main'));

