import React, { useEffect } from "react";

import "./AddProduct.css";

function AddProduct(){

  useEffect(() => {
    const form = document.getElementById("product-form");
    form.addEventListener("submit", handleForm);
    return () => {
      form.removeEventListener("submit", handleForm);
    };
  }, []);

  function handleForm(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").value;

    // Validation
    if (!name || !price || !description || !image) {
      window.alert("All fields are required.");
      return;
    }

    console.log(name, price, description, image);
    // use the values for further processing

    fetch(process.env.REACT_APP_API, {
      mode: "cors", 
      method:"POST", 
      body: JSON.stringify({
        name: name, 
        price: price, 
        description: description,
        image: image
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('Request failed!');
    })
    .then(data => {
      window.alert("Posted Correctly");
      document.getElementById("product-form").reset();
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }
    
      return(
        <div className="AddProduct">
          <div className="content-main">
              <form id="product-form">
                <label>Product Name:</label>
                <input type="text" id="name" placeholder="product-name" className="text-input"/>
                <label>Product Price:</label>
                <input type="text" id="price" placeholder="product-price" className="text-input"/>
                <label>Product Description:</label>
                <input type="text" id="description" placeholder="product-description" className="text-input"/>
                <label>Product Image Link:</label>
                <input type="text" id="image" placeholder="product-image" className="text-input"/>
                <button type="submit">Add Product</button>
            </form>
          </div>
        </div>
      );

};

export default AddProduct;
