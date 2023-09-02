import React from "react";
import "./ProductDetailsShop.css";

function ProductDetailsShop(props) {
  const { remainingStock } = props;

  console.log(remainingStock)

  return (
    <div className="product-details">
      <div className="top">
        <h3 className="title">{props.items.items.name.S}</h3>
      </div>
      <div className="bottom">
        <div className="stock-wrapper">
          <h4 className="inventory-count">Stock: {remainingStock}</h4>
        </div>
        <div className="price-wrapper">
          <h4 className="price-tag">Price: £{props.items.items.price.N}</h4>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsShop;