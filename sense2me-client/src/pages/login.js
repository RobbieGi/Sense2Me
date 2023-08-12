import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';

import "./login.css";

import NavBar from "../components/NavBar";

function Login(){

  const [users, setUsers] = useState([])

    useEffect(() => {
        const form = document.getElementById("login");
        form.addEventListener("submit", handleForm);
        return () => {
          form.removeEventListener("submit", handleForm);
        };
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
      }, [])

      function handleForm(event) {

        event.preventDefault();

          const username = document.getElementById("username").value;
          const password1 = document.getElementById("password").value;
      
          if (!username || !password1) {
            window.alert("All fields are required.");
            return;
          }
      
          fetch("https://d93b7k76j9.execute-api.eu-west-1.amazonaws.com/default/getUsersDalekv2", {
    mode: "cors",
    method: "POST",
    body: JSON.stringify({
      name: username,
      password: password1
    }),
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      console.error('Error in response:', response);
      throw new Error('Network response was not ok.');
    }
  })
  .then(data => {
    console.log(data);

    if (data.error) {
      alert(data.error);
    } else {
      const isAdmin = JSON.parse(data.body).isAdmin;
      console.log("Users Array", users)

      for (let i = 0; i < users.length; i++) {
        console.log("Input: ",username, "DB ", users[i].userID.S)
        if(username === users[i].userID.S){
          sessionStorage.setItem("email", users[i].email.S)
        }
      }

      sessionStorage.setItem('name', username);
      sessionStorage.setItem('isAdmin', isAdmin);
      sessionStorage.setItem('isAuth', true);
      
      document.getElementById("login").reset();
      // if(isAdmin){
      //   window.location.href = "/admin-console"
      // }else{
      //   window.location.href = "/shop"
      // }
    }
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}
    
        return(
            <div className="Login">
                <NavBar />
                <div className="content-main">
                  <form id="login">
                    <label>Username:</label>
                    <input type="text" id="username" placeholder="Username" className="text-input"/>
                    <label>Password:</label>
                    <input type="password" id="password" placeholder="Confirm Password" className="text-input"/>
                    <button type="submit">Login</button>
                    <Link to="/createUser">
                      <button>Create User</button>
                    </Link>
                </form>
              </div>
            </div>
        );
    
    }

export default Login;