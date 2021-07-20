import {React, useState, useEffect, useRef, Component } from 'react'
import './style.css'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {Grid, Container, Button, Paper, Box, Typography} from '@material-ui/core';
import DatePicker from "react-datepicker";
import axios from 'axios';

import dataDetector from '../../resources/data/data_detector.json';
import Count2 from '../Count/count2';
import Energy2 from '../Energy/energy2';

const Comparaison = (props) => {
    const [dataLean1, setDataLean1] = useState([]);
    const [dataLean2, setDataLean2] = useState([]);
    const [detector1, setDetector1] = useState('');
    const [detector2, setDetector2] = useState('');
    const [type, setType] = useState('');
    const [countTimeValue, setCountTimeValue] = useState([])

    useEffect(() => {
        setCountTimeValue([new Date(),new Date()])
      },[]);

    useEffect(() => {
        loadData1(detector1)
    },[detector1]);

    useEffect(() => {
        loadData2(detector2)
    },[detector2]);    

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
    

    const handleChange1 = (event) => {
        setDetector1(event.target.value);
    };
    const handleChange2 = (event) => {
        setDetector2(event.target.value);
    };
    const handleChange3 = (event) => {
        setType(event.target.value);
    };

    const handleCountTimeChange = (isEndTime, newValue) => {
        if (isEndTime) { setCountTimeValue([countTimeValue[0],newValue]); }
        else { setCountTimeValue([newValue,countTimeValue[1]]); }
      };

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
                    <h3> Choix de deux détecteurs</h3>
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
                            onChange={handleChange1}
                        
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
                            onChange={handleChange2}
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
                                onChange={handleChange3}
                                >
                                
                                <MenuItem value = {"count"}>Taux de comptage</MenuItem>
                                <MenuItem value = {"spectrum"}>Spectre en énergie</MenuItem>
                                
                                </Select>
                        </FormControl>
                    </Grid>
                    }
                </Grid>
            </Grid>

            {/* <Grid container justify = 'center'>
                <Grid item xs = {12}>
                    <Box margin = '5em'></Box>
                    <h3> Période</h3>
                </Grid>
                <Grid container xs = {10}>
                    <Grid item xs={12} sm = {6}>
                        <p style={{marginRight:"20px", marginLeft:"20px", marginTop : '20px'}}>Début</p>
                        <DatePicker minDate={new Date()} maxDate={countTimeValue[1]} dateFormat="dd/MM/yyyy" selected={countTimeValue[0]} onChange={date => handleCountTimeChange(false,date)} />
                    </Grid>
                    <Grid item xs={12} sm = {6}> 
                        <p style={{marginLeft:"20px",marginRight:"20px", marginTop : '20px'}}>Fin</p>
                        <DatePicker minDate={countTimeValue[0]} maxDate={new Date()} dateFormat="dd/MM/yyyy" selected={countTimeValue[1]} onChange={date => handleCountTimeChange(true,date)} />
                    </Grid>
                </Grid>
            </Grid> */}


            <Grid container justify = 'center'>    
                <Grid item xs = {12}>
                    <Box margin = '5em'></Box>
    
                    {(detector1) && (detector2) && (type == "count") &&
                        <Grid item xs={12}>
                        <Box margin = '2em' color = 'white'></Box>
                            <Count2 dataLean1 = {dataLean1} detectorId1 = {detector1} dataLean2 = {dataLean2} detectorId2 = {detector2}/>
                        </Grid>
                    }
                    {(type == "spectrum") && (detector1) && (detector2) &&
                        <Grid item xs={12}>
                        <Box margin = '2em' color = 'white'></Box>
                            <Energy2 dataLean1 = {dataLean1} detectorId1 = {detector1} dataLean2 = {dataLean2} detectorId2 = {detector2}/>
                        </Grid>
                    }
                    
                </Grid>
            </Grid>
                        
        </div>

    )
}

export default Comparaison