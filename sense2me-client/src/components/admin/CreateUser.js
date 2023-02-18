import React, {useEffect} from "react";

import "./CreateUser.css";

// const bcrypt = require('bcrypt');

function CreateUser(){

  useEffect(() => {
    const form = document.getElementById("create-user");
    form.addEventListener("submit", handleForm);
    return () => {
      form.removeEventListener("submit", handleForm);
    };
  }, []);

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

//    bcrypt.hash(password2, salt, function(err, hash) {
//      if (err) {
//        console.log(err)
//      } else {
//        // save the hash and salt to the database
//        const passwordHash = hash;
//        const passwordSalt = salt;
//        console.log('password hash:', passwordHash);
//        console.log('password salt:', passwordSalt);
//      }
//    });

    fetch(process.env.REACT_APP_API + "/user", {
      mode: "cors", 
      method:"POST", 
      body: JSON.stringify({
        name: username, 
        email: email, 
        password: password2,
        isAdmin: true
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
      document.getElementById("create-user").reset();
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }

    return(
        <div className="CreateUser">
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