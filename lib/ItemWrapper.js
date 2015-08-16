import React from 'react';

class ItemWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {renderedOnce: false};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.top !== nextProps.top ||
      this.state.renderedOnce !== nextState.renderedOnce
    );
  }

  componentDidMount() {
    this.setState({renderedOnce: true});
  }

  render() {
    const style = {
      display:   'flex',
      opacity:   this.state.renderedOnce ? 1 : 0,
      position:  'absolute',
      transform: `translate3d(0px, ${this.props.top}px, 0px)`,
    };

    const {
      model,
      cid,
    } = this.props;

    return (
      <div style={style} onWheel={() => model.updateLastScrolled(cid)}>
        {this.props.children}
      </div>
    );
  }
}

export default ItemWrapper;
