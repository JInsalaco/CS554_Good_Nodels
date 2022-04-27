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
    <nav className="navigation">
      <ul>
        <li>
          <NavLink to="/">Landing</NavLink>
        </li>
        <li>
          <NavLink to="/home">Home</NavLink>
        </li>
        <li>
          <NavLink to="/account">Account</NavLink>
        </li>
        <li>
          <SignOutButton />
        </li>
        <li>
          <NavLink to={`/weddings/wedding/`}>Wedding</NavLink>
        </li>
      </ul>
    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink to="/">Landing</NavLink>
        </li>
        <li>
          <NavLink to="/signup">Sign-up</NavLink>
        </li>

        <li>
          <NavLink to="/signin">Sign-In</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
