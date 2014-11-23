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
      height: chance.natural({min: 10, max: 200})
    });
  }
  return items;
}

var DynamicListDemoItem = React.createClass({
  getInitialState: function() {
    return {interval: null};
  },

  componentDidMount: function() {
    this.isMounted() && chance.bool() && this.setState({
      interval: setInterval(this.update, chance.natural({min: 250, max: 500}))
    });
  },

  componentWillUnmount: function() {
    clearInterval(this.state.interval);
  },

  update: function() {
    var height = chance.natural({min: 30, max: 100});

    if (height !== this.props.item.height && this.isMounted()) {
      this.props.item.height = height;
      this.forceUpdate();
    }
  },

  shouldComponentUpdate: function() {
    return false;
  },

  render: function() {
    var item = this.props.item;

    return (
      <div style={{height: item.height}}>
        <div>{item.id}</div>
      </div>
    );
  }
});

var DynamicListDemo = React.createClass({
  getInitialState: function() {
    return {count: 50, renders: 0};
  },

  componentDidMount: function() {
    // setInterval(this.update, 5000);
  },

  update: function() {
    this.setState({
      count: chance.natural({min: 0, max: 50}),
      renders: this.state.renders + 1
    });
  },

  render: function() {
    var state = this.state;

    return (
      <div>
        <FiniteList>
          {generateItems(state.count).map(function(item) {
            return <DynamicListDemoItem key={state.renders + '-' + item.id} item={item} />;
          })}
        </FiniteList>
      </div>
    );
  }
});

var StaticListDemoItem = React.createClass({
  shouldComponentUpdate: function() {
    return false;
  },

  render: function() {
    return (
      <div>
        <div>{this.props.item.id}</div>
        <div>{this.props.item.name}</div>
      </div>
    );
  }
});

var StaticListDemo = React.createClass({
  render: function() {
    return (
      <div>
        <FiniteList>
          {generateItems(5000).map(function(item) {
            return <StaticListDemoItem key={item.id} item={item} />;
          })}
        </FiniteList>
      </div>
    );
  }
});

var Demos = React.createClass({
  render: function() {
    var state = this.state;
    return (
      <div>
        <div style={{float: 'left', marginRight: 20}}>
          <StaticListDemo />
        </div>

        <div style={{float: 'left', marginRight: 20}}>
          <DynamicListDemo />
        </div>
      </div>
    );
  }
});

React.render(<Demos />, document.getElementById('main'));

