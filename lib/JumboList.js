import React       from 'react';
import ItemWrapper from './ItemWrapper';
import Model       from './Model';
import { areArraysEqual } from './Utils';

class JumboList extends React.Component {
  constructor(props) {
    super(props);
    this._onScroll = this._onScroll.bind(this);
    this._model = new Model(this._getChildKeys());
    this.state = this._getModelState();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.totalHeight !== nextState.totalHeight ||
      !areArraysEqual(this.state.visibleIndexes, nextState.visibleIndexes)
    );
  }

  componentDidMount() {
    this._model.updateHeights(this._getChildHeights());
    this._model.updateViewport(this._getViewport());
    this._setStateFromModel();
  }

  componentDidUpdate() {
    this._model.updateHeights(this._getChildHeights());
    this._setStateFromModel();
  }

  render() {
    const {
      children,
      width,
      height,
    } = this.props;
    const {
      totalHeight,
      visibleIndexes,
    } = this.state;
    const style = {
      width:     width,
      height:    height,
      overflowY: 'auto',
      position:  'relative',
    };
    const model = this._model;

    return (
      <div style={style} onScroll={this._onScroll}>
        <div style={{height: totalHeight}}>
          {visibleIndexes.map((i) => {
            return (
              <ItemWrapper ref={children[i].key} key={children[i].key} cid={children[i].key} top={model.topAt[i]} model={model}>
                {children[i]}
              </ItemWrapper>
            );
          })}
        </div>
      </div>
    );
  }

  _onScroll(e) {
    this._model.updateViewport(this._getViewport());
    this._setStateFromModel();
  }

  _getModelState() {
    return {
      totalHeight: this._model.totalHeight(),
      visibleIndexes: this._model.visibleIndexes(),
    };
  }

  _getViewport() {
    const node = React.findDOMNode(this);
    const viewportStart = node.scrollTop;
    const viewportEnd = viewportStart + node.offsetHeight;
    return [viewportStart, viewportEnd];
  }

  _getChildHeights() {
    var heights = {};
    for (let key in this.refs) {
      heights[key] = React.findDOMNode(this.refs[key]).offsetHeight;
    }
    return heights;
  }

  _getChildKeys() {
    return this.props.children.map((child) => child.key);
  }

  _setStateFromModel() {
    this.setState(this._getModelState());
  }
}

export default JumboList;