import React from 'react'
import './style.css'
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {Button} from 'react-bootstrap'
import {NavLink, Link} from "react-router-dom";


/**
* @author
* @function DetectorMap
**/

const DetectorMap = (props) => {
  return(
    <div className="map-container">
        <h3 style={{marginBottom:"50px"}}>Sélectionnez un détecteur</h3>
        <MapContainer center={[47, 2]} zoom={6} minZoom={3} maxBounds={[[-90,-180],   [90,180]]}>
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[48.8461, 2.13648]}>
                <div className="map-popup">
                <Popup maxWidth={500}>
                    <div className="map-popup-content">
                    <b>Lieu : </b>Lycée Corneille, La Celle Saint Cloud <br/>
                    <b>Contact : </b>Caroline Ladent, carolineladent@exemple.com <br/>
                    <b>Date d'installation : </b>24/03/2020 <br/>
                    <Link to="/data/LCSC"><Button size="sm" style={{marginTop:"20px"}}>Voir les données</Button></Link>
                    </div>
                </Popup>
                </div>
            </Marker>
            <Marker position={[48.80496, 2.23108]}>
                <Popup maxWidth={500}>
                    <div className="map-popup-content">
                    <b>Lieu : </b>Observatoire de Paris, Meudon<br/>
                    <b>Contact : </b>Jean Dupont, jeandupont@exemple.com <br/>
                    <b>Date d'installation : </b>24/03/2020 <br/>
                    <Link to="/data/obsmeudon"><Button size="sm" style={{marginTop:"20px"}}>Voir les données</Button></Link>
                    </div>
                </Popup>
            </Marker>
            {/*
            <Marker position={[48.82868, 2.38301]}>
                <Popup maxWidth={500}>
                    <div className="map-popup-content">
                    <b>Lieu : </b>Laboratoire AstroParticule et Cosmologie, Paris <br/>
                    <b>Contact : </b>Jean Dupont, jeandupont@exemple.com <br/>
                    <b>Date d'installation : </b>24/03/2020 <br/>
                    <Link to="/"><Button size="sm" style={{marginTop:"20px"}}>Voir les données</Button></Link>
                    </div>
                </Popup>
            </Marker> */}
        </MapContainer>
    </div>
   )

 }

export default DetectorMap