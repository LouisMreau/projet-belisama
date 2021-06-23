import React from 'react'
import './style.css'
import { Button } from 'react-bootstrap';
import { TiTick,TiTimes,TiTime } from "react-icons/ti";

/**
* @author
* @function Carnet
**/

const Carnet = (props) => {
  return(
    <div  >
       <div className="team-container">
       
        <div className="desc-container">
        <h4 style={{fontWeight: "bold"}}>Etapes en cours de développement</h4>
        <TiTick style={{fontSize:"30px",paddingBottom:"3px",color: "green"}}/>Terminé  
        <TiTime style={{fontSize:"30px",paddingBottom:"3px",color: "orange"}}/>En cours  
        <TiTimes style={{fontSize:"30px",paddingBottom:"3px",color: "red"}}/>Pas encore commencé  
        <br/><br/>
          <h5 style={{fontWeight: "bold"}}>Site internet</h5> 
          Choix de la structure de données adaptée à React <TiTick style={{fontSize:"30px",paddingBottom:"3px",color: "green"}}/><br/>
          Configuration du framework de graphes et affichages basiques des données<TiTick style={{fontSize:"30px",paddingBottom:"3px",color: "green"}}/><br/>
          Charte graphique <TiTick style={{fontSize:"30px",paddingBottom:"3px",color: "green"}}/><br/>
          Carte du monde des détecteurs <TiTime style={{fontSize:"30px",paddingBottom:"3px",color: "orange"}}/><br/>
          Comparaison de spectres sur deux périodes <TiTimes style={{fontSize:"30px",paddingBottom:"3px",color: "red"}}/><br/>
          Comparaison de données entre deux localisations <TiTimes style={{fontSize:"30px",paddingBottom:"3px",color: "red"}}/><br/>
          <br/>
          <h5 style={{fontWeight: "bold"}}>Cloud</h5>
          Création de l'api pour téléverser les données depuis les raspberry <TiTick style={{fontSize:"30px",paddingBottom:"3px",color: "green"}}/><br/>
          Création de la base de données <TiTick style={{fontSize:"30px",paddingBottom:"3px",color: "green"}}/><br/>
          Création de l'api pour télécharger les données depuis le site <TiTimes style={{fontSize:"30px",paddingBottom:"3px",color: "red"}}/><br/>
          Résilience et gestions des erreurs <TiTime style={{fontSize:"30px",paddingBottom:"3px",color: "orange"}}/><br/>
          
          <br/>
          <h5 style={{fontWeight: "bold"}}>Détecteurs</h5>
          Création du script pour le traitement préliminaire des données et le téléversement <TiTime style={{fontSize:"30px",paddingBottom:"3px",color: "orange"}}/> <br/>
          <br/>
          <Button variant="primary" href="https://s3.eu-west-3.amazonaws.com/www.belisama-dev.ml/Belisama.pdf" target="_blank">Rapport de projet</Button>
         
        </div>
       </div>
    </div>
   )

 }

export default Carnet