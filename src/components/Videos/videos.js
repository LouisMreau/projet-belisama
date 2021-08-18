import React from 'react'
import './style.css'
import {Grid, Container, Button, Paper, Box, Typography, CircularProgress, IconButton} from '@material-ui/core';
import ReactPlayer from "react-player"
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

/**
* @author
* @function Videos
* Renvoie la page des vidéos tutoriels dont l'accès se fait à partir de la page A propos
**/

const Videos = (props) => {
  return(

       <Container maxWidth ="md">

            <Grid item xs = {12}>
                <Typography id = 'first' variant="h6">1. Présentation du projet Belisama</Typography>  
                <Box margin = '3em'></Box>
            </Grid>

            <Grid item xs = {12}>
            <ReactPlayer 
            url="https://www.youtube.com/watch?v=q7OS5_RgmyE&ab_channel=ASTROPIKU"
            width = '100%'
            /> 
            <Box margin = '3em'></Box>
            </Grid>

            <Grid item xs = {12}>
                <Typography variant="h6">2. Présentation du détecteur</Typography>  
                <Box margin = '3em'></Box>
            </Grid>

            <Grid item xs = {12}>
            <ReactPlayer 
            url="https://www.youtube.com/watch?v=wtg0N3oaHbQ&t=72s&ab_channel=ASTROPIKU"
            width = '100%'
            /> 
            <Box margin = '3em'></Box>
            </Grid>

            <Grid item xs = {12}>
                <Typography variant="h6"> 3. Montage du dispositif </Typography>
                <Box margin = '3em'></Box>
            </Grid>

            <Grid item xs = {12}>
            <ReactPlayer 
            url="https://www.youtube.com/watch?v=ldfvNKhgoQk&ab_channel=ASTROPIKU"
            width = '100%'
            /> 
            <Box margin = '3em'></Box>
            </Grid>

            <Grid item xs = {12}>
            <Typography variant="h6">4. Calibrage du détecteur</Typography>  
            <Box margin = '3em'></Box>
            </Grid>

            <Grid item xs = {12}>
            <ReactPlayer 
            url="https://www.youtube.com/watch?v=cuBVEsfiZ6Y"
            width = '100%'
            /> 
            <Box margin = '3em'></Box>
            </Grid>

            <Grid item xs = {12}>
            <Typography variant="h6">5. Prise de données</Typography> 
            <Box margin = '3em'></Box> 
            </Grid>

            <Grid item xs = {12}>
            <ReactPlayer 
            url="https://www.youtube.com/watch?v=lj3jmtN6YTM&ab_channel=ASTROPIKUM"
            width = '100%'
            /> 
            <Box margin = '3em'></Box>
            </Grid>

            <Grid item xs = {12}>
            <Typography variant="h6">6. Analyse de données</Typography>  
            <Box margin = '3em'></Box>
            </Grid>

            <Grid item xs = {12}>
            <ReactPlayer 
            url="https://www.youtube.com/watch?v=kEVubuSdpvQ&t=118s&ab_channel=ASTROPIKU"
            width = '100%'
            /> 
            <Box margin = '3em'></Box>
            </Grid>

            <Grid item xs = {12}>
            <IconButton aria-label="getUpward" href = '#first'>
                <ArrowUpwardIcon />
            </IconButton>
            </Grid>

    </Container>
   )

 }

export default Videos