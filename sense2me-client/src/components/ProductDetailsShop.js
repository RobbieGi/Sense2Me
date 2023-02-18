import React from "react";
import "./ProductDetailsShop.css"

function ProductDetailsShop(props){

    return(

        <div className="product-details">
            <h3 className="title">{props.items.items.name}</h3>
            <div className="price-wrapper">
                <h3 className="price-tag">{props.items.items.price}</h3>
            </div>
        </div>

    );

}

export default ProductDetailsShop;