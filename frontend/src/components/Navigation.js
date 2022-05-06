import React, { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
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
            <Nav.Link href="/home" className="active">
              Home
            </Nav.Link>
            <Nav.Link href="/weddings/my-wedding" className="active">
              My Wedding
            </Nav.Link>
            <Nav.Link href="/events" className="active">
              My Events
            </Nav.Link>
            <Nav.Link href="/weddings/attending" className="active">
              Attending
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link href="/profile" className="active">
            Profile
          </Nav.Link>
          <SignOutButton />
        </Navbar.Collapse>
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
        </Nav>
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link href="/signup" className="active">
            Sign Up
          </Nav.Link>
          <Nav.Link href="/signin" className="active">
            Sign In
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
