import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd';
import dragIcon from './assets/drag-icon.svg';

const forSaleListTarget = {
  drop(props) {
    console.log("drop forSaleListTarget", props);
    return props;
  }
};

function collectForSaleList(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class ForSaleList extends Component {
  render() {
    const { connectDropTarget, items, model } = this.props;
    return connectDropTarget(
      <div className="ForSale">
        <h3>Marketplace Items</h3>
        <ul className="itemsForSale">
        {items.map((item) =>
          <li className="tile" key={item.data.label}>
            <DraggableForSale model={model} data={item.data} item={item}/>
          </li>
        )}
        </ul>
      </div>
    );
  }
}

const DropTargetForSaleList = DropTarget("inventory", forSaleListTarget, collectForSaleList)(ForSaleList);


export default DropTargetForSaleList;


const forSaleSource = {
  beginDrag(props) {
    return {
      label: props.label,
      item : props.item
    };
  },
  endDrag(props, monitor) {
    const result = monitor.getDropResult();
    console.log('endDrag forSaleSource', props, result)
    if (result) {
      makeTransaction(props.model, props.item, result.player)
    }
    return {
      label: props.label,
      item : props.item
    }
  }
};

function makeTransaction(model, item, player) {
  console.log('makeTransaction', model, item, player)
  model.sell(item, player).then((r) => {
    console.log(r);
  })
}

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const propTypes = {
  label: PropTypes.string.isRequired,

  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
};

class ForSale extends Component {
  render() {
    const { isDragging, connectDragSource, data } = this.props;
    return connectDragSource(
      <div style={{ opacity: isDragging ? 0.5 : 1 }}>
        <span className="drag-icon"><img src={dragIcon} alt="Click and Drag" /></span>
        <div className="thumbnail">{data.label}</div>
        <div className="tile-text">
          <div><span className="label">Price</span><div className="money">${data.price}</div></div>
          <div><span className="label">Seller</span><div>{data.owner_name}</div></div>
        </div>
      </div>
    );
  }
}

ForSale.propTypes = propTypes;

// Export the wrapped component:
const DraggableForSale =  DragSource("forSale", forSaleSource, collect)(ForSale);
