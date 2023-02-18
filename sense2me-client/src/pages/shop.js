import React from 'react';
import {Link} from "react-router-dom";

import ProductShopPage from "../components/ProductShopPage";
import NavBar from "../components/NavBar";

import useRequest from "../api/get-api";
// import usePostRequest from '../api/post-api';

import "./shop.css";

function Shop() {

    const results = useRequest();
    // const post = usePostRequest();

    return(
        <>
            <div className="Shop">
                <NavBar/>
                <div className="wrapper-shop">  
                {results.map((item) => (
                    <Link key={item.name} to={{ pathname: "/product", state: { item } }} className="product-link">
                        <ProductShopPage items={item} />
                    </Link>
                    ))}
                </div>  
            </div>   
        </>    
    ); 
} 

export default Shop;