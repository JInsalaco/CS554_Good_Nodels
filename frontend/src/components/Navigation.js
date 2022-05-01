import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
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
    <Navbar bg="light" expand="lg" class="header">
      <Container>
        <Navbar.Brand href="/" style={{ fontSize: "xx-large" }}>
          Wedd.io
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="active">
              Landing
            </Nav.Link>
            <Nav.Link href="/home" className="active">
              Home
            </Nav.Link>
            <Nav.Link href="/account" className="active">
              Account
            </Nav.Link>
            <Nav.Link href="/weddings/wedding" className="active">
              Wedding
            </Nav.Link>
            <Nav.Link href="/weddings/attending" className="active">
              Your Events
            </Nav.Link>
            <Nav.Link href="/events" className="active">
              Events
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <SignOutButton />
      </Container>
    </Navbar>
  );
};

const NavigationNonAuth = () => {
  return (
    <Navbar bg="light" expand="lg" class="header">
      <Container>
        <Navbar.Brand href="/" style={{ fontSize: "xx-large" }}>
          Wedd.io
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/" className="active">
            Landing
          </Nav.Link>
          <Nav.Link href="/signup" className="active">
            Sign up
          </Nav.Link>
          <Nav.Link href="/signin" className="active">
            Sign in
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;
