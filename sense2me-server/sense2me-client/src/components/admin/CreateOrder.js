import React, {useEffect, useState} from "react";

function CreateOrder(){
  
  const [items, setItems] = useState([]);
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [completedStatus, setCompletedStatus] = useState({});  

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
      const orderIDs = parsedData.map(order => order.order_ID);
      console.log("Order IDs:", orderIDs);
  
      // Fetch the completed status for each order separately
      Promise.all(orderIDs.map(orderID => {
        return fetch(`https://hp6uauau51.execute-api.eu-west-1.amazonaws.com/default/getOrderStatusDalek?order_ID=${orderID.S}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(response => response.json());
      })).then(dataArray => {
        // Handle the response data for completed status
        console.log("Completed statuses:", dataArray);
        // Assuming dataArray is an array of objects mapping order_ID to completed status
        const initialCompletedStatus = dataArray.reduce((acc, obj) => {
          const orderID = obj.order_ID;
          acc[orderID] = obj.completed;
          return acc;
        }, {});
        setCompletedStatus(initialCompletedStatus);
      });
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
      console.log(order)
      const newCompletedStatus = {
        ...completedStatus,
        [order]: !completedStatus[order],
      };
      setCompletedStatus(newCompletedStatus);
      const completed = newCompletedStatus[order];
  
      // Make the API call to update the completed status on the server
      fetch("https://v57gq0zo66.execute-api.eu-west-1.amazonaws.com/default/updateOrderCompletedDalek", {
        method: "PUT",
        body: JSON.stringify({ order_ID: order, completed: completed, email: sessionStorage.getItem("email") }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle response data if needed
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
                    <th>Completed</th>
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
                    <td><input type="checkbox" checked={completedStatus[order.order_ID.S]} onChange={() => handleCheckboxChange(order.order_ID.S)}/></td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
          </div>
      );
  
  }
  
  export default CreateOrder;