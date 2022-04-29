import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import SignOutButton from "./SignOut";

import "../App.css";

const Navigation = () => {
  console.log("Navigation loaded");
  const { currentUser } = useContext(AuthContext);
  return (
    <div>
      {currentUser ? (
        <NavigationAuth currentUser={currentUser} />
      ) : (
        <NavigationNonAuth currentUser={currentUser} />
      )}
    </div>
  );
};

const NavigationAuth = ({ currentUser }) => {
  return (
    <nav  class="navbar navbar-expand-lg">
    <a class='navbar-brand' href="#">Wedd.io</a>
      <div id="navbarSupportedContent">
      <ul id="menu-main-nav" className="navbar-nav nav-fill w-100">
        <li class='nav-item active'>
          <a class='navbar-link' href="/">Landing</a>
        </li>
        <li class='nav-item active'>
          <a class='navbar-link' href="/home">Home</a>
        </li>
        <li class='nav-item active'>
          <a class='navbar-link' href="/account">Account</a>
        </li>
        <li class='nav-item active'>
          <SignOutButton />
        </li>
        <li class='nav-item active'>
          <a class='navbar-link' href="/weddings/wedding/">Wedding</a>
        </li>
        <li class='nav-item active'>
          <a class='navbar-link' href="/weddings/attending/">Your Events</a>
        </li>
        <li>
          <NavLink to={`/events/`}>Events</NavLink>
        </li>
      </ul>
      </div>
    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav class="navbar navbar-expand-lg">
      <a class='navbar-brand' href="#">Wedd.io</a>
      <div id="navbarSupportedContent">
      <ul id="menu-main-nav" className="navbar-nav nav-fill w-100">
        <li class='nav-item active'>
          <a class='navbar-link' href="/">Landing</a>
        </li>
        <li class='nav-item active'>
          <a class='navbar-link' href="/signup">Sign-up</a>
        </li>
        <li class='nav-item active'>
          <a class='navbar-link' href="/signin">Sign In</a>
        </li>
      </ul>
      </div>
    </nav>
  );
};

export default Navigation;
