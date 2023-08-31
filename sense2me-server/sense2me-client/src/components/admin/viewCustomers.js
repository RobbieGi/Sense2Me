import React, { useEffect, useState } from "react";

import "./viewCustomers.css";

function ViewCustomers(){

    let i = 0;
    const [users, setUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        fetch("https://d93b7k76j9.execute-api.eu-west-1.amazonaws.com/default/getAllUsersDalek")
        .then(res => {
            if (!res.ok){
                throw new Error("Request failed with status: " + res.status);
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            setUsers(data.map((user) => ({ ...user })));
            console.log(users);
            document.getElementById("id").value=users[i]._id 
            document.getElementById("name").value=users[i].name
            document.getElementById("email").value=users[i].email 
        })
        .catch(error => {
            console.error("Error: " + error)
        })
    }, [])

    useEffect(() => {
        if (users.length > 0) {
          updateFormValues(currentIndex);
        }
      }, [users, currentIndex]);
    
      function updateFormValues(index) {
        document.getElementById("id").value = users[index]._id;
        document.getElementById("name").value = users[index].name;
        document.getElementById("email").value = users[index].email;
      }
    
      function changeLeft() {
        if (currentIndex === 0) {
          alert("No More Records");
        } else {
          setCurrentIndex(currentIndex - 1);
        }
      }
    
      function changeRight() {
        if (currentIndex === users.length - 1) {
          alert("No More Records");
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }

    return(
        <div className="ViewCustomers">
            <div className="content-main">
              <div className="form">
                <form id="viewCustomers">
                  <label>ID:</label>
                  <input type="text" id="id" className="text-input"/>
                  <label>Name:</label>
                  <input type="text" id="name" className="text-input"/>
                  <label>Email:</label>
                  <input type="text" id="email" className="text-input"/>
                </form>
              </div>
              <div className="buttons">
                <button className="movementBtns" onClick={changeLeft}>Backwards</button>
                <button className="movementBtns" onClick={changeRight}>Forwards</button>
            </div>
          </div>
          
        </div>
    );
}

export default ViewCustomers;