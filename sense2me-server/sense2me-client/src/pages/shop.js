import React, { useEffect, useState } from 'react';
import ProductShopPage from '../components/Users/ProductShopPage';
import NavBar from '../components/NavBar';
import './shop.css';

const basket = JSON.parse(sessionStorage.getItem('basket')) || [];

function Shop() {
  const [items, setItems] = useState([]);
  const filteredItems = items.filter((item) => item.inventory_count.N !== '0');

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

  return (
    <>
      <div className="Shop">
        <NavBar />
        <div className="wrapper-shop">
          {filteredItems.length === 0 ? (
            <h2>No Stock Available</h2>
          ) : (
            filteredItems.map((item) => <ProductShopPage key={item.sku.S} items={item} />)
          )}
        </div>
      </div>
    </>
  );
}

export default Shop;
