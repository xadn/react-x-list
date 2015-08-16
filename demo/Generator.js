import React from 'react';
import Chance from 'chance';

const chance = new Chance();

const Generator = {
  items(count) {
    var list = [];

    for (let i = 0; i < count; i++) {
      const key = `i-${i}`;
      const style = {border: '1px solid black'};
      const text = chance.sentence({words: chance.natural({min: 1, max: 40})});
      list.push(<div key={key} style={style}>{text}</div>);
    }

    return list;
  }
};

export default Generator;