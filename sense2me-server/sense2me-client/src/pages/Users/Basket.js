import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import NavBar from "../../components/NavBar";
import Modal from "../../components/Modal/confirmModal.js"; // Import your Modal component
import "./Basket.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Basket() {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [basket, setBasket] = useState(JSON.parse(sessionStorage.getItem("basket")) || []);
  const [loading, setLoading] = useState(true);
  const [lowStock, setLowStock] = useState([]);
  const newLowStock = [];

  const notify = (message)=> {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }

  useEffect(() => {
    // Check if a successful order was placed and display a toast notification
    if (localStorage.getItem("successfulOrderPlaced")) {
      notify("Order Placed Successfully");
      // Clear the flag from localStorage after displaying the toast
      localStorage.removeItem("successfulOrderPlaced");
    }
  
    // Other useEffect code
  }, []);

 const handleConfirm = () => {
  // Update the basket item to match the database amount
  const updatedBasket = [...basket];
  const basketProduct = updatedBasket.find(item => item.sku === modalMessage.sku);
  if (basketProduct) {
    basketProduct.amount = modalMessage.inventory_count.N;
    setBasket(updatedBasket);
    sessionStorage.setItem("basket", JSON.stringify(updatedBasket));
  }

  setShowModal(false); // Close the modal
};

  const handleCancel = () => {
    setShowModal(false);
  };

  const openModalWithMessage = (message) => {
    console.log("Opening Modal")
    setModalMessage(message);
    setShowModal(true);
  };

  useEffect(() => {
    fetch('https://y6wf50h2e4.execute-api.eu-west-1.amazonaws.com/dev/getProductDalek')
      .then(response => response.json())
      .then(data => {
        setProducts(JSON.parse(data.body));
        console.log(products)
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  function CheckStockLevels() {
    for (let j = 0; j < basket.length; j++) {
      const basketProduct = basket[j];
      const productInBasket = products.find(
        (product) => product.sku.S === basketProduct.sku
      );

      if (productInBasket) {
        console.log("Product in Basket")
        handleStockCheck(basketProduct, productInBasket);

        const remainingProduct = productInBasket.inventory_count.N - basketProduct.amount;
        console.log(remainingProduct);

        if (remainingProduct <= 3) {
          console.log(
            "Low Stock for: ",
            productInBasket.name.S,
            " Amount Left: ",
            remainingProduct
          );

          const itemAlreadyInLowStock = newLowStock.some(
            (item) => item.name.S === productInBasket.name.S
          );

          productInBasket.lowEmailSent.BOOL = true;
          productInBasket.inventory_count.N = remainingProduct;
          console.log("product", productInBasket);

          if (!itemAlreadyInLowStock && productInBasket.lowEmailSent === true) {
            newLowStock.push(productInBasket);
          }
        }
      }
    }
  }

  function handleStockCheck(basketProduct, productInBasket) {
    console.log("Modal Check Function")
    console.log("Database Amount: ", productInBasket.inventory_count.N, "Amount in Basket: ", basketProduct.amount)
    if (basketProduct.amount > productInBasket.inventory_count.N) {
      console.log("Amount Greater in basket")
      openModalWithMessage(
        "Not Enough Stock for: " +
        basketProduct.name +
        ". Being changed to: " +
        productInBasket.inventory_count.N +
        ". Do you wish to proceed?", basketProduct, productInBasket
      );
    }
  }

  function checkMaxStock(index) {
    for (let i = 0; i < products.length; i++) {
      if (products[i].sku.S === basket[index].sku) {
        if (products[i].inventory_count.N > basket[index].amount) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  function add(index) {
    if (checkMaxStock(index)) {
      const updatedBasket = [...basket];
      updatedBasket[index].amount += 1;
      setBasket(updatedBasket);
      sessionStorage.setItem("basket", JSON.stringify(updatedBasket));
    } else {
      alert("Max Amount Reached");
    }
  }
  
  function subtract(index) {
    const updatedBasket = [...basket];
    updatedBasket[index].amount -= 1;
    if (updatedBasket[index].amount === 0) {
      updatedBasket.splice(index, 1);
    }
    setBasket(updatedBasket);
    sessionStorage.setItem("basket", JSON.stringify(updatedBasket));
  }

  function formatDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    
    return `${year}-${month}-${day}`;
  }

  function updateStockOnServer(product) {

    var newStockAmount = 0;

    for(let i = 0; i < products.length; i++){
      console.log("In For Loop")
      if(products[i].sku.S === product.sku){
        //newStockAmount = products[i].inventory_count.N - product.amount
        newStockAmount = products[i].inventory_count.N
        console.log("New Stock Number: ", newStockAmount, "DB Inventory Count", products[i].inventory_count.N, "Amount Purchased: ", product.amount)
      }
    }

    fetch("https://0e93bn4q21.execute-api.eu-west-1.amazonaws.com/default/updateProductDalek", {
    method: "PUT",
    body: JSON.stringify({
      sku: product.sku,
      inventory_count: newStockAmount

   }),
    headers: {
    "Content-Type": "application/json",
  },
})
  .then(response => response.json())
  .then(data => {
    // Handle the response from the server if needed
  })
  .catch(error => {
    console.error("Error updating product stock:", error);
  });
  }
  
  function CheckOut() {
    if (basket.length !== 0) {
      const order_ID = "S2M_" + uuidv4();
      let items = [];
      let price = 0;
  
      CheckStockLevels();
  
      for (let i = 0; i < basket.length; i++) {
        items.push({
          sku: basket[i].sku,
          name: basket[i].name,
          amount: basket[i].amount,
          price: basket[i].price,
        });
        price += basket[i].amount * basket[i].price;
      }
  
      const userID = sessionStorage.getItem("name");
  
      // Make the API call to post the order to the server
      fetch("https://3nh8ubnqrh.execute-api.eu-west-1.amazonaws.com/default/postOrderDalek", {
        method: "POST",
        body: JSON.stringify({
          order_ID,
          userID,
          price,
          items,
          dateOrder: formatDate(),
          completed: false,
          newLowStock: newLowStock,
          email: sessionStorage.getItem("email"),
        }),
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
          localStorage.setItem("successfulOrderPlaced", "true");
          console.log(data);
          sessionStorage.removeItem("basket");
          //window.location.reload();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
  
      // Update the stock on the server for each item in the basket
      for (let i = 0; i < basket.length; i++) {
        updateStockOnServer(basket[i]);
      }
    }
  }

  return (
    <div className="wrapper">
      <NavBar />
      <div className="content-main-basket">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Amount</th>
            <th>Image</th>
            <th>Description</th>
            <th>Buttons</th>
          </tr>
        </thead>
        <tbody>
          {basket.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.amount}</td>
              <td>
                <img
                  src={product.image_url}
                  id="basket-img"
                  alt="Product 1"
                  width="50"
                  height="50"
                />
              </td>
              <td>{product.description}</td>
              <td>
                <button onClick={() => add(index)}>Add</button>
                <button onClick={() => subtract(index)}>Subtract</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button">
        <button id="basket-CheckOut" onClick={CheckOut}>
          Check Out
        </button>
      </div>
        {console.log("showModal value:", showModal)}
        {showModal && (
          <Modal
            message={modalMessage}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            style={{ display: showModal ? "block" : "none" }}
          />
        )}
      </div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    </div>
  );
}

export default Basket;
