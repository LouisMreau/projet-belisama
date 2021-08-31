import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import "./style.css";
import Logo from "../../resources/icons/logo1.png";
import { NavLink, Link } from "react-router-dom";
import { Button } from "react-bootstrap";

/**
 * @author
 * @function NavMain
 * Returns the navigation bar with three tabls : counting, energy, downloading
 * Responsive : menuitem on mobile screen
 **/

const NavMain = (props) => {
  return (
    <Navbar bg="white" variant="light" expand="lg">
      <Navbar.Brand href="/">
        <Nav.Link href="/">
          {" "}
          <img className="logo" src={Logo} />
        </Nav.Link>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/map" class="nav-cat">
            Carte
          </Nav.Link>
          <Nav.Link href="/analysis" className="nav-cat">
            Analyse
          </Nav.Link>
          <Nav.Link href="/about" className="nav-cat">
            A propos
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavMain;
