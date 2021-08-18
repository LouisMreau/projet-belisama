import {React, useState, useEffect, useRef, Component } from 'react'
import './style.css'
import ReactApexChart from "react-apexcharts";
import moment from 'moment'
import "moment/locale/fr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

import {Grid, Container, Button, Paper, Box, Typography, FormControlLabel, Switch} from '@material-ui/core';
import csvjson from 'csvjson'

import dataDetector from '../../resources/data/data_detector.json';
import EnergyViewer from '../Chart/EnergyViewer'

/**
* @author
* @function EnergyPeriod
* Permet à l'utilisateur de sélectionner deux périodes pour l'étude du spectre en énergie
* Construit le nuage de points pour le  spectre en énergie et appelle EnergyViewer pour afficher les deux graphiques superposés 

**/



const EnergyPeriod = (props) => {
    const detectorId  = props.detectorId;
    var dataLean = props.dataLean;
  
    var installation_date = dataDetector.filter(function (detector) {
        return (detector.id == detectorId);
        })[0].installation_date
      installation_date = installation_date + 'T00:00:00'
    
      const maximumOfTwoDates = (date1, date2) => {
        return (date1 > date2 ? date1 : date2)
      }
    
      const addDays = (date, number) => {
        var newDay = new Date()
        newDay = date.setDate(date.getDate() + number)
        return newDay
    }


    // Décalage horaire de 2 heures à prendre en compte 
    const [spectrumData1, setSpectrumData1] = useState([]);
    const [spectrumData2, setSpectrumData2] = useState([]);
    const [startDate1, setStartDate1] = useState(new Date(installation_date));
    const [endDate1, setEndDate1] = useState(addDays(new Date(startDate1), 7));
    const [startDate2, setStartDate2] = useState(endDate1);
    const [endDate2, setEndDate2] = useState(addDays(new Date(startDate2), 7));
    const [dataDiff, setEnergyDifference] = useState([]);
    const name = [["Période1", "Période2"], 'Spectre en énergie']
    const nameDiff = [["Différence période1 - période2"], "Différence période1 - période2"]
    const [loadingData, setLoadingData] = useState(false)
    const [switchState, setSwitchState] = useState(false);
  
    const handleChangeSwitch = (event) => {
      setLoadingData(true)
      console.log(switchState)
      setSwitchState(event.target.checked)
    };

    useEffect(() => {
      if (switchState) {
        switchToLogarithmData(spectrumData1, spectrumData2).then((data1, data2) => {
            setSpectrumData1(data1)
            setSpectrumData2(data2)
          })}
      else {
        setSpectrum(dataLean)
        }
    setLoadingData(false)
    }
    ,[switchState])

    useEffect(()=> {
      if (switchState)
      switchToLogarithmDifference(dataDiff).then((data) => {
        setEnergyDifference(data)
      })
    }, [switchState])


    useEffect(() => {
        if (dataLean.length > 0) { 
          setSpectrum(dataLean) 
          setSwitchState(false)
        }
      },[startDate1, startDate2, endDate1, endDate2 ]);
    
    
      useEffect(() => {
        if (dataLean.length > 0) {
          // Décalage horaire de 2 heures à prendre en compte 
          setStartDate1(new Date(installation_date))
          setEndDate1(addDays(new Date(installation_date), 7))
          setStartDate2(addDays(new Date(installation_date), 7))
          setEndDate2(addDays(new Date(installation_date), 14))
          setSwitchState(false)
    
        }
      }
      ,[props.dataLean]
      )
  

  // On définit les heures limites du jeu de données traitées, attention, le fuseau horaire n'est pas le même
  const start_date_limit = moment(new Date(dataLean[0][0]))
  const end_date_limit = moment(new Date(dataLean[0][1]- 2*3600*1000))


  async function switchToLogarithmData(data1, data2) {
    let logData1 = data1
    let logData2 = data2
    for (let key in logData1) {
      let y1 = logData1[key].y;
      let y2 = logData2[key].y;
      y1 = Math.log(y1)
      y2 = Math.log(y2)
      logData1[key].y = y1
      logData2[key].y = y2
    }
    return Promise.resolve(logData1, logData2)
}

async function switchToLogarithmDifference(data) {
  let logDataDiff = data
  for (let key in logDataDiff) {
    let y3 = logDataDiff[key].y;
    y3 = Math.abs(y3);
    y3 = Math.log(y3)
    logDataDiff[key].y = y3
  }
  return Promise.resolve(logDataDiff)
}



  const createChartData = (xx,yy) => {
    let chartData = []
    for (var i = 0; i<yy.length; i++) {
      chartData.push({x:xx[i],y:yy[i]})
    }
    return chartData
  };



  const loadSpectrum = (dataLean,inf_time, sup_time, energy_interval) => {

    let energies = []
    let densities = new Array(dataLean[1][0].length); 
    for (let i=0; i<dataLean[1][0].length; ++i) densities[i] = 0;
    let total_density = 0
    
    for (var j = 0; j<dataLean[1][0].length;j++) {
      energies[j] = dataLean[0][2]+j*energy_interval
    }
    for (var i = inf_time; i<sup_time;i++) {
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
    let start_time1 = Math.trunc((startDate1.getTime()-dataLean[0][0])/1000/3600)
    let end_time1 = Math.trunc((endDate1-dataLean[0][0])/1000/3600)
    let start_time2 = Math.trunc((startDate2-dataLean[0][0])/1000/3600)
    let end_time2 = Math.trunc((endDate2-dataLean[0][0])/1000/3600)
    let data1 = loadSpectrum(dataLean,start_time1,end_time1, dataLean[0][3])
    let data2 = loadSpectrum(dataLean,start_time2,end_time2, dataLean[0][3])
    let dataDifference = [[],[]]
    dataDifference[0] = data1[0]
    dataDifference[1] = data1[1].map(function(item, index) {
      return item - data2[1][index];
    })
    dataDifference = createChartData(dataDifference[0], dataDifference[1])
    setEnergyDifference(dataDifference)
    data1 = createChartData(data1[0],data1[1])
    data2 = createChartData(data2[0],data2[1])
    setSpectrumData1(data1)
    setSpectrumData2(data2)

  } 




  return(

    <Grid container spacing={3}>
    <Grid item xs={12}>
    <Grid container className="spectrum-container">
        
        <Grid container justify = 'center' spacing = {3} className="periode-container">
            <Grid item xs = {10}>
            <Grid container spacing = {3}>
                <Grid item md={12} lg={6} xs = {12}>
                      <p>Période 1</p>
                      <DatePicker
                          selected={startDate1}
                          onChange={(date) => setStartDate1(date)}
                          selectsStart
                          startDate={startDate1}
                          endDate={endDate1}
                          minDate={new Date(installation_date)}
                          maxDate={new Date(dataLean[0][1]-2*3600*1000)}
                          timeInputLabel="Heure :"
                          timeFormat="HH:mm"
                          dateFormat="dd/MM/yyyy HH:mm"
                          showTimeInput 
                      />
                      <DatePicker
                          selected={endDate1}
                          onChange={(date) => setEndDate1(date)}
                          selectsEnd
                          startDate={startDate1}
                          endDate={endDate1}
                          minDate={startDate1}
                          maxDate={new Date(dataLean[0][1]-2*3600*1000)}
                          timeInputLabel="Heure :"
                          timeFormat="HH:mm"
                          dateFormat="dd/MM/yyyy HH:mm"
                          showTimeInput 
                      />
                </Grid>
                <Grid item md={12} lg={6} xs = {12}>
                      <p>Période 2</p>
                      <DatePicker
                          selected={startDate2}
                          onChange={(date) => setStartDate2(date)}
                          selectsStart
                          startDate={startDate2}
                          endDate={endDate2}
                          minDate={new Date(installation_date)}
                          maxDate={new Date(dataLean[0][1]-2*3600*1000)}
                          timeInputLabel="Heure :"
                          timeFormat="HH:mm"
                          dateFormat="dd/MM/yyyy HH:mm"
                          showTimeInput 
                      />
                      <DatePicker
                          selected={endDate2}
                          onChange={(date) => setEndDate2(date)}
                          selectsEnd
                          startDate={startDate2}
                          endDate={endDate2}
                          minDate={startDate2}
                          maxDate={new Date(dataLean[0][1]-2*3600*1000)}
                          timeInputLabel="Heure :"
                          timeFormat="HH:mm"
                          dateFormat="dd/MM/yyyy HH:mm"
                          showTimeInput 
                      />
                </Grid> 
            
            </Grid>
            </Grid>
        </Grid>
    {loadingData &&
     <Typography variant = 'h4'>Chargement des données</Typography>
    }
      {!loadingData &&
    <Grid container justify = 'center' alignItems = 'center' >

        <Grid item xs = {12} sm = {9}>
            <Box margin = '1.5em' color = 'white'>
            </Box>
            <EnergyViewer data = {[spectrumData1, spectrumData2]} name = {name}/>
        </Grid>

    <Grid item xs = {12} sm = {9}>
        <Box margin = '1.5em' color = 'white'>
        </Box>
        <EnergyViewer data = {[dataDiff]} name = {nameDiff}/>
    </Grid>
    
    <Grid item xs = {12} sm = {9}>

      <FormControlLabel
        control={
          <Switch
            checked={switchState}
            onChange={handleChangeSwitch}
            name="checked"
            color="primary"
          />
        }
        label="Echelle logarithmique"
      />

    </Grid>

    </Grid>
    }

    </Grid>
    </Grid>
    </Grid> 
   

   )

 }

export default EnergyPeriod