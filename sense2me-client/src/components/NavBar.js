import { NavLink } from "react-router-dom";

import "./NavBar.css"

function NavBar() {

  function handleLogout(){
    sessionStorage.removeItem("name")
    sessionStorage.removeItem("email")
    sessionStorage.setItem('isAdmin', false)
    sessionStorage.setItem('isAuth', false)
  }

  return (
    <div className="nav-back">
      <div className="nav">
        <div className="links-left">
          <h1>Sense2Me</h1>
          <h2><NavLink to='/' className="react-link" activeClassName="active">Home</NavLink></h2>
          <h2><NavLink to='/shop' className="react-link" activeClassName="react-link-disabled">Shop</NavLink></h2>
          <h2><NavLink to='/contact' className="react-link" activeClassName="react-link-disabled">Contact Us</NavLink></h2>
          </div>
      <div className="links-right">
      <NavLink to='/basket' className="react-link" id="basket" activeClassName="react-link-disabled"><ion-icon name="basket-outline" id="basket"></ion-icon></NavLink>
        {sessionStorage.getItem('name') ? (
          <div className='loggedIn'>
            <h2>Welcome, {sessionStorage.getItem('name')}</h2>
            <h2><NavLink to='/login' className="react-link" activeClassName="active" onClick={handleLogout}>Logout</NavLink></h2>
          </div>
        ) : (
          <div className="login">
            <h2>
              <NavLink to="/login" className="react-link" activeClassName="react-link-disabled">
                Login
              </NavLink>
            </h2>
          </div>
          
        )}
      </div>
    </div>
    </div>
  );
}

export default NavBar;