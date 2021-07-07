import {React, useState, useEffect, useRef, Component } from 'react'
import './style.css'
import {Link, useParams} from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';
import moment from 'moment'
import dataLean2 from '../../resources/data/data_lean.json'
import dataLean3 from '../../resources/data/data_lean20210605.json'
import Slider from '@material-ui/core/Slider';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

import {Grid, Container, Button, Paper, Box, Typography} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import csvjson from 'csvjson'


import Download from '../Download/index';
import Count from '../Count/count';
import Energy from '../Energy/energy';

/**
* @author
* @function DataVisu
**/



const DataVisu = (props) => {
  let { detectorId } = useParams();

  const [spectrumTimeValue, setSpectrumTimeValue] = useState([]);
  const [spectrumData, setSpectrumData] = useState([]);

  const [dataLean, setDataLean] = useState([]);
  const [isLoadinData, setIsLoadingData] = useState(true); 
  const [loadingMessage, setloadingMessage] = useState("Chargement des données du détecteur..."); 



  useEffect(() => {
    loadData();
  },[])

  const loadData = async () => {
    await axios.get('https://data-belisama.s3.eu-west-3.amazonaws.com/'+detectorId+'/data_lean.json')
        .then(response => {
            setDataLean(response.data)
            setIsLoadingData(false)
            
          })
        .catch(error => {
          console.log("Détecteur introuvable")
          setloadingMessage("Détecteur introuvable")
        })
  }


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
      
    };
  }


  const [value, setValue] = useState(0);
 

  return(

    <div>
   

        { isLoadinData && 
          <h2 style={{margin:"30px"}}>{loadingMessage}</h2>}
        { !isLoadinData && 
    <div>
    <AppBar position="static">
      <Paper square>
        <Tabs value={value} onChange={handleChange} indicatorColor = "primary"
    variant="fullWidth"
    aria-label="full width tabs example"
    textColor="primary"
    centered>
          <Tab label="Taux de comptage" {...a11yProps(0)} />
          <Tab label="Spectre en énergie" {...a11yProps(1)} />
          <Tab label="Téléchargement" className = 'word' {...a11yProps(2)} />
        </Tabs>
      </Paper>
    </AppBar>
    <TabPanel value={value} index={0}>
      <Count dataLean = {dataLean} detectorId = {detectorId}/>
    </TabPanel>
    <TabPanel value={value} index={1}>
      <Energy dataLean = {dataLean} detectorId = {detectorId} />
    </TabPanel>
    <TabPanel value={value} index={2}>
      <Download dataLean={dataLean} detectorId = {detectorId}/>
    </TabPanel>
    

    </div> }

    </div>

   )

 }

export default DataVisu