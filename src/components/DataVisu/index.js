import {React, useState, useEffect, useRef, Component } from 'react'
import './style.css'
import {Link, useParams} from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';
import moment from 'moment'
// import dataLean from '../../resources/data/data_lean.json'
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
  const [countSliderValue, setCountSliderValue] = useState([]);
  const [countTimeValue, setCountTimeValue] = useState([]);
  const [spectrumTimeValue, setSpectrumTimeValue] = useState([]);
  const [spectrumData, setSpectrumData] = useState([]);
  const [countData, setCountData] = useState([]);
  const [dataLean, setDataLean] = useState([]);
  const [isLoadinData, setIsLoadingData] = useState(true); 
  const [loadingMessage, setloadingMessage] = useState("Chargement des données du détecteur..."); 

  useEffect(() => {
    if (dataLean.length > 0) { setCountSerie(dataLean) }
  },[countTimeValue,countSliderValue]);

  useEffect(() => {
    if (dataLean.length > 0) { setSpectrum(dataLean) }
  },[spectrumTimeValue]);

  useEffect(() => {
    loadData();
  },[])

  useEffect(() => {
    if (dataLean.length > 0) {
      setCountSliderValue([dataLean[0][2], dataLean[0][2]+500])
      setCountTimeValue([new Date(dataLean[0][0]),new Date(dataLean[0][1])])
      setSpectrumTimeValue([new Date(dataLean[0][0]),new Date(dataLean[0][1])])
    }
  },[dataLean])

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

  const handleCountSliderChange = (event, newValue) => {
    setCountSliderValue(newValue);
  };

  const handleCountTimeChange = (isEndTime, newValue) => {
    if (isEndTime) { setCountTimeValue([countTimeValue[0],newValue]); }
    else { setCountTimeValue([newValue,countTimeValue[1]]); }
  };

  const handleSpectrumTimeChange = (isEndTime, newValue) => {
    if (isEndTime) { setSpectrumTimeValue([spectrumTimeValue[0],newValue]); }
    else { setSpectrumTimeValue([newValue,spectrumTimeValue[1]]); }
  };

  const createChartData = (xx,yy) => {
    let chartData = []
    for (var i = 0; i<yy.length; i++) {
      chartData.push({x:xx[i],y:yy[i]})
    }
    return chartData
  };

  const loadCountSerie = (dataLean, inf_energy,sup_energy, inf_time, sup_time) => {
    let counts = []
    let times = []
    for (var i = inf_time; i<sup_time;i++) {
      counts.push(dataLean[1][i].slice(inf_energy,sup_energy).reduce((a, b) => a + b, 0))
      times.push(i)
      // times.push(moment(countTimeValue[0]).add(i, 'hour').format("DD-MM-yyyy"))
      
    }
    // console.log(times)
    return [times,counts]
  }

  const setCountSerie = (dataLean) => {
    let start_energy  = Math.trunc((countSliderValue[0]-dataLean[0][2])/dataLean[0][3])
    let end_energy = Math.trunc((countSliderValue[1]-dataLean[0][2])/dataLean[0][3])
    let start_time = (countTimeValue[0].getTime()-dataLean[0][0])/1000/3600
    let end_time = (countTimeValue[1].getTime()+24*3600*1000-dataLean[0][0])/1000/3600
    let data = loadCountSerie(dataLean,start_energy, end_energy,start_time,end_time)
    data = createChartData(data[0],data[1])
    setCountData(data)
  }

  const loadSpectrum = (dataLean,inf_time, sup_time) => {

    let energies = []
    let densities = new Array(dataLean[1][0].length); for (let i=0; i<dataLean[1][0].length; ++i) densities[i] = 0;
    let total_density = 0
    
    for (var j = 0; j<dataLean[1][0].length;j++) {
      energies[j] = dataLean[0][2]+j*20
    }
    for (var i = inf_time; i<=sup_time;i++) {
      for (var j = 0; j<dataLean[1][0].length;j++) {
        densities[j] = densities[j]+dataLean[1][i][j]
        total_density += dataLean[1][i][j]
      }
    }
    for (var j = 0; j<densities.length;j++) {
      densities[j] /= total_density
    }
    return [energies,densities]
  };

  const setSpectrum = (dataLean) => {
    let start_time = (spectrumTimeValue[0].getTime()-dataLean[0][0])/1000/3600
    let end_time = (spectrumTimeValue[1].getTime()-dataLean[0][0])/1000/3600
    let data = loadSpectrum(dataLean,start_time,end_time)
    data = createChartData(data[0],data[1])
    setSpectrumData(data)
  } 


  const diff_date_in_hour = (date1,date2) => {
    var diff_time = date2.getTime()-date1.getTime()
    return diff_time / (1000 * 3600);
  }



  const download_CSV = (data, filename) => {
    // -----------Transform data into json then CSV and download it --------------------
    data.map((item) => {item.x = moment(spectrumTimeValue[0]).add(item.x, 'hour').format("DD/MM/yyyy")})
    data = JSON.stringify(data, undefined, 4);
    const csvData = csvjson.toCSV(data, {
      headers: 'key'
    });
    downloadFile(csvData, filename)
  }


  const downloadFile = (data, filename) => {
    //  ------------------- Download any type of data -----------------------
    const contentType = 'application/octet-stream';
    if(!data) {
        console.error(' No data')
        return;
    }

    var blob = new Blob([data], {type: contentType}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  [contentType, a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
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
      
      <Grid container spacing={3}>
      <Grid item xs={12}>
      {/* <Paper> */}
        <Grid container className="count-container">
          <Grid item xs={12}>
            <h4 classname = 'title' style={{marginTop : "20px", marginBottom: "20px"}}>Taux de comptage temporel</h4>
          </Grid>
          
          <Grid container justify = 'center' spacing = {3} className="periode-container">
            <Grid item xs = {10}>
              <Grid container>
            <Grid item xs={12}>
              <h6 style={{marginBottom:"15px", marginTop:"50px"}}>Période</h6>
            </Grid>
            <Grid item xs={12} sm = {6}>
              <p style={{marginRight:"20px", marginLeft:"20px", marginTop : '20px'}}>Début</p>
              <DatePicker minDate={new Date(dataLean[0][0])} maxDate={new Date(countTimeValue[1].getTime())} dateFormat="dd/MM/yyyy" selected={countTimeValue[0]} onChange={date => handleCountTimeChange(false,date)} />
            </Grid>
            <Grid item xs={12} sm = {6}> 
              <p style={{marginLeft:"20px",marginRight:"20px", marginTop : '20px'}}>Fin</p>
              <DatePicker minDate={new Date(countTimeValue[0].getTime())} maxDate={new Date(dataLean[0][1])} dateFormat="dd/MM/yyyy" selected={countTimeValue[1]} onChange={date => handleCountTimeChange(true,date)} />
            </Grid>
            </Grid>
            </Grid>
          </Grid> 

          <Grid container justify = 'center' alignItems = 'center' >
          <Grid item xs={12}>
            <h6 style={{marginBottom:"20px", marginTop:"50px"}}>Gamme d'énergie</h6>
          </Grid>
         
          <Grid item xs={9} >
            <Slider
            min={dataLean[0][2]}
            max={dataLean[0][2]+dataLean[0][3]*dataLean[0][4]}
            step={dataLean[0][3]}
            value={countSliderValue}
            onChange={handleCountSliderChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            marks={[{value:dataLean[0][2],label:dataLean[0][2].toString()+" keV"},{value:dataLean[0][2]+dataLean[0][3]*dataLean[0][4],label:(dataLean[0][2]+dataLean[0][3]*dataLean[0][4]).toString()+" keV"}]}
            />
          
          </Grid>

          <Grid  xs={12} sm = {9}>
          {/* Count Serie */}

          <ResponsiveContainer width='100%' height={400} >
                  
              <LineChart
              width={50}
              height={300}
              data={countData}
              margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
              }}
              >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
              dataKey = 'x'
              domain = {['auto', 'auto']}
              name = 'Time'
              type = 'number'
              tickFormatter = {(hours) => moment(countTimeValue[0]).add(hours, 'hour').format("DD/MM/yyyy")}
              label={{ value: 'Date', position: 'insideBottomRight', offset: -20}} />
              <YAxis  domain={[0, 'maxData']}/>
              <Legend verticalAlign = 'bottom' />
              <Line name="Coups/s" type="monotone" dataKey="y" stroke="#82ca9d" dot={false} />
              </LineChart>
          </ResponsiveContainer>
          
          <Button classname = 'download_button' onClick={() => download_CSV(countData, "count_data.csv")}>Téléchargement des données</Button>
          </Grid>  
          </Grid>
        </Grid>
        
        {/* </Paper> */}
        </Grid>
      </Grid>

      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container spacing={3}>
        <Grid item xs={12}>
        {/* <Paper> */}
          <Grid container className="spectrum-container">
            <Grid item xs={12}>
              <h4 classname = 'title' style={{marginTop:"20px", marginBottom : "20px"}}>Spectre en énergie</h4>
            </Grid>  
            <Grid container justify = 'center' spacing = {3} className="periode-container">
             <Grid item xs = {10}>
              <Grid container>
                <Grid item xs={12}>
                  <h6 style={{marginBottom:"15px",marginTop:"50px"}}>Période</h6>
                </Grid>

                  <Grid item xs={12} sm = {6}>
                    <p style={{marginRight:"20px", marginLeft:"20px", marginTop : "20px"}}>Début</p>
                      <DatePicker 
                        minDate={new Date(dataLean[0][0])} 
                        maxDate={new Date(spectrumTimeValue[1].getTime())} 
                        timeInputLabel="Heure :"
                        dateFormat="dd/MM/yyyy h:mm"
                        showTimeInput 
                        selected={spectrumTimeValue[0]} 
                        onChange={date => {
                          if ((date > dataLean[0][1]) ||(date < dataLean[0][0]) ) {
                            alert("Erreur : Merci de bien sélectionner une date entre " + new Date(dataLean[0][0]).toString() + 'et '+ new Date(dataLean[0][1]).toString()  );
                          } else handleSpectrumTimeChange(false,date)}} />
                  </Grid>
                  <Grid item xs={12} sm = {6}>
                    <p style={{marginLeft:"20px",marginRight:"20px", marginTop : "20px"}}>Fin</p>
                    <DatePicker 
                      minDate={new Date(spectrumTimeValue[0].getTime())} 
                      maxDate={new Date(dataLean[0][1])}               
                      timeInputLabel="Heure :"
                      dateFormat="dd/MM/yyyy h:mm"
                      // showTimeInput  
                      selected={spectrumTimeValue[1]} 
                      onChange={date => { 
                        if ((date > dataLean[0][1]) ||(date < dataLean[0][0]) ) {
                        alert("Erreur : Merci de bien sélectionner une date entre " + new Date(dataLean[0][0]).toString() + 'et '+ new Date(dataLean[0][1]).toString()  );
                      } else handleSpectrumTimeChange(true,date)}} />
                  </Grid>
            </Grid>
            </Grid>
          </Grid> 
          <Grid container justify = 'center' alignItems = 'center' >
          <Grid  xs={12} sm = {9}>
          <Box margin = '5em' color = 'white'>
          </Box>
          <ResponsiveContainer width='100%' height={400}>
                  
              <LineChart
              width={50}
              height={300}
              data={spectrumData}
              margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
              }}
          >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
              dataKey = 'x'
              domain = {['0', 'maxData']}
              name = 'Time'
              type = 'number'
              label={{ value: 'Energie (keV)', position: 'insideBottomRight', offset : -6}} />
              <YAxis  domain={[0, 'maxData']}/>
              <Legend verticalAlign="bottom" align = 'left'/>
              <Line name="Densité d'énergie" type="monotone" dataKey="y" stroke="#82ca9d" dot={false} />
          </LineChart>
          </ ResponsiveContainer>
          
          <Button marginTop = "20px" classname = 'download_button' onClick={() => download_CSV(spectrumData, "spectrum_data.json")}>Téléchargement des données</Button>
          </Grid>
          </Grid>
          </Grid>
          {/* </Paper> */}
          </Grid>
        </Grid> 
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Download dataLean={dataLean} detectorId = {detectorId}/>
      </TabPanel>
    

    </div> }
        


    </div>

   )

 }

export default DataVisu