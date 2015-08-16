import React from 'react';
import Generator from './Generator';
import JumboList from '../';

const style = {
  container: {
    display:  'flex',
    marginTop: 50,
  },
  panel: {
    background: 'repeating-linear-gradient(45deg,transparent,transparent 10px,#ccc 10px,#ccc 20px),linear-gradient(to bottom,#ddd,#ddd)',
    margin: '0 10px',
    width: 400,
    height: 500
  },

};

const layout = (
  <div style={style.container}>
    <div style={style.panel}>
      <JumboList width={style.panel.width} height={style.panel.height}>
        {Generator.items(1000)}
      </JumboList>
    </div>

    <div style={style.panel}>
      <JumboList width={style.panel.width} height={style.panel.height}>
        {Generator.items(10000)}
      </JumboList>
    </div>
  </div>
);

React.render(layout, window.main);

