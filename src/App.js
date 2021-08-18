import './App.css';
import NavbBar from './components/Navbar/index'
import Footer from './components/Footer/index'
import Home from './components/Home/index'
import DataVisu from './components/DataVisu/index'
import Contact from './components/Contact/index'
import DetectorMap from './components/DetectorMap/index'
import Comparaison from './components/Comparaison/index'
import MoreInfo from './components/MoreInfo/moreinfo'
import Videos from './components/Videos/videos'
import OpenWeather from './components/Weather/openWeatherWidget'
import Test from './components/Test/test'

import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router,Switch,Route,Link,Redirect } from "react-router-dom";
import React, { useState, useEffect } from 'react';



function App() {
  
  return (
    <div className="App">
       <Router>

        <NavbBar />
        
        <Switch>

        <Route path="/contact">
            <Contact />
        </Route>
        <Route path="/about">
            <MoreInfo />
        </Route>
        <Route path="/videos">
            <Videos/>
        </Route>
        <Route path="/analysis">
          <Comparaison/>
        </Route>
        <Route path="/map">
          <DetectorMap />
        </Route>
        <Route path="/weather">
          <OpenWeather />
        </Route>
        <Route path = "/test">
          <Test/>
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
