import React , {useState, useCallback, useMemo,  useEventHandlers} from 'react';
import './style.css'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent, Rectangle } from "react-leaflet";
import {Button} from 'react-bootstrap'
import {NavLink, Link} from "react-router-dom";
import dataDetector from '../../resources/data/data_detector.json';
// import Rectangle from 'draw-shape-reactjs'


/**
* @author
* @function DetectorMap
**/

// // Classes used by Leaflet to position controls
// const POSITION_CLASSES = {
//     bottomleft: 'leaflet-bottom leaflet-left',
//     bottomright: 'leaflet-bottom leaflet-right',
//     topleft: 'leaflet-top leaflet-left',
//     topright: 'leaflet-top leaflet-right',
//   }
  
//   const BOUNDS_STYLE = { weight: 1 }
  
//   function MinimapBounds({ parentMap, zoom }) {
//     const minimap = useMap()
  
//     // Clicking a point on the minimap sets the parent's map center
//     const onClick = useCallback(
//       (e) => {
//         parentMap.setView(e.latlng, parentMap.getZoom())
//       },
//       [parentMap],
//     )
//     useMapEvent('click', onClick)
  
//     // Keep track of bounds in state to trigger renders
//     const [bounds, setBounds] = useState(parentMap.getBounds())
//     const onChange = useCallback(() => {
//       setBounds(parentMap.getBounds())
//       // Update the minimap's view to match the parent map's center and zoom
//       minimap.setView(parentMap.getCenter(), zoom)
//     }, [minimap, parentMap, zoom])
  
//     // Listen to events on the parent map
//     const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [])
//     useEventHandlers({ instance: parentMap }, handlers)
  
//     return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />
//   }
  
//   function MinimapControl({ position, zoom }) {
//     const parentMap = useMap()
//     const mapZoom = zoom || 0
  
//     // Memoize the minimap so it's not affected by position changes
//     const minimap = useMemo(
//       () => (
//         <MapContainer
//           style={{ height: 80, width: 80 }}
//           center={parentMap.getCenter()}
//           zoom={mapZoom}
//           dragging={false}
//           doubleClickZoom={false}
//           scrollWheelZoom={false}
//           attributionControl={false}
//           zoomControl={false}>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//           <MinimapBounds parentMap={parentMap} zoom={mapZoom} />
//         </MapContainer>
//       ),
//       [],
//     )
  
//     const positionClass =
//       (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright
//     return (
//       <div className={positionClass}>
//         <div className="leaflet-control leaflet-bar">{minimap}</div>
//       </div>
//     )
//   }
  

const DetectorMap = (props) => {
  return(
    <div className="map-container">
        <h3 style={{marginBottom:"50px"}}>Sélectionnez un détecteur</h3>
        <MapContainer center={[47, 2]} zoom={6} minZoom={3} maxBounds={[[-90,-180],   [90,180]]}>
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* <MinimapControl position="topright" /> */}
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