import {React, useState, useEffect } from 'react'
import './style.css'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {Grid, Box, Typography, FormControl, Breadcrumbs, Link, CircularProgress} from '@material-ui/core';

import axios from 'axios';

import Count2 from '../Count/count2';
import Energy2 from '../Energy/energy2';

/**
* @author
* @function CompareDetector
* Permet le chargement des données pour deux détecteurs donnés en input par l'utilisateur grâce à un MenuItem
**/

const CompareDetector = (props) => {
    const [dataLean1, setDataLean1] = useState([]);
    const [dataLean2, setDataLean2] = useState([]);
    const [detector1, setDetector1] = useState('');
    const [detector2, setDetector2] = useState('');
    const dataDetector = props.dataDetector
    const [type, setType] = useState('');
    const [showGraph, setShowGraph] = useState(false)

    useEffect(() => {
        loadData1(detector1)
    },[detector1]);

    useEffect(() => {
        loadData2(detector2)
    },[detector2]); 
    
    useEffect(() => {
        if ((dataLean1.length > 0) && (dataLean2.length > 0) && (dataDetector.length > 0)) {
            setShowGraph(true)
        }
    }, [dataLean1, dataLean2])

    const loadData1 = async (detectorId1) => {
        await axios.get('https://data-belisama.s3.eu-west-3.amazonaws.com/'+detectorId1+'/data_lean_update.json')
            .then(response => {
                setDataLean1(response.data)
              })
            .catch(error => {
              console.log("Détecteur introuvable")
            })
    }

    const loadData2 = async (detectorId2) => {
        await axios.get('https://data-belisama.s3.eu-west-3.amazonaws.com/'+detectorId2+'/data_lean_update.json')
            .then(response => {
                setDataLean2(response.data)    
            })
            .catch(error => {
            console.log("Détecteur introuvable")
            })
    }
    

    const handleChangeDetector1 = (event) => {
        setDetector1(event.target.value);
    };
    const handleChangeDetector2 = (event) => {
        setDetector2(event.target.value);
    };
    const handleChangeType = (event) => {
        setType(event.target.value);
        
    };

    function handleClick(event) {
        event.preventDefault();
        console.info('You clicked a breadcrumb.');
      }

    const useStyles = makeStyles((theme) => ({
        formControl: {
          margin: theme.spacing(1),
          minWidth: 200,
        },
    }))
    const classes = useStyles();

    return (
        <div>
            
            <Grid container justify = 'center' spacing = {3}>
                <Grid item xs = {12}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Typography color="inherit">Analyse</Typography>
                    <Typography color="textPrimary">Par détecteur</Typography>
                </Breadcrumbs>
                </Grid>
                <Grid item xs = {12}>
                    <Box margin = "2em"></Box>
                    <h3> Comparaison des données de deux détecteurs</h3>
                    <Box margin = '2em'></Box>
                </Grid>
                <Grid container xs = {12} justify = 'center'>
                    
                    <Grid item md={12} lg={3} xs = {12}>
                        <FormControl className = {classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Détecteur 1</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={detector1}
                            onChange={handleChangeDetector1}
                        
                            >
                            {dataDetector.filter(function(x) { return x.id !== detector2;}).map((detector) => (
                            
                            <MenuItem value = {detector.id}>{detector.place}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item md={12} lg={3} xs = {12}>
                        <FormControl className = {classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Détecteur 2</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={detector2}
                            onChange={handleChangeDetector2}
                            >
                            {dataDetector.filter(function(x) { return x.id !== detector1;}).map((detector) => (
                            
                            <MenuItem value = {detector.id}>{detector.place}</MenuItem>
                              
                                ))}
                            </Select>
                        </FormControl>
                    </Grid> 
                    {(detector1) && (detector2) &&
                    <Grid item md={12} lg={3} xs = {12} >
                        <FormControl className = {classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Type de graphique</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={type}
                                onChange={handleChangeType}
                                >
                                
                                <MenuItem value = {"count"}>Taux de comptage</MenuItem>
                                <MenuItem value = {"spectrum"}>Spectre en énergie</MenuItem>
                                
                                </Select>
                        </FormControl>
                    </Grid>
                    }
                </Grid>
            </Grid>


            <Grid container justify = 'center'>    
                <Grid item xs = {12}>
                    <Box margin = '5em'></Box>
                    {!(showGraph) && (detector1) && (detector2) && (type.length > 0) && (
                        <Grid item xs = {12}>
                            <Box margin = '2em'></Box>
                            <CircularProgress/>  
                        </Grid>
                    )}
                    {(showGraph) && (detector1) && (detector2) && (type == "count") && (
                        <Grid item xs={12}>
                            <Count2 dataLean1 = {dataLean1} detectorId1 = {detector1} dataLean2 = {dataLean2} detectorId2 = {detector2} dataDetector = {dataDetector} />
                        </Grid>
                    )}
                    {(showGraph) && (detector1) && (detector2) && (type == "spectrum") && (
                        <Grid item xs={12}>
                            <Energy2 dataLean1 = {dataLean1} detectorId1 = {detector1} dataLean2 = {dataLean2} detectorId2 = {detector2} dataDetector = {dataDetector} />
                        </Grid>
                    )}
                </Grid>
            </Grid>                 
        </div>
    )
}

export default CompareDetector