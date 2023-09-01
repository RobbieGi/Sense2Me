import React, { useEffect, useState } from "react";

import "./AddProduct.css";

function AddProduct(){

  const [items, setItems] = useState([]);

  useEffect(() => {
    const form = document.getElementById("product-form");
    form.addEventListener("submit", handleForm);
    return () => {
      form.removeEventListener("submit", handleForm);
    };
  }, []);

  useEffect(() => {
    fetch('https://y6wf50h2e4.execute-api.eu-west-1.amazonaws.com/dev/getProductDalek', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setItems(JSON.parse(data.body));
        console.log(JSON.parse(data.body));
      })
      .catch((error) => {
        console.error(error);
      });
    }, []);

    const findProductBySku = (sku) => {
      const lowerCaseSku = sku.toLowerCase();
    
      const matchingItem = items.find((item) => {
        // Check if the SKU property exists and is a string
        if (item.sku.S) {
          console.log('Database SKU:', item.sku.S);
          console.log('Input SKU:', lowerCaseSku);
          console.log('Comparison Result:', item.sku.S.toLowerCase() === lowerCaseSku);
          return item.sku.S.toLowerCase() === lowerCaseSku;
        }
        return false; // If the SKU property is not a string, it won't match
      });
    
      console.log('Matching Item:', matchingItem);
      return matchingItem;
    };
    

  function handleForm(event) {
    event.preventDefault();
  
    const sku = document.getElementById("sku").value;
    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);
    const description = document.getElementById("description").value;
    const image_url = document.getElementById("image_url").value;
    const inventory_count = parseInt(document.getElementById("inventory_count").value);
  
    if(findProductBySku(sku)){
      console.log("hello")
      window.alert("Need a unique SKU as this is already in the system")
      return;
    }

    // Validation
    if (!name || !price || !description || !image_url || !inventory_count || !sku) {
      window.alert("All fields are required.");
      return;
    }
  
    console.log(name, price, description, image_url, inventory_count, sku);

    fetch("https://oeblau5cyl.execute-api.eu-west-1.amazonaws.com/dev/postProductDalek", {
      mode: "cors",
      method: "POST",
      body: JSON.stringify({
        sku: sku, // Fix: Pass the SKU value correctly
        name: name,
        price: price,
        description: description,
        image_url: image_url,
        inventory_count: inventory_count,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          console.log(res)
          return res.json();
        }
        throw new Error("Request failed!");
      })
      .then((data) => {
        window.alert("Posted Correctly");
        console.log(data);
        document.getElementById("product-form").reset();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }
    
      return(
        <div className="AddProduct">
          <div className="content-main">
              <form id="product-form">
                <label>Add Product</label>
                <label>SKU:</label>
                <input type="text" id="sku" placeholder="sku" className="text-input"/>
                <label>Product Name:</label>
                <input type="text" id="name" placeholder="product-name" className="text-input"/>
                <label>Product Price:</label>
                <input type="float" id="price" placeholder="product-price" className="text-input"/>
                <label>Product Description:</label>
                <input type="text" id="description" placeholder="product-description" className="text-input"/>
                <label>Product Image Link:</label>
                <input type="text" id="image_url" placeholder="product-image" className="text-input"/>
                <label>Amount of Products:</label>
                <input type="number" id="inventory_count" placeholder="product-amount" className="text-input" min="1"/>
                <button type="submit">Add Product</button>
            </form>
          </div>
        </div>
      );

};

export default AddProduct;