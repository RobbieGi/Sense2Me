import React, { useEffect, useState } from 'react';
import ProductShopPage from '../components/Users/ProductShopPage';
import NavBar from '../components/NavBar';
import './shop.css';

const basket = JSON.parse(sessionStorage.getItem('basket')) || [];

function Shop() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // State to track the selected product for the modal
  const filteredItems = items.filter((item) => item.inventory_count.N !== '0');
  const [remainingStock, setRemainingStock] = useState(null);

  function CheckStockLevels() {
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < basket.length; j++) {
        if (basket[j].sku === items[i].sku.S) {
          if (basket[j].amount > items[i].inventory_count.N) {
            console.log('Hello');
            const proceedWithReducedStock = window.confirm(
              'Not Enough Stock for: ' + basket[j].name + '. Being changed to: ' + items[i].inventory_count.N + '. Do you wish to proceed?'
            );

            if (proceedWithReducedStock) {
              basket[j].amount = items[i].inventory_count.N;
            } else {
              basket.splice(j, 1);
              console.log(basket);
            }

            sessionStorage.setItem('basket', JSON.stringify(basket));
          }
        }
      }
    }
  }

  useEffect(() => {
    fetch('https://y6wf50h2e4.execute-api.eu-west-1.amazonaws.com/dev/getProductDalek', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setItems(JSON.parse(data.body));
        console.log(JSON.parse(data.body));
      })
      .catch((error) => {
        console.error(error);
      });

    // Call CheckStockLevels here as well, to check stock levels after fetching data
    if (basket.length !== 0) {
      console.log('Checking Stock');
      CheckStockLevels();
    }
  }, []);

  useEffect(() => {
    if (basket.length !== 0 && items.length !== 0) {
      console.log("Checking Stock")
      CheckStockLevels();
    }
  }, [ items]);

  useEffect(() => {
    if (selectedItem !== null) {
      // Calculate the total amount in the basket
      let totalInBasket = 0;
      for (const item of basket) {
        if (item.sku === selectedItem.sku.S) {
          totalInBasket += item.amount;
        }
      }
  
      // Calculate the remaining stock after considering the items in the basket
      const stock = parseInt(selectedItem.inventory_count.N, 10);
      const remaining = stock - totalInBasket;
      setRemainingStock(remaining);
    }
  }, [basket, selectedItem]);

  function addToBasket() {
    if (remainingStock === 0) {
      alert("Maximum Stock Acquired");
    } else {
      let existingProductIndex = -1;
  
      for (let i = 0; i < basket.length; i++) {
        if (basket[i].sku === selectedItem.sku.S) {
          existingProductIndex = i;
          break;
        }
      }
  
      if (existingProductIndex !== -1) {
        console.log("Take Away one Existing Entry");
        basket[existingProductIndex].amount = parseInt(
          basket[existingProductIndex].amount,
          10
        ) + 1;
        setRemainingStock((prevStock) => prevStock - 1);
      } else {
        console.log("Take Away one New Entry");
        setRemainingStock((prevStock) => prevStock - 1);
        basket.push({
          sku: selectedItem.sku.S,
          price: selectedItem.price.N,
          name: selectedItem.name.S,
          image_url: selectedItem.image_url.S,
          description: selectedItem.description.S,
          amount: 1,
        });
      }
    }
  
    sessionStorage.setItem("basket", JSON.stringify(basket));
    // Optionally, you can update the basket size here if needed.  
  }

  function openModal(item) {
    setSelectedItem(item);
  }

  // Function to close the modal
  function closeModal() {
    setSelectedItem(null);
  }

  function calculateRemainingStock(item) {
    const stock = parseInt(item.inventory_count.N, 10);
    let totalInBasket = 0;

    for (const basketItem of basket) {
      if (basketItem.sku === item.sku.S) {
        totalInBasket += basketItem.amount;
      }
    }

    return stock - totalInBasket;
  }

  return (
    <>
      <div className="Shop">
        <NavBar />
        {/* Conditional rendering for wrapper-shop */}
        <div
          className="wrapper-shop"
          style={{ display: selectedItem ? 'none' : 'flex' }}
        >
          {filteredItems.length === 0 ? (
            <h2>No Stock Available</h2>
          ) : (
            filteredItems.map((item) => (
              <div key={item.sku.S} onClick={() => openModal(item)}>
                <ProductShopPage items={item} remainingStock={calculateRemainingStock(item) }/>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
{selectedItem !== null && (
  <div className="shop-modal">
    <div className="left-modal">
      <h2 id="shop-modal-name">{selectedItem.name.S}</h2>
      <img
        className="product-img-shop-modal"
        src={selectedItem.image_url.S}
        alt={selectedItem.description.S}
      />
    </div>
    <div className="right-modal">
      <h2>Description</h2>
      <p>{selectedItem.description.S}</p>
      <hr />
      <h5>Stock Amount: {remainingStock}</h5> {/* Display remaining stock */}
      <h5>Price: £{selectedItem.price.N}</h5>
      <hr />
      <button onClick={addToBasket}>Add to basket</button>
      <button onClick={closeModal}>Close</button>
    </div>
  </div>
)}
      </div>
    </>
  );
}

export default Shop;
