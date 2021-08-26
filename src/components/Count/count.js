import {React, useState, useEffect, useRef, Component } from 'react'
import './style.css'
import {Link, useParams} from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer, Label } from 'recharts';
import Chart from "react-apexcharts";
import moment from 'moment'
import Slider from '@material-ui/core/Slider';
import { getDefaultNormalizer } from '@testing-library/dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {Grid, Container, Button, Paper, Box, Typography, Breadcrumbs} from '@material-ui/core';
import CloudIcon from '@material-ui/icons/Cloud';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import csvjson from 'csvjson'

import Help from '../Help/help'
import OpenWeatherWidget from '../Weather/openWeatherWidget';



/**
* @author
* @function Count
* Permet d'afficher le graphique de taux de comptage pour un détecteur (chargement des données réalisé au préalable et donné en props)
**/



const Count = (props) => {
  const detectorId  = props.detectorId;
  const dataDetector = props.dataDetector
  var installation_date = dataDetector.filter(function (detector) {
    return (detector.id == detectorId);
    })[0].installation_date
  installation_date = installation_date + 'T00:00:00'

  var city = dataDetector.filter(function (detector) {
    return (detector.id == detectorId);
    })[0].city

  var weatherURL = dataDetector.filter(function (detector) {
    return (detector.id == detectorId);
    })[0].weatherURL

  var dataLean = props.dataLean;
  const [countSliderValue, setCountSliderValue] = useState([dataLean[0][2], dataLean[0][2]+7000]);
  // Décalage horaire de 2 heures à prendre en compte 
  const [countTimeValue, setCountTimeValue] = useState([new Date(installation_date),new Date(dataLean[0][1]-2*3600*1000)]);
  const [countData, setCountData] = useState([]);
  const [showWeather, setShowWeather] = useState(false)
  const [color, setColor] = useState("primary")

  useEffect(() => {
    if (dataLean.length > 0) 
      setCountSerie(dataLean) 
    },[countTimeValue,countSliderValue]);

  useEffect(() => {
    if (dataLean.length > 0) {
      setCountSliderValue([dataLean[0][2], dataLean[0][2]+7000])
      // Décalage horaire de 2 heures à prendre en compte 
      setCountTimeValue([new Date(installation_date),new Date(dataLean[0][1]-2*3600*1000)])
    }},[props.dataLean]
  )


  const handleCountSliderChange = (event, newValue) => {
    setCountSliderValue(newValue);
  };

  const handleCountTimeChange = (isEndTime, newValue) => {
    if (isEndTime) { setCountTimeValue([countTimeValue[0],newValue]); }
    else { setCountTimeValue([newValue,countTimeValue[1]]); }
  };


  function handleWeather() {
    var x = document.getElementById("weather");
    if (!showWeather) {
        x.style.display = "block";
        setColor("active")
        setShowWeather(true)
    } else {
        x.style.display = "none";
        setShowWeather(false)
        setColor("primary")
    }
    }

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
    for (var i = inf_time; i<=sup_time;i++) {
      counts.push(dataLean[1][i].slice(inf_energy,sup_energy).reduce((a, b) => a + b, 0))
      times.push(new Date(i*3600*1000 + dataLean[0][0]))
    }
    return [times,counts]
  }

  const setCountSerie = (dataLean) => {
    let start_energy  = Math.trunc((countSliderValue[0]-dataLean[0][2])/dataLean[0][3])
    let end_energy = Math.trunc((countSliderValue[1]-dataLean[0][2])/dataLean[0][3])
    let start_time = (countTimeValue[0]-dataLean[0][0])/1000/3600
    let end_time = Math.trunc((countTimeValue[1]-dataLean[0][0])/1000/3600)
    let data = loadCountSerie(dataLean,start_energy, end_energy,start_time,end_time)
    data = createChartData(data[0],data[1])
    setCountData(data)
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

  var series = [{
    name: 'Nombre de photons par heure',
    data: countData
  }]

  const options = {
    chart: {
      type: 'line',
      stacked: false,
      width: '100%',
      animations : {
        enabled : false,
      },
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        show : true, 
        autoSelected: 'zoom',
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
        },
        export: {
          csv: {
            filename: 'comptage_' + detectorId,
            columnDelimiter: ';',
            headerCategory: 'Date',
            headerValue: 'Nombre de photons par heure',
            dateFormatter : function(x) {return moment(x).format('YYYY-MM-DD HH:m');},
          },
          svg: {
            filename: "comptage_"+ detectorId,
          },
          png: {
            filename: "comptage_"+ detectorId,
          }
        },
      },
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
      text: 'Taux de comptage',
      align: 'left'
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      lines: {
        show: true,
      },
      title: {
        text: 'Nombre de photons par heure'
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'dd/MM/yyyy, HH:mm',
        datetimeUTC: false,
      },
      lines: {
        show: true,
      },
      title: {
        text: 'Date'
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(0);
        }
      },
      x: {
        format: "dd/MM/yyyy, HH:mm",
      },
    },
    responsive: [{
      breakpoint: 600,
      options: {
          title: {
            text: 'Comptage',
            align: 'left'
          },
          yaxis: {
            show : true,  
            tickAmount : 3,
          }, 
          toolbar: {
            show : false, 

          },  
          tooltip: {
            style: {
              fontSize: '8px',
            },
            x: {
              show: false,},
            y: {
                title: {
                    formatter: (seriesName) => "Photons par heure",
                },
            },
          },   
        }
      }
    ]
  }

  return(
    <Grid container spacing={3} justify = 'center'>
      <Grid item xs = {12}>
        <Breadcrumbs aria-label="breadcrumb">
            <Typography color="inherit">{city}</Typography>
            <Typography color="textPrimary">Comptage</Typography>
        </Breadcrumbs>
        </Grid>
      <Grid item xs={12}>
        <Grid id = "weather" style = {{display : 'none'}}>
        <OpenWeatherWidget  city = {city} weatherURL = {weatherURL}/>
        </Grid>
        <Grid container direction = 'row-reverse'>
          <Grid>
          <Help page = 'Count'/>
          </Grid>
          <Grid>
          <Box margin = '1em'></Box>
          </Grid>
          <Grid>
          <Button variant="outlined" color={color} startIcon={<CloudIcon />} onClick={() => {handleWeather()}}>Météo</Button>
          </Grid>
        </Grid>
        <Grid container className="count-container">
          <Grid item xs={12}>
            <h4 classname = 'title' style={{ marginTop : "-30px", marginBottom: "20px"}}>Taux de comptage temporel</h4>
          </Grid>
          <Grid container justify = 'center' spacing = {3} className="periode-container">
            <Grid item xs = {12}>
              <Grid container>
                <Grid item xs={12}>
                  <h6 style={{marginBottom:"10px", marginTop:"50px"}}>Période</h6>
                </Grid>
                <Grid item xs={12} sm = {6}>
                  <p style={{marginRight:"20px", marginLeft:"20px", marginTop : '20px'}}>Début</p>
                  <DatePicker minDate={new Date(installation_date)} maxDate={new Date(dataLean[0][1]- 2*3600*1000)} dateFormat="dd/MM/yyyy" selected={countTimeValue[0]} onChange={date => handleCountTimeChange(false,date)} />
                </Grid>
                <Grid item xs={12} sm = {6}> 
                  <p style={{marginLeft:"20px",marginRight:"20px", marginTop : '20px'}}>Fin</p>
                  <DatePicker minDate={countTimeValue[0]} maxDate={new Date(dataLean[0][1]-2*1000*3600)} dateFormat="dd/MM/yyyy" selected={countTimeValue[1]} onChange={date => handleCountTimeChange(true,date)} />
                </Grid>
              </Grid>
            </Grid>
          </Grid> 

          <Grid container justify = 'center' alignItems = 'center' >
            <Grid item xs={12}>
              <h6 style={{marginBottom:"20px", marginTop:"50px"}}>Gamme d'énergie</h6>
            </Grid>
            <Grid item xs={9}>
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

            <Grid item xs={12} sm = {9}>
              <Box margin = '2em' color = 'white'></Box>
              <Chart options={options} series={series} />
            </Grid> 
            <Grid  xs={12} sm = {9}>  
              <Box margin = '2em' color = 'white'></Box>
            </Grid> 
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )}

export default Count