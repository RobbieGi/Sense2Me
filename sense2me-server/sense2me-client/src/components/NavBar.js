import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state on component mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    sessionStorage.setItem("isAdmin", false);
    sessionStorage.setItem("isAuth", false);
  }

  function toggleSideNav() {
    setIsSideNavOpen(!isSideNavOpen);
  }

  return (
    <div className="nav-back">
      {isMobile && (
        <div className={`menu-icon ${isSideNavOpen ? "open" : ""}`} onClick={toggleSideNav}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
  
      {isMobile ? (
        <div className={`links ${isSideNavOpen ? "open" : ""} side-nav`}>
          <div className="main-links">
            <div className="brand">
              <h3>Sense2Me</h3>
            </div>
            <NavLink to="/" className="react-link" activeClassName="active">Home</NavLink>
            <NavLink to="/shop" className="react-link" activeClassName="react-link-disabled">Shop</NavLink>
            <NavLink to="/contact" className="react-link" activeClassName="react-link-disabled">Contact Us</NavLink>
            {sessionStorage.getItem("isAdmin") === "true" ? (
                <NavLink to="/admin-console" className="react-link" activeClassName="active">
                  Admin Console
                </NavLink>
            ) : (
            <NavLink to="/change-details" className="react-link" activeClassName="react-link-disabled">Change Details</NavLink>
            )}
          </div>
          <div className="bottom-links">
              <NavLink to="/basket" className="react-link" id="basket" activeClassName="react-link-disabled">
                <ion-icon name="basket-outline" id="basket"></ion-icon>
              </NavLink>
            {sessionStorage.getItem("name") ? (
              <div className="loggedIn">
                <h3 className="welcome-message">Welcome, {sessionStorage.getItem("name")}</h3>
                <div className="nav-link">
                    <NavLink to="/login" className="react-link" activeClassName="active" onClick={handleLogout}>
                      Logout
                    </NavLink>
                </div>
              </div>
            ) : (
              <div className="login">
                <div className="nav-link">
                    <NavLink to="/login" className="react-link" activeClassName="react-link-disabled">
                      Login
                    </NavLink>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="nav">
          <div className="links-left">
            <div className="brand">
              <h2>Sense2Me</h2>
            </div>
            <h2><NavLink to="/" className="react-link" activeClassName="active">Home</NavLink></h2>
            <h2><NavLink to="/shop" className="react-link" activeClassName="react-link-disabled">Shop</NavLink></h2>
            <h2><NavLink to="/contact" className="react-link" activeClassName="react-link-disabled">Contact Us</NavLink></h2>
            {sessionStorage.getItem("isAdmin") === "true" ? (
              <h2>
                <NavLink to="/admin-console" className="react-link" activeClassName="active">
                  Admin Console
                </NavLink>
              </h2>
            ) : (
              <h2><NavLink to="/change-details" className="react-link" activeClassName="react-link-disabled">Change Details</NavLink></h2>
            )}
          </div>
          <div className="links-right">
              {sessionStorage.getItem("name") ? (
                <div className="loggedIn">
                  <NavLink to="/basket" className="react-link" id="basket" activeClassName="react-link-disabled">
                    <ion-icon name="basket-outline" id="basket"></ion-icon>
                  </NavLink>
                  <h2 className="welcome-message">Welcome, {sessionStorage.getItem("name")}</h2>
                  <div className="nav-link">
                    <h2>
                      <NavLink to="/login" className="react-link" activeClassName="active" onClick={handleLogout}>
                        Logout
                      </NavLink>
                    </h2>
                  </div>
                </div>
              ) : (
                <div className="login">
                  <div className="nav-link">
                    <h2>
                      <NavLink to="/login" className="react-link" activeClassName="react-link-disabled">
                        Login
                      </NavLink>
                    </h2>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
  
}

export default NavBar;
