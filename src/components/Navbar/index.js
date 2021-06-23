import React from 'react'
import {Navbar,Nav} from 'react-bootstrap'
import './style.css'
import Logo from '../../resources/icons/logo.png'
import {NavLink, Link} from "react-router-dom";
import { Button } from 'react-bootstrap';

/**
* @author
* @function NavMain
**/

const NavMain = (props) => {
  
  
  return(
    <Navbar className="black" variant="dark">
      
    <NavLink to="/">
    <img
        src={Logo}
        width="150"
        height="36"
        className="d-inline-block align-top"
        alt="React Bootstrap logo"
      />
    </NavLink>
    <Nav className="mr-auto">
    <div style={{marginRight: "20px"}}></div>
    
      <Link className="nav-cat" to="/map">
        <a>Carte</a>
      </Link>
      <div style={{marginRight: "20px"}}></div>
      <Link className="nav-cat" to="/contact">
        <a>Contact</a>
      </Link>
      <div style={{marginRight: "20px"}}></div>
      <Link className="nav-cat" to="/carnet">
        <a>Suivi du développement</a>
      </Link>
      <div style={{marginRight: "20px"}}></div>
      
    </Nav>
    <Nav className="ml-auto">
      <a style={{color:"grey"}}>Version développement</a>
    </Nav>
  </Navbar>
  
   )

 }

export default NavMain