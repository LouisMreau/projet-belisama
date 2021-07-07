import {React, useState, useEffect, useRef, Component } from 'react'
import './style.css'
import {Link, useParams} from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer, Label } from 'recharts';
import moment from 'moment'
import Slider from '@material-ui/core/Slider';
import { getDefaultNormalizer } from '@testing-library/dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

import {Grid, Container, Button, Paper, Box, Typography} from '@material-ui/core';
import csvjson from 'csvjson'

import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils'
import FileSaver from 'file-saver';

import Download from '../Download/index';


/**
* @author
* @function Count
**/



const Count = (props) => {
  const detectorId  = props.detectorId;
  var dataLean = props.dataLean
  const [countSliderValue, setCountSliderValue] = useState([dataLean[0][2], dataLean[0][2]+500]);
  const [countTimeValue, setCountTimeValue] = useState([new Date(dataLean[0][0]),new Date(dataLean[0][1])]);
  const [countData, setCountData] = useState([]);
  const isLoadinData = props.isLoadinData; 
  const loadingMessage = props.loadingMessage;
  

  useEffect(() => {
    if (dataLean.length > 0) 
    { setCountSerie(dataLean) }
  },[countTimeValue,countSliderValue]);


  useEffect(() => {
    if (dataLean.length > 0) {
      setCountSliderValue([dataLean[0][2], dataLean[0][2]+500])
      setCountTimeValue([new Date(dataLean[0][0]),new Date(dataLean[0][1])])
    }
  }
  ,[props.dataLean]
  )

  // useEffect(() => {
  //   loadData();
  // },[])

  const handleCountSliderChange = (event, newValue) => {
    setCountSliderValue(newValue);
  };

  const handleCountTimeChange = (isEndTime, newValue) => {
    if (isEndTime) { setCountTimeValue([countTimeValue[0],newValue]); }
    else { setCountTimeValue([newValue,countTimeValue[1]]); }
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



  const download_CSV = (data, filename) => {
    // -----------Transform data into json then CSV and download it --------------------
    data.map((item) => {item.x = moment(countTimeValue[0]).add(item.x, 'hour').format("DD/MM/yyyy")})
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

  

  return(

      <Grid container spacing={3}>
      <Grid item xs={12}>
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

          <ResponsiveContainer width='100%' height={400} >
                  
              <LineChart
              width={730} height={250}
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
              dy={0}
              label={{ value: 'Date', position: 'insideBottomRight', offset : -5}} />
              <YAxis  domain={[0, 'maxData']}/>
              <Legend wrapperStyle={{position: 'relative'}} />
              <Line name="Coups/s" type="monotone" dataKey="y" stroke="#82ca9d" dot={false} />
              </LineChart>
          </ResponsiveContainer>
          <Box margin = '5em' color = 'white'>
      </Box>
          <Button classname = 'download_button' onClick={() => download_CSV(countData, "count_data.csv")}>Téléchargement des données</Button>
          </Grid>  
          </Grid>
        </Grid>
        </Grid>
      </Grid>
      
      

      )

 }

export default Count