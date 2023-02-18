import React from "react";
import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom";

import "./App.css"

//Customer Pages
import Shop from "./pages/shop";
import Home from "./pages/home";
import Product from "./pages/product";
import ContactUs from "./pages/contact-us";
import Login from "./pages/login"

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
      </Routes>
</BrowserRouter>
    
  );
}

export default App;
