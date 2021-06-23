import './App.css';
import NavbBar from './components/Navbar/index'
import Footer from './components/Footer/index'
import Home from './components/Home/index'
import DataVisu from './components/DataVisu/index'
import Contact from './components/Contact/index'
import Carnet from './components/Carnet/index'
import DetectorMap from './components/DetectorMap/index'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router,Switch,Route,Link,Redirect } from "react-router-dom";
import React, { useState, useEffect } from 'react';



function App() {
  
  return (
    <div className="App">
       <Router>

        <NavbBar />
        
        <Switch>
        <Route path="/carnet">
            <Carnet />
        </Route>
        <Route path="/contact">
            <Contact />
        </Route>
        <Route path="/map">
          <DetectorMap />
        </Route>
        <Route path="/data/:detectorId" component={DataVisu} />
        <Route path="/data">
          <Redirect to="/map" />
        </Route>
        <Route path="/">
          <Redirect to="/map" />
        </Route>
        </Switch>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
