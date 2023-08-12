import React, { useState, useEffect } from "react";
import "./ProductDetailsShop.css";

const basket = JSON.parse(sessionStorage.getItem("basket")) || []; // Define the basket array outside the component function

function ProductDetailsShop(props) {
  const [basketSize, setBasketSize] = useState(0);
  const [stock, setStock] = useState(null)

  useEffect(() => {
    // Calculate the total amount in the basket
    let totalInBasket = 0;
    for (const item of basket) {
      console.log(item)
      if (item.sku === props.items.items.sku.S) {
        totalInBasket += item.amount;
      }
    }

    console.log(basket)

    // Calculate the remaining stock after considering the items in the basket
    const remainingStock = parseInt(props.items.items.inventory_count.N, 10) - totalInBasket;
    setStock(remainingStock);
  }, [props.items.items.inventory_count.N, props.items.items.sku.S]);

  function addToBasket() {
    if(stock === 0){
      alert("Maximum Stock Aquired")
    }else{
      let existingProductIndex = -1;
    
      for (let i = 0; i < basket.length; i++) {
        if (basket[i].sku === props.items.items.sku.S) {
          existingProductIndex = i;
          break;
        }
      }
    
      if (existingProductIndex !== -1) {
        console.log("Take Away one Existing Entry");
        basket[existingProductIndex].amount = parseInt(basket[existingProductIndex].amount, 10) + 1;
        setStock((prevStock) => prevStock - 1);
      } else {
        console.log("Take Away one New Entry");
        setStock((prevStock) => prevStock - 1);
        basket.push({
          sku: props.items.items.sku.S,
          price: props.items.items.price.N,
          name: props.items.items.name.S,
          image_url: props.items.items.image_url.S,
          description: props.items.items.description.S,
          amount: 1,
        });
      }
    }
  
    sessionStorage.setItem("basket", JSON.stringify(basket));
    setBasketSize(basket.length);
  }
  

    return(

        <div className="product-details">
          <div className="top">
            <h3 className="title">{props.items.items.name.S}</h3>
              <div className="price-wrapper" onClick={addToBasket}>
                  <ion-icon name="add-circle-outline"></ion-icon>
                  <h3 className="price-tag">{props.items.items.price.N}</h3>
              </div>
            </div>
            <div className="bottom">
              <h4 className="inventory-count">Stock Amount: {stock}</h4>
            </div>
        </div>

    );

}

export default ProductDetailsShop;