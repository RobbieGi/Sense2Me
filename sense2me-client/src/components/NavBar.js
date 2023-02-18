import React from "react";
import { NavLink } from "react-router-dom";

import "./NavBar.css"

function NavBar(){

    return(
        <div className="nav-back">
            <div className="nav">
                <div className="links-left">
                <h1>Sense2Me</h1>
                <h2><NavLink to='/' className="react-link" activeClassName="active">Home</NavLink></h2>
                <h2><NavLink to='/shop' className="react-link" activeClassName="react-link-disabled">Shop</NavLink></h2>
                <h2><NavLink to='/contact' className="react-link" activeClassName="react-link-disabled">Contact Us</NavLink></h2>
              </div>
              <div className="links-right">
                <h1><NavLink to='/login' className="react-link" activeClassName="react-link-disabled">Login</NavLink></h1>
              </div>
            </div>
        </div>
    );

}

export default NavBar;