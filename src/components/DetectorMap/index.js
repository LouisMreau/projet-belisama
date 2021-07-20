import React , {useState, useCallback, useMemo,  useEventHandlers} from 'react';
import './style.css'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent, Rectangle } from "react-leaflet";
import {Button} from 'react-bootstrap'
import {NavLink, Link} from "react-router-dom";
import dataDetector from '../../resources/data/data_detector.json';



/**
* @author
* @function DetectorMap
**/


  

const DetectorMap = (props) => {
  return(
    <div className="map-container">
        <h3 style={{marginBottom:"50px"}}>Sélectionnez un détecteur</h3>
        <MapContainer center={[48.80496, 2.23108]} zoom={9} minZoom={3} maxBounds={[[-90,-180],   [90,180]]}>
            {/* 47, 2 et zoom de 6 */}
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            {dataDetector.map((detector) => 
            (
                <Marker position =  {detector.position} >
                    <div className="map-popup">
                    <Popup maxWidth={500}>
                        <div className="map-popup-content">
                        <b>Lieu : </b> {detector.place} <br/>
                        <b>Contact : </b> {detector.contact} <br/>
                        <b>Date d'installation : </b> {detector.installation_date} <br/>
                        <Link to={"/data/" + detector.id}><Button size="sm" style={{marginTop:"20px"}}>Voir les données</Button></Link>
                        </div>
                    </Popup>
                    </div>
                </Marker>
            ))
            }
            
        </MapContainer>
    </div>
   )

 }

export default DetectorMap