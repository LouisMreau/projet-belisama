import {React, useState, useEffect, useRef, Component } from 'react'
import './style.css'
import {Link, useParams} from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';
import moment from 'moment'
// import dataLean from '../../resources/data/data_lean.json'
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
* @function Energy
**/



const Energy = (props) => {
    const detectorId  = props.detectorId;
    const dataLean = props.dataLean;
    const [countTimeValue, setCountTimeValue] = useState([]);
    const [spectrumTimeValue, setSpectrumTimeValue] = useState([]);
    const [spectrumData, setSpectrumData] = useState([]);



  useEffect(() => {
    if (dataLean.length > 0) { setSpectrum(dataLean) }
  },[spectrumTimeValue]);



  useEffect(() => {
    if (dataLean.length > 0) {
      setSpectrumTimeValue([new Date(dataLean[0][0]),new Date(dataLean[0][1])])
    }
  },[dataLean])





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

  

  return(



        <Grid container spacing={3}>
        <Grid item xs={12}>
        <Paper>
          <div className="spectrum-container">
              <h4 classname = 'title' style={{marginTop:"20px", marginBottom : "20px"}}>Spectre en énergie</h4>
              <h6 style={{marginBottom:"20px"}}>Période</h6>
                <div className="periode-container">
                  <Grid item xs={12} sm = {6}>
                    <p style={{marginRight:"20px", marginLeft:"20px"}}>Début</p>
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
                    <p style={{marginLeft:"20px",marginRight:"20px"}}>Fin</p>
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
                </div>

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
              label={{ value: 'Energie (keV)', position: 'insideBottomRight', offset: 0}} />
              <YAxis  domain={[0, 'maxData']}/>
              <Legend />
              <Line name="Densité d'énergie" type="monotone" dataKey="y" stroke="#82ca9d" dot={false} />
          </LineChart>
          </ ResponsiveContainer>
          <Button classname = 'download_button' onClick={() => download_CSV(spectrumData, "spectrum_data.json")}>Téléchargement des données</Button>
          </div>
          </Paper>
          </Grid>
        </Grid>
   

   )

 }

export default Energy