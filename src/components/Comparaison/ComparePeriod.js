import {React, useState, useEffect, useRef, Component } from 'react'
import './style.css'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {Grid, Container, Button, Paper, Box, Typography, Link, Breadcrumbs, CircularProgress} from '@material-ui/core';
import DatePicker from "react-datepicker";
import axios from 'axios';

import CountPeriod from '../Count/countPeriod';
import SpectrumPeriod from '../Energy/spectrumPeriod'

/**
* @author
* @function ComparePeriod
* Permet le chargement des données pour un détecteur donné en input par l'utilisateur (en vue de visualiser les graphiques de deux périodes données)
**/

const ComparePeriod = (props) => {
    const [dataLean, setDataLean] = useState([]);
    const dataDetector = props.dataDetector
    const [detectorId, setDetectorId] = useState('');
    const [installation_date, setInstallationDate] = useState([new Date()])
    const [startDate1, setStartDate1] = useState(new Date());
    const [startDate2, setStartDate2] = useState(new Date());
    const [showGraph, setShowGraph] = useState(false)
    const [endDate1, setEndDate1] = useState(new Date());
    const [endDate2, setEndDate2] = useState(new Date());
    const [type, setType] = useState('');

    useEffect(()=> {
        loadData(detectorId)
    }, [detectorId])


    useEffect(() => {
        if ((dataLean.length > 0) && (dataDetector.length > 0)) {
            setShowGraph(true)
        }
    }, [dataLean])


    const handleChangeDetector = (event) => {
        setDetectorId(event.target.value);
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

    const loadData = async (detector) => {
        await axios.get('https://data-belisama.s3.eu-west-3.amazonaws.com/'+detector+'/data_lean_update.json')
            .then(response => {
                setDataLean(response.data)         
                })
            .catch(error => {
                console.log("Détecteur introuvable")
            })
    }
    
    const classes = useStyles();

    return (
        <div>
            <Grid container justify = 'center' spacing = {3}>
                <Grid item xs = {12}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography color="inherit">Analyse</Typography>
                        <Typography color="textPrimary">Par période</Typography>
                    </Breadcrumbs>
                </Grid>
                <Grid item xs = {12}>
                    <Box margin = "2em"></Box>
                    <h3> Comparaison de deux périodes</h3>
                    <Box margin = '2em'></Box>
                </Grid>
                <Grid container xs = {12} justify = 'center'>

                    <Grid item  xs = {12} >
                        <FormControl className = {classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Détecteur</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={detectorId}
                                onChange={handleChangeDetector}
                            
                                >
                                {dataDetector.map((detector) => (
                                
                                <MenuItem value = {detector.id}>{detector.place}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        <Box margin = '2em'></Box>
                    </Grid>

                    {(detectorId) && (
                    <Grid item md={12} lg={6} xs = {12} >
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
                    )}
                {!(showGraph) && (type.length > 0) && (
                <Grid item xs = {12}>
                    <Box margin = '2em'></Box>
                    <CircularProgress/>  
                </Grid>
                )}
                {(showGraph) && (type == "count") && (
                <CountPeriod detectorId = {detectorId} dataLean = {dataLean} dataDetector = {dataDetector} />  
                )}
                {(showGraph) && (type == "spectrum") && (
                <SpectrumPeriod detectorId = {detectorId} dataLean = {dataLean} dataDetector = {dataDetector} />  
                )}
                    
                </Grid>
            </Grid>             
        </div>

    )
}

export default ComparePeriod