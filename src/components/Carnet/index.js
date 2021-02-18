import React from 'react'
import './style.css'
import { Button } from 'react-bootstrap';

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
          <h5 style={{fontWeight: "bold"}}>Site internet</h5>
          Choix de la structure de données adaptée à React<br/>
          Configuration du framework de graphes <br/>
          Charte graphique <br/>
          <br/>
          <h5 style={{fontWeight: "bold"}}>Cloud</h5>
          Création de l'api pour téléverser les données depuis les raspberry <br/>
          Création de l'api pour télécharger les données depuis le site <br/>
          Création de la base de données <br/>
          <br/>
          <h5 style={{fontWeight: "bold"}}>Détecteurs</h5>
          Création du script pour le traitement préliminaire des données et le téléversement  <br/>
          <br/>
          <Button variant="primary" href="https://s3.eu-west-3.amazonaws.com/www.belisama-dev.ml/Belisama.pdf" target="_blank">Rapport de projet (11/02/2021)</Button>
         
        </div>
       </div>
    </div>
   )

 }

export default Carnet