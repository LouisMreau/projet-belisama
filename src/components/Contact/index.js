import React from 'react'
import './style.css'

/**
* @author
* @function Contact
* Donne les contacts ayant contribué au projet Belisama
**/

const Contact = (props) => {
  return(
    <div  >

       <div className="team-container">
        <div className="desc-container">
        <p style={{fontWeight: "bold"}}>Philippe Laurent - Chef de Projet</p>  
        philippe.laurent@cea.fr <br/> 
        <br/> 
        
        <p style={{fontWeight: "bold"}}>Hugo Marchand - Data Scientist</p>
        hugo.marchand@yahoo.fr <br/> 
        <br/> 
        
        <p style={{fontWeight: "bold"}}>Louis Moreau - Architecte Cloud et Web, Développeur, Data Scientist </p>
        moreaulouis.ml@gmail.com <br/> 
        <br/> 

        <p style={{fontWeight: "bold"}}>Li-fan Zhao - Architecte Cloud et Web, Développeur, Data Scientist </p>
        zhao.lifan@yahoo.fr <br/> 
        <br/> 
            
        </div>
       </div>
    </div>
   )

 }

export default Contact