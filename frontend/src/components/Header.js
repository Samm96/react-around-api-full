import React from "react";
import { Route, Link } from "react-router-dom";

function Header({ userEmail, onLogout, mobilePopup, menuOpen, onClose }) {
  return (
    <header className="header">
      <img
        src={require("../images/logo.svg")}
        className="header__logo"
        alt="Around the U.S. Logo"
      />
      <Route exact path="/">
        <div className="header__container">
          <button onClick={onLogout} className="header__sign">
            Log out
          </button>
          <p className="header__email">{userEmail}</p>
          {menuOpen ? (
            <button
              className="close-button close-button_type_mobile"
              onClick={onClose}
              alt="Close"
            />
          ) : (
            <button className="menu-button" alt="Menu" onClick={mobilePopup} />
          )}
        </div>
      </Route>
      <Route path="/signup">
        <div className="header__container header__container_type_signup">
          <Link className="header__sign" to="/signin">
            Sign in
          </Link>
          <p className="header__email header__email_hidden">email</p>
        </div>
      </Route>
      <Route path="/signin">
        <div className="header__container header__container_type_signup">
          <Link className="header__sign" to="/signup">
            Sign up
          </Link>
          <p className="header__email header__email_hidden">email</p>
        </div>
      </Route>
    </header>
  );
}

export default Header;
