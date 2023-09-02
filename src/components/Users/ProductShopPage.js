import React from "react";

//Importing this pages css
import "./ProductShopPage.css";

//importing components
import ProductDetailsShop from "./ProductDetailsShop";

function ProductShopPage (props){

    const { remainingStock } = props;
    console.log("Shop Page Stock: ",remainingStock)

    return (
        <>
            <div className="product-wrapper" id="double">
                <div className="product-item">
                    <div className="image">
                        <img src={props.items.image_url.S}  alt="A double beaded roller to help with anxiety" className="product-img-sml"/>
                    </div>
                    <ProductDetailsShop items={props} remainingStock={remainingStock}/>
                </div>

                
            </div>

        </>
    );
};

export default ProductShopPage;