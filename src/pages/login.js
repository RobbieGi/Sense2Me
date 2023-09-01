import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "./login.css";
import NavBar from "../components/NavBar";

function Login() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('https://d93b7k76j9.execute-api.eu-west-1.amazonaws.com/default/getAllUsersDalek', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      const parsedData = JSON.parse(data.body);
      console.log("body", parsedData);
      setUsers(parsedData);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);

  const handleForm = event => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password1 = document.getElementById("password").value;

    if (!username || !password1) {
      window.alert("All fields are required.");
      return;
    }

    const foundUser = users.find(user => user.userID.S === username);

    if (foundUser) {
      sessionStorage.setItem("email", foundUser.email.S);
      sessionStorage.setItem('name', username);
      sessionStorage.setItem('isAdmin', foundUser.isAdmin.BOOL);
      sessionStorage.setItem('isAuth', true);
      // Redirect to the appropriate page based on the user type
      if (foundUser.isAdmin.BOOL) {
        window.location.href = "/admin-console";
      } else {
        window.location.href = "/shop";
      }
    } else {
      window.alert("No Users Found!!!");
    }
    document.getElementById("login").reset();
  }

  return (
    <div className="Login">
      <NavBar />
      <div className="content-main">
        <form id="login" onSubmit={handleForm}>
          <label>Username:</label>
          <input type="text" id="username" placeholder="Username" className="text-input" />
          <label>Password:</label>
          <input type="password" id="password" placeholder="Confirm Password" className="text-input" />
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