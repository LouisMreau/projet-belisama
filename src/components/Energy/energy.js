import {React, useState, useEffect, useRef, Component } from 'react'
import './style.css'
import ReactApexChart from "react-apexcharts";
import moment from 'moment'
import "moment/locale/fr";
import Slider from '@material-ui/core/Slider';
import { getDefaultNormalizer } from '@testing-library/dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

import {Grid, Container, Button, Paper, Box, Typography} from '@material-ui/core';
import csvjson from 'csvjson'

import dataDetector from '../../resources/data/data_detector.json';


/**
* @author
* @function Energy
**/



const Energy = (props) => {
    const detectorId  = props.detectorId;
    const dataLean = props.dataLean;
    var installation_date = dataDetector.filter(function (detector) {
      return (detector.id == detectorId);
      })[0].installation_date
    installation_date = installation_date + 'T00:00:00'
    // Décalage horaire de 2 heures à prendre en compte 
    const [spectrumTimeValue, setSpectrumTimeValue] = useState([new Date(installation_date),new Date(dataLean[0][1] - 2*3600*1000)]);
    const [spectrumData, setSpectrumData] = useState([]);



  useEffect(() => {
    if (dataLean.length > 0) { setSpectrum(dataLean) }
  },[spectrumTimeValue]);



  useEffect(() => {
    if (dataLean.length > 0) {
      // Décalage horaire de 2 heures à prendre en compte 
      setSpectrumTimeValue([new Date(installation_date),new Date(dataLean[0][1]- 2*3600*1000)])
    }
  },[dataLean])

  // On définit les heures limites du jeu de données traitées, attention, le fuseau horaire n'est pas le même
  const start_date_limit = moment(new Date(dataLean[0][0]))
  const end_date_limit = moment(new Date(dataLean[0][1]- 2*3600*1000))


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
    let start_time = (spectrumTimeValue[0].getTime()-dataLean[0][0])/1000/3600
    let end_time = (spectrumTimeValue[1].getTime()-dataLean[0][0])/1000/3600
    let data = loadSpectrum(dataLean,start_time,end_time, dataLean[0][3])
    data = createChartData(data[0],data[1])
    setSpectrumData(data)
  } 


  const diff_date_in_hour = (date1,date2) => {
    var diff_time = date2.getTime()-date1.getTime()
    return diff_time / (1000 * 3600);
  }

 

  const downloadAsJsonFile = (data, filename) => {
    // -------------- Transform data into json and download file ------------------
    const contentType = 'application/octet-stream';
    if(!data) {
        console.error(' No data')
        return;
    }
    if(!filename) filename = 'filetodownload.txt'
    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
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



  const download_CSV = (data, filename) => {
    // -----------Transform data into json then CSV and download it --------------------
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

  const CustomizedDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;
  
    if (cx % 10 == 0) {
      return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="red" viewBox="0 0 1024 1024">
        </svg>
      );
    }
  
  };



  var series = [{
    name: 'densité',
    data: spectrumData
  }]

  const options = {
    chart: {
      type: 'line',
      stacked: false,
      width: '100%',
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        export: {
          csv: {
            filename: "spectre_energie_" + detectorId,
            columnDelimiter: ';',
            headerCategory: 'Energie',
            headerValue: 'Densité',
          },
          svg: {
            filename:  "spectre_energie_" + detectorId,
          },
          png: {
            filename:  "spectre_energie_" + detectorId,
          }
        },
        autoSelected: 'zoom'
      }
    },
    colors:['#09476e'],
    stroke: {
      show: true,
      curve: 'smooth',
      width: 1.5,
      dashArray: 0,      
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    title: {
      text: 'Spectre en énergie',
      align: 'left'
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(3);
        },
      },
      lines: {
        show: true,
      },
      title: {
        text: 'Densité de photons'
      },
    },
    xaxis: {
      type: 'numeric',
      min : 50, 
      max : 10000,
      lines: {
        show: true,
      },
      title: {
        text: 'Energie (keV)'
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(3);
        }
      }
    }, 
    responsive : [
      {
        breakpoint: 600,
        options: {
            title: {
              text: 'Energie',
              align: 'left'
            },
            yaxis: {  
              title : {text : "Densité",},
              labels: {
                formatter: function (val) {
                  return val.toFixed(3);
                },},
            }, 
            xaxis: {
              min : 50, 
              max : 3000,
            },
            toolbar: {
              show : true, 
              autoSelected: 'zoom',

               
            }, 
            tooltip: {
              style: {
                fontSize: '8px',
              },
              x: {
                show: false,},
            }, 

            
        }
      }
    
    ]
  }

  

  return(



    <Grid container spacing={3}>
    <Grid item xs={12}>
      <Grid container className="spectrum-container">
        <Grid item xs={12}>
          <h4 classname = 'title' style={{marginTop:"20px", marginBottom : "20px"}}>Spectre en énergie</h4>
        </Grid>  
        <Grid container justify = 'center' spacing = {3} className="periode-container">
         <Grid item xs = {10}>
          <Grid container>
            <Grid item xs={12}>
              <h6 style={{marginBottom:"10px",marginTop:"50px"}}>Période</h6>
            </Grid>

              <Grid item xs={12} sm = {6}>
                <p style={{marginRight:"20px", marginLeft:"20px", marginTop : "20px"}}>Début</p>
                  <DatePicker 
                    minDate={new Date(installation_date)} 
                    maxDate={spectrumTimeValue[1]} 
                    timeInputLabel="Heure :"
                    timeFormat="HH:mm"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeInput 
                    selected={spectrumTimeValue[0]} 
                    onChange={date => {
                      if ((date.getTime() > dataLean[0][1] -2*3600*1000) ||(date.getTime() < dataLean[0][0]) ) {
                        alert("Erreur : Merci de bien sélectionner une date entre " + start_date_limit.format("DD/MM/YYYY HH:mm:ss") + ' et '+ end_date_limit.format("DD/MM/YYYY HH:mm:ss")  );
                      } else handleSpectrumTimeChange(false,date)}} />
              </Grid>
              <Grid item xs={12} sm = {6}>
                <p style={{marginLeft:"20px",marginRight:"20px", marginTop : "20px"}}>Fin</p>
                <DatePicker 
                  minDate={spectrumTimeValue[0]} 
                  maxDate={new Date(dataLean[0][1]-2*3600*1000)}               
                  timeInputLabel="Heure :"
                  timeFormat="HH:mm"
                  dateFormat="dd/MM/yyyy HH:mm"
                  showTimeInput  
                  selected={spectrumTimeValue[1]} 
                  onChange={date => { 
                    if ((date.getTime() > dataLean[0][1] -2*3600*1000) ||(date.getTime() < dataLean[0][0]) ) {
                    alert("Erreur : Merci de bien sélectionner une date entre " + start_date_limit.format("DD/MM/YYYY HH:mm:ss") + ' et '+ end_date_limit.format("DD/MM/YYYY HH:mm:ss")  );
                  } else handleSpectrumTimeChange(true,date)}} />
              </Grid>
        </Grid>
        </Grid>
      </Grid> 
      <Grid container justify = 'center' alignItems = 'center' >

     <Grid item xs = {12} sm = {9}>
     <Box margin = '1.5em' color = 'white'>
      </Box>
     <ReactApexChart options={options}
              series={series}
              />
      </Grid>
      
      </Grid>
      </Grid>
      </Grid>
    </Grid> 
   

   )

 }

export default Energy