import React from 'react'
import {Navbar,Nav} from 'react-bootstrap'
import './style.css'
import Logo from '../../resources/icons/logo1.png'
import {NavLink, Link} from "react-router-dom";
import { Button } from 'react-bootstrap';

/**
* @author
* @function NavMain
**/

const NavMain = (props) => {
  
  
  return(
    // <Navbar className="black" variant="dark">
      
    //   <NavLink to="/">
    //   <img className = 'logo'
    //       src={Logo}
    //       alt="React Bootstrap logo"
    //     />
    //   </NavLink>

    //   <Nav className="mr-auto">

    //     <div style={{marginRight: "20px"}}></div>
    //     <Link className="nav-cat" to="/map">
    //       <a>Carte</a>
    //     </Link>

    //     <div style={{marginRight: "20px"}}></div>
    //     <Link className="nav-cat" to="/contact">
    //       <a>Contact</a>
    //     </Link>

    //     <div style={{marginRight: "20px"}}></div>
    //     <Link className="nav-cat" to="/carnet">
    //       <a>Suivi du développement</a>
    //     </Link>

    //     <div style={{marginRight: "20px"}}></div>
        
    //   </Nav>

      // <Navbar class="navbar navbar-expand-lg bg-light navbar-light">
      <Navbar  bg="white" variant="light" expand="lg">
        <Navbar.Brand href='/'>
        <Nav.Link href="/"> <img className = 'logo' src={Logo} /></Nav.Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="/map" class="nav-cat">Carte</Nav.Link>
                <Nav.Link href="/contact" className="nav-cat">Contact</Nav.Link>
                <Nav.Link href="/carnet" className="nav-cat">Suivi du développement</Nav.Link>

            </Nav>


        </Navbar.Collapse>


  {/* <a class="navbar-brand"  href='/'><img className = 'logo' src={Logo} /></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
  <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link" href="/map">Carte</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="/contact">Contact</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="/carnet">Suivi du site</a>
    </li>
  </ul>
  </div> */}


      {/* <Nav className="ml-auto">
        <a style={{color:"grey"}}>Version développement</a>
      </Nav> */}
    </Navbar>
  
   )

 }

export default NavMain