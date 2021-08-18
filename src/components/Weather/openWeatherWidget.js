import {React, useEffect, useState} from 'react'
import './style.css'
import {Grid, Button, Box} from '@material-ui/core';
import CloudIcon from '@material-ui/icons/Cloud';

/**
* @author
* @function openWeatherWidget
* Donne la météo d'une ville donnée en propriété
**/




const OpenWeatherWidget = (props) => {
    const city = props.city;
    const weatherURL = props.weatherURL
    const [showWeather, setShowWeather] = useState(false)

    function weather(d,s,id) {
        var js,fjs=d.getElementsByTagName(s)[0];
        if(!d.getElementById(id)){js=d.createElement(s);
            js.id=id;js.src='https://weatherwidget.io/js/widget.min.js';
            fjs.parentNode.insertBefore(js,fjs);}
        };
    
    
        
    return(
        <Grid container>

        <Grid container direction = 'justify'>
        {showWeather && (
        <Grid item xs = {12}>
        <a class="weatherwidget-io" href={weatherURL} data-label_1={city.toUpperCase()} data-label_2="WEATHER" language='french' data-theme="original" ></a>
        {weather(document,'script','weatherwidget-io-js')}
        <p>Pour avoir la carte des orages en temps réel, voir <a href = 'https://map.blitzortung.org/#5.21/47.078/2.367' target = '_blank'>ici</a></p>
        </Grid>
        )
        }
        {!showWeather && (
        <Grid container direction = 'row-reverse'>
        <Grid>
            <Button variant="outlined" color="primary"  startIcon={<CloudIcon />} onClick={() => {setShowWeather(true)}}>Afficher la météo</Button>
            <Box margin ='2em'></Box>
        </Grid>
        </Grid>
        )}
        </Grid>
        </Grid>
        
       
    )
  };

export default OpenWeatherWidget