import React, { useEffect, useState } from "react";

// import "./UpdateProduct.css";

function DeleteProduct() {
  const [product, setProduct] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    fetch("https://y6wf50h2e4.execute-api.eu-west-1.amazonaws.com/dev/getProductDalek")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Request failed with status: " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        const parsedData = JSON.parse(data.body);
        console.log(parsedData)
        setProduct(parsedData);
        setIsLoading(false); // Set loading to false when data is loaded
      })
      .catch((error) => {
        console.error("Error: " + error);
        setIsLoading(false); // Set loading to false on error as well
      });
  }, []);

  useEffect(() => {
    if (product.length > 0) {
      updateFormValues(currentIndex);
    }
  }, [product, currentIndex]);

  function updateFormValues(index) {
    if (product.length > 0) {
      const currentItem = product[index];
      console.log(currentItem.sku.S)
      document.getElementById("sku").value = currentItem.sku.S;
      document.getElementById("name").value = currentItem.name.S;
      document.getElementById("price").value = currentItem.price.N;
      document.getElementById("description").value = currentItem.description.S;
      document.getElementById("image").value = currentItem.image_url.S;
      document.getElementById("inventory_count").value = currentItem.inventory_count.N;
    }
  }

  function changeLeft() {
    if (currentIndex === 0) {
      alert("No More Records");
    } else {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  }

  function changeRight() {
    if (currentIndex === product.length - 1) {
      alert("No More Records");
    } else {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  }

  function handleForm(event) {
    event.preventDefault();

    const sku = document.getElementById("sku").value;

    fetch("https://gizg35elgg.execute-api.eu-west-1.amazonaws.com/default/deleteProductDalek", {
      mode: "cors",
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sku: sku,
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed to replace product');
    })
    .then(data => {
      window.alert("Product Deleted");
      document.getElementById("product-form").reset();
      window.location.reload();
    })
    .catch(error => {
      console.error('Error replacing product:', error);
    });
  }

  return (
    <div className="AddProduct">
      <div className="content-main">
        <div className="container">
          {isLoading ? ( // Check if data is loading
            <p>Fetching products...</p> // Display loading message
          ) : (
            product.length > 0 && ( // Only render form when data is available
            <form id="product-form" onSubmit={handleForm}>
            <label>Delete Product</label>
            <label>SKU:</label>
            <input type="text" id="sku" placeholder="product-name" className="text-input" readOnly/>
            <label>Product Name:</label>
            <input type="text" id="name" placeholder="product-name" className="text-input" />
            <label>Product Price:</label>
            <input type="float" id="price" placeholder="product-price" className="text-input" />
            <label>Product Description:</label>
            <input type="text" id="description" placeholder="product-description" className="text-input" />
            <label>Product Image Link:</label>
            <input type="text" id="image" placeholder="product-image" className="text-input" />
            <label>Amount of Products:</label>
            <input type="number" id="inventory_count" placeholder="product-amount" className="text-input" min="1" />
            <button type="submit">Delete Product</button>
          </form>
            )
          )}
          {isLoading || ( // Disable buttons while loading
            <>
              <button className="movementBtns" onClick={changeLeft} disabled={isLoading}>
                Backwards
              </button>
              <button className="movementBtns" onClick={changeRight} disabled={isLoading}>
                Forwards
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeleteProduct;