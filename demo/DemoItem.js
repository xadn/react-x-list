import React from 'react';
import Chance from 'chance';

const chance = new Chance();

const style = {
  border: '1px solid black',
};

class DemoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: chance.sentence({words: chance.natural({min: 1, max: 40})})
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div style={style}>
        {this.state.text}
      </div>
    );
  }
}

export default DemoItem