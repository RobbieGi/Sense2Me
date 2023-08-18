import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import "./App.css"

//Customer Pages
import Shop from "./pages/shop";
import Home from "./pages/home";
import Product from "./pages/product";
import ContactUs from "./pages/contact-us";
import Login from "./pages/login"
<<<<<<< Updated upstream:sense2me/src/App.js
=======
import CreateUser from "./pages/Users/CreateUser"
import Basket from "./pages/Users/Basket";
import ChangeDetails from "./components/Users/changeDetails";
>>>>>>> Stashed changes:sense2me-client/src/App.js

//Admin Pages
import AddProduct from "./components/admin/AddProduct";
import AdminConsole from "./pages/admin/admin-console";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route path="/shop" element={<Shop />} />
        <Route path="/product" element={<Product />} />
        <Route path="/contact" element={<ContactUs />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/add-product" element={<AddProduct />}/>
        <Route path="/admin-console" element={<AdminConsole />}/>
<<<<<<< Updated upstream:sense2me/src/App.js
=======
        <Route path="/createUser" element={<CreateUser />}></Route>
        <Route path="/basket" element={<Basket />}></Route>
        <Route path="/change-details" element={<ChangeDetails />}></Route>
>>>>>>> Stashed changes:sense2me-client/src/App.js
      </Routes>
</BrowserRouter>
    
  );
}

export default App;
