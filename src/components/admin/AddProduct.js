import React, { useEffect, useState, useRef } from "react";
import "./AddProduct.css";

function AddProduct() {
  const [items, setItems] = useState([]);
  const clientId = "b3b841aa3762b3d6c7882761ab49ab79"; // Replace with your actual Imgur client ID
  const fileInputRef = useRef(null); // Create a ref for the file input

  // Function to trigger click on the file input
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const form = document.getElementById("product-form");
    form.addEventListener("submit", handleFormSubmit);
    return () => {
      form.removeEventListener("submit", handleFormSubmit);
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
      if (item.sku.S) {
        return item.sku.S.toLowerCase() === lowerCaseSku;
      }
      return false;
    });

    return matchingItem;
  };

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file, file.name)
    console.log(formData)

    const url = 'https://api.imgbb.com/1/upload'; // Imgur API URL

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${clientId}`,
        },
      });

      if (response.status === 429) {
        const retryAfterHeader = response.headers.get('Retry-After');
        const retryAfter = parseInt(retryAfterHeader);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return uploadFile(file);
      }

      const responseData = await response.json();

      if (responseData.data && responseData.data.link) {
        sessionStorage.setItem("link", responseData.data.link)
        return responseData.data.link;
      } else {
        console.error('Unexpected response from Imgur:', responseData);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image to Imgur:', error);
      return null;
    }
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    const sku = document.getElementById("sku").value;
    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);
    const description = document.getElementById("description").value;
    const inventory_count = parseInt(document.getElementById("inventory_count").value);

    if (findProductBySku(sku)) {
      window.alert("Need a unique SKU as this is already in the system");
      return;
    }

    if (!name || !price || !description || !inventory_count || !sku) {
      window.alert("All fields are required.");
      return;
    }

    const fileInput = document.getElementById('file-input');
    const files = fileInput.files;

    if (files.length > 0) {
      try {
        const imageLinks = [];

        for (const file of files) {
          const imageLink = await uploadFile(file);
          if (imageLink) {
            console.log("Image Link" , imageLink)
            imageLinks.push(imageLink);
          }
        }

        const formData = {
          sku,
          name,
          price,
          description,
          inventory_count,
          imageLinks,
        };

        fetch("https://oeblau5cyl.execute-api.eu-west-1.amazonaws.com/dev/postProductDalek", {
          mode: "cors",
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (res.ok) {
              console.log(res);
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

        fileInput.value = '';
      } catch (error) {
        console.error('Error uploading images or submitting form:', error);
      }
    } else {
      console.log('No files selected for upload');
    }
  }

  return (
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
          <input type="file" id="file-input" accept="image/*"multiple style={{ display: "none" }} ref={fileInputRef}
          />
          <button type="button" onClick={handleBrowseClick}>Browse</button>
          <label>Amount of Products:</label>
          <input type="number" id="inventory_count" placeholder="product-amount" className="text-input" min="1"/>
          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
