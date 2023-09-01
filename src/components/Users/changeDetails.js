import React, { useEffect, useState } from "react";

import NavBar from "../NavBar";

import "./changeDetails.css"

const crypto = require('crypto-browserify');

function ChangeDetails() {
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const [user, setUser] = useState([]);

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
        const foundUser = parsedData.find((user) => user.userID.S === sessionStorage.getItem("name"));
        console.log("Found User", foundUser)
        setUser(foundUser)
        setIsLoading(false); // Set loading to false when data is loaded
      })
      .catch((error) => {
        console.error("Error: " + error);
        setIsLoading(false); // Set loading to false on error as well
      });
  }, []);

  function updateFormValues() {
      console.log("User", user)
      console.log("Updating Form")
      document.getElementById("username").value = user.userID.S;
      document.getElementById("email").value = user.email.S;
      document.getElementById("address").value = user.address.S;
  }

  function handleForm(event) {
    event.preventDefault();

      const userID = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const address = document.getElementById("address").value;
      const password = document.getElementById("password").value;

      var body = {}

      if(password === ""){
        body = {
          userID: userID,
          email: email,
          address: address,
        }
      }else{
        const salt = crypto.randomBytes(16).toString('hex');
        const passwordWithSalt = password + salt;
        console.log(salt);
        const hash = crypto.createHash('sha256').update(passwordWithSalt).digest('hex');
        body = {
          userID: userID,
          email: email,
          address: address,
          password: hash,
          salt: salt
        }
      }

    fetch("https://n4feqgkz3g.execute-api.eu-west-1.amazonaws.com/default/updateDetailsDalek", {
      mode: "cors",
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed to replace product');
    })
    .then(data => {
      window.alert("Details Changed");
      document.getElementById("product-form").reset();
      window.location.reload();
    })
    .catch(error => {
      console.error('Error replacing product:', error);
    });
  }

  return (
    <div className="AddProduct">
        <NavBar />
      <div className="content-main" >
        <div className="container">
          {isLoading ? ( // Check if data is loading
            <p>Fetching products...</p> // Display loading message
          ) : (
             // Only render form when data is available
            <form id="product-form" onSubmit={handleForm}>
            <label>Change Details</label>
            <label>Username:</label>
            <input type="text" id="username" placeholder="Username" className="text-input" readOnly value={user.userID.S} />
            <label>Email:</label>
            <input type="text" id="email" placeholder="Email" className="text-input" value={user.email.S} />
            <label>Address:</label>
            <input type="text" id="address" placeholder="Address" className="text-input" value={user.address.S} />
            <label>Password:</label>
            <input type="text" id="password" placeholder="Password" className="text-input" />
            <button type="submit">Update Details</button>
          </form>
            
          )}
        </div>
      </div>
    </div>
  );
}

export default ChangeDetails;