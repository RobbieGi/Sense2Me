import React, {useEffect, useState} from "react";
import NavBar from "../../components/NavBar";

import "./CreateUser.css";

//hashings & salt
const crypto = require('crypto-browserify');

function CreateUser(){

  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('https://y6wf50h2e4.execute-api.eu-west-1.amazonaws.com/dev/getProductDalek', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.parse(data.body));
      })
      .catch((error) => {
        console.error(error);
      });
    }, []);

    useEffect(() => {
      fetch('https://d93b7k76j9.execute-api.eu-west-1.amazonaws.com/default/getAllUsersDalek', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("body", JSON.parse(data.body))
          setUsers(JSON.parse(data.body));
          console.log(JSON.parse(data.body));
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

  useEffect(() => {
    const form = document.getElementById("create-user");
    form.addEventListener("submit", handleForm);
    return () => {
      form.removeEventListener("submit", handleForm);
    };
  }, []);

  function checkDetails(uname){
    console.log("Inside the Checking Username")
    for (let i = 0; i < users.length; i++) {
      console.log("Input: ",uname, "DB ", users[i].userID.S)
      if(uname === users[i].userID.S){
        return true;
      }
    }
  }

  function handleForm(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password1 = document.getElementById("password").value;
    const password2 = document.getElementById("password-final").value;

    // Validation
    if(password1 !== password2){
      window.alert("Passwords do not match");
      return;
    }

    if (!username || !email || !password1) {
      window.alert("All fields are required.");
      return;
    }

    //hash and salt
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordWithSalt = password2 + salt;
    console.log(salt);
    const hash = crypto.createHash('sha256').update(passwordWithSalt).digest('hex');

    if(!checkDetails(username)){
      fetch("https://bfigqxbjve.execute-api.eu-west-1.amazonaws.com/default/postCreateOrder", {
      mode: "cors", 
      method:"POST", 
      body: JSON.stringify({
        name: username, 
        email: email, 
        password: hash,
        salt: salt,
        isAdmin: false
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      if (res.status === 409) {
        // User already exists, show alert message
        window.alert('User already exists with this email');
      }})
    .then(data => {
      window.alert("Posted Correctly");
      document.getElementById("create-user").reset();
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
    }
    else{
      window.alert("Username already exists")
    }
    
  }

    return(
        <div className="CreateUser">
          <NavBar />
            <div className="content-main">
              <form id="create-user">
                <label>Username:</label>
                <input type="text" id="username" placeholder="Username" className="text-input"/>
                <label>Email:</label>
                <input type="text" id="email" placeholder="Email" className="text-input"/>
                <label>Password:</label>
                <input type="password" id="password" placeholder="Password" className="text-input"/>
                <label>Confirm Password:</label>
                <input type="password" id="password-final" placeholder="Confirm Password" className="text-input"/>
                <button type="submit">Create</button>
            </form>
          </div>
        </div>
    );

}

export default CreateUser;