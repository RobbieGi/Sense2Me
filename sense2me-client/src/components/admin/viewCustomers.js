import React, { useEffect, useState } from "react";
import "./viewCustomers.css";

function ViewCustomers() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  var totalOrders = 0;
  var activeOrders = 0;

  useEffect(() => {
    fetch('https://1blnclstr9.execute-api.eu-west-1.amazonaws.com/default/getOrdersDalek')
      .then(response => response.json())
      .then(data => {
        setOrders(JSON.parse(data.body));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetch("https://d93b7k76j9.execute-api.eu-west-1.amazonaws.com/default/getAllUsersDalek")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Request failed with status: " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        const parsedData = JSON.parse(data.body);
        console.log(parsedData)
        setUsers(parsedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error: " + error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      updateFormValues(currentIndex);
    }
  }, [users, currentIndex]);

  function updateFormValues(index) {
    if (users[index]) {
      const currentUser = users[index];
      console.log("Current User: ", currentUser);
  
      let customerTotalOrders = 0; // Initialize counters for the current customer
      let customerActiveOrders = 0;
  
      for (let j = 0; j < orders.length; j++) {
        const order = orders[j];
        console.log("Order ", j, ": ", order);
  
        if (order.userID.S === currentUser.userID.S) {
          customerTotalOrders += 1; // Increment total orders for the current customer
  
          if (!order.completed.BOOL) {
            customerActiveOrders += 1; // Increment active orders for the current customer
          }
        }
      }
  
      totalOrders = customerTotalOrders; // Assign customer counters to the global counters
      activeOrders = customerActiveOrders;
  
      console.log("Active Orders: ", activeOrders, ", Total Orders: ", totalOrders);
  
      document.getElementById("id").value = currentUser.userID.S;
      document.getElementById("address").value = currentUser.address.S;
      document.getElementById("email").value = currentUser.email.S;
      document.getElementById("totOrders").value = totalOrders;
      document.getElementById("actOrders").value = activeOrders;
    }
  }

  function changeLeft() {
    if (currentIndex === 0) {
      alert("No More Records");
    } else {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      updateFormValues(currentIndex - 1);
    }
  }

  function changeRight() {
    if (currentIndex === users.length - 1) {
      alert("No More Records");
    } else {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      updateFormValues(currentIndex + 1);
    }
  }

  return (
    <div className="ViewCustomers">
      <div className="content-main">
        <div className="form">
          <form id="viewCustomers">
            <label>ID:</label>
            <input type="text" id="id" className="text-input" readOnly />
            <label>Address:</label>
            <input type="text" id="address" className="text-input" />
            <label>Email:</label>
            <input type="text" id="email" className="text-input" />
            <label>Total Orders:</label>
            <input type="text" id="totOrders" className="text-input" />
            <label>Active Orders:</label>
            <input type="text" id="actOrders" className="text-input" />
          </form>
        </div>
        <div className="buttons">
          <button className="movementBtns" onClick={changeLeft} disabled={isLoading}>
            Backwards
          </button>
          <button className="movementBtns" onClick={changeRight} disabled={isLoading}>
            Forwards
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewCustomers;
