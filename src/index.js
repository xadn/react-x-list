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
      height: 21
    });
  }
  return items;
}

var DemoItem = React.createClass({
  getInitialState: function() {
    return {interval: null};
  },

  componentDidMount: function() {
    this.isMounted() && chance.bool() && this.setState({
      interval: setInterval(this.update, chance.natural({min: 500, max: 15000}))
    });
  },

  componentWillUnmount: function() {
    clearInterval(this.state.interval);
  },

  update: function() {
    var height = Math.min(this.props.item.height + 20, 300);

    if (height !== this.props.item.height && this.isMounted()) {
      this.props.item.height = height;
      this.forceUpdate();
    }
  },

  render: function() {
    var item = this.props.item;

        // <img src='1.gif' />
    return (
      <div style={{height: item.height}}>
        <div>{item.id}</div>
      </div>
    );
  }
});

var DemoList = React.createClass({
  getInitialState: function() {
    return {count: 200, renders: 0};
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

