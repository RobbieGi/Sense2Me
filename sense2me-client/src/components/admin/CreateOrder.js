import React, {useEffect, useState} from "react";

function CreateOrder(){
  
  const [items, setItems] = useState([]);
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [completedStatus, setCompletedStatus] = useState({});  
  const [orderTrackingNumbers, setOrderTrackingNumbers] = useState({});

  useEffect(() => {
    fetch('https://1blnclstr9.execute-api.eu-west-1.amazonaws.com/default/getOrdersDalek', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      const parsedData = JSON.parse(data.body);
      console.log("API Response Data:", parsedData);
      setItems(parsedData);
      
      console.log("Parsed Data:", parsedData);

      // Extract the order IDs and completed statuses from the parsed data
      const initialCompletedStatus = parsedData.reduce((acc, order) => {
        const orderID = order.order_ID.S;
        const completed = order.completed.BOOL;
        acc[orderID] = completed;
        return acc;
      }, {});
      
      setCompletedStatus(initialCompletedStatus);

      const initialOrderTrackingNumbers = parsedData.reduce((acc, order) => {
        acc[order.order_ID.S] = order.RMtracker.S; // assuming RMtracker is the key for the order tracking number
        return acc;
      }, {});
  
      setOrderTrackingNumbers(initialOrderTrackingNumbers);
      console.log("Initial Tracking Numbers:", orderTrackingNumbers);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);

    const handleSort = (key) => {
      if (key === sortKey) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortOrder("asc");
      }
    };
  
    const sortedItems = items.slice().sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];
    
      if (valueA === undefined || valueA === null) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valueB === undefined || valueB === null) {
        return sortOrder === "asc" ? 1 : -1;
      }
    
      // Check if the values are numbers
      const isNumericA = !isNaN(parseFloat(a.price.N)) && isFinite(a.price.N);
      const isNumericB = !isNaN(parseFloat(b.price.N)) && isFinite(b.price.N);
    
      if (isNumericA && isNumericB) {
        console.log("Hello numbers");
        const numericA = parseFloat(a.price.N);
        const numericB = parseFloat(b.price.N);
        return sortOrder === "asc" ? numericA - numericB : numericB - numericA;
      } else {
        console.log("Hello strings");
        const stringValueA = String(valueA).toLowerCase();
        const stringValueB = String(valueB).toLowerCase();
        return sortOrder === "asc" ? stringValueA.localeCompare(stringValueB) : stringValueB.localeCompare(stringValueA);
      }
    });
    
    const handleCheckboxChange = (order) => {
      const newCompletedStatus = {
        ...completedStatus,
        [order.order_ID.S]: !completedStatus[order.order_ID.S],
      };
      setCompletedStatus(newCompletedStatus);
    
      const completed = newCompletedStatus[order.order_ID.S];
      console.log("Completed: ", completed);
    
      const tracker = window.prompt("Enter Royal Mail Tracking Number: ");
      console.log(tracker);
    
      // Make the API call to update the completed status and RMtracker
      fetch("https://v57gq0zo66.execute-api.eu-west-1.amazonaws.com/default/updateOrderCompletedDalek", {
        method: "PUT",
        body: JSON.stringify({ order_ID: order.order_ID.S, completed: completed, email: order.email.S, RMtracker: tracker }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle response data if needed
          console.log("API Response after update:", data);
    
          // Update the local state with the new completed status and tracking number
          const updatedCompletedStatus = {
            ...completedStatus,
            [order.order_ID.S]: completed,
          };
          setCompletedStatus(updatedCompletedStatus);
    
          const updatedTrackingNumbers = {
            ...orderTrackingNumbers,
            [order.order_ID.S]: tracker,
          };
          console.log("Updated Tracking Numbers:", updatedTrackingNumbers);
          setOrderTrackingNumbers(updatedTrackingNumbers);
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
    };

      return(
          <div className="CreateAdmin">
              <div className="content-main">
              <table>
                <thead>
                <tr>
                    <th onClick={() => handleSort("date")}>Date</th>
                    <th>OrderID</th>
                    <th onClick={() => handleSort("price")}>Price</th>
                    <th>Items (Name, Amount)</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Completed</th>
                    <th>RM Tracker</th>
                </tr>
                </thead>
                <tbody>
                {sortedItems.map((order, index) => (
                  <tr key={index}>
                    <td>{order.dateOrder.S}</td>
                    <td>{order.order_ID.S}</td>
                    <td>{order.price.N}</td>
                    <td>{order.items.L.map((item) => {
                        const name = item.M.name?.S || "N/A";
                        const amount = item.M.amount?.N || "N/A";
                        return `(${name}, ${amount})`;
                      }).join(", ") || ""
                    }</td>
                    <td>{order.userID.S}</td>
                    <td>{order.email.S}</td>
                    <td><input type="checkbox" checked={completedStatus[order.order_ID.S]} onChange={() => handleCheckboxChange(order, order.completed.BOOL)}/></td>
                    <td>{orderTrackingNumbers[order.order_ID.S]}</td>
                    {console.log("Tracker", orderTrackingNumbers[order.order_ID.S])}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
          </div>
      );
  
  }
  
  export default CreateOrder;