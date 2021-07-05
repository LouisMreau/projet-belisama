import {React, useState, useEffect, useRef, Component } from 'react'
import './style.css'
import moment from 'moment'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Grid, Container, Button, Paper, Box, Typography, CircularProgress} from '@material-ui/core';
import csvjson from 'csvjson'
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils'
import FileSaver from 'file-saver';


import Test from '../Test/index'


/**
* @author
* @function Download
**/



const Download = (props) => {

  const [downloadTimeValue, setDownloadTimeValue] = useState([]);
  const [downloadRawTimeValue, setDownloadRawTimeValue] = useState([]);
  const [downloadRawMonthValue, setDownloadRawMonthValue] = useState();
  const [fileList, setFileList] = useState([]);
  const [monthFileList, setMonthFileList] = useState([]);
  const [isDownloadinData, setIsDownloadingData] = useState(false);
  const [isDownloadinMonthData, setIsDownloadingMonthData] = useState(false);
  const [downloadingMessage, setDownloadingMessage] = useState("Chargement des données...");  
  
  const ListRef = useRef(false);
  const MonthListRef = useRef(false);
  const today = new Date()
  const yesterday = new Date().setDate(today.getDate() - 1)
  const oneMonthAgo = (date) => {
    const previousMonth = new Date();
    previousMonth.setMonth(date.getMonth() - 1);
    return previousMonth
  }

  var AWS = require('aws-sdk');
  AWS.config.update(
    {
      // accessKeyId: "AKIAUS5DHFAYTT34JPZ6",
      // secretAccessKey: "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",
      accessKeyId: "AKIAUS5DHFAYWPXFTIOH",
      secretAccessKey: "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",
    }
    );
    
  var s3 = new AWS.S3();

  useEffect(() => {
      if(ListRef.current){
      ListRef.current = false;
      zipMultipleFiles(fileList);
      }
  },[fileList])

  useEffect(() => {
    if(MonthListRef.current){
      MonthListRef.current = false;
    zipMultipleFiles(monthFileList);
    }
},[monthFileList])

  useEffect(() => {
      if (props.dataLean.length > 0) {
        setDownloadTimeValue([new Date(props.dataLean[0][0]),new Date(props.dataLean[0][1])])
        setDownloadRawTimeValue([yesterday,yesterday])
        setDownloadRawMonthValue(oneMonthAgo(today))
      }
    },[props.dataLean])

  const handleDownloadTimeChange = (isEndTime, newValue) => {
      if (isEndTime) { setDownloadTimeValue([downloadTimeValue[0],newValue]); }
      else { setDownloadTimeValue([newValue,downloadTimeValue[1]]); }
    };
  
  const handleDownloadRawTimeChange = (isEndTime, newValue) => {
    if (isEndTime) { setDownloadRawTimeValue([downloadRawTimeValue[0],newValue]); }
    else { setDownloadRawTimeValue([newValue,downloadRawTimeValue[1]]); }
  };

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

  function urlToPromise(url) {
    return new Promise(function(resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    }

  const fileNaming = (text) => {
    const regex = /[0-9]{6,}/g;
    return text.slice(text.search(regex))
  }

  // Option 1
  const zipMultipleFiles = (fileList) => {
    // ----------------------- Telechargement et zip -----------------------
    var zip = new JSZip();  
    fileList.map((item, index) => {
      zip.file(fileNaming(item), urlToPromise(item), {binary:true});
    })
    zip.generateAsync({type:"blob"})
        .then(function (content) {
            FileSaver.saveAs(content, "donnees_brutes.zip");
            setIsDownloadingData(false)
            setIsDownloadingMonthData(false)
          })
        }



    


  // Option 1

  function downloadMonthRawFile(download_month_year, detector_id) {
    return new Promise(function(resolve, reject) {
    var AWS = require('aws-sdk');
    AWS.config.update(
      {
        accessKeyId: "AKIAUS5DHFAYTT34JPZ6",
        secretAccessKey: "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",
      }
      );
      
    var s3 = new AWS.S3();
    var month_year = moment([download_month_year.getFullYear(), download_month_year.getMonth()])
    var bucketParams = {
      Bucket: "data-belisama",
      // Prefix: detector_id + '/' + month_year.format('YYYYMM').toString() + '/' 
      Prefix: detector_id + '/' + 'zipFiles' + '/' + month_year.format('YYYYMM').toString()
    };

    
      
      s3.listObjects(bucketParams, function(err, data) {
        if (err) console.log(err); // an error occurred
        else if (data.Contents.length == 0) {
          alert("Aucune donnée à la date sélectionnée");
        } else {
          var table = [];
          data.Contents.forEach(obj => {
            var suffixe = obj.Key.toString()
            table.push("https://data-belisama.s3.eu-west-3.amazonaws.com/" + suffixe) 
          })
          resolve(table)
          // MonthListRef.current = true;
          // setMonthFileList(table)
        }
        })
        
  })}

  function download_onceMonth(download_month_year, detector_id) {
    setIsDownloadingMonthData(true)
    downloadMonthRawFile(download_month_year, detector_id).then((table) => {zipMultipleFiles(table)})
  }

    // Option 2


    
  

  function download_RawFile(download_day, detector_id, s3, table) {
    return new Promise(function(resolve, reject) {
    var day = moment([download_day.getFullYear(), download_day.getMonth(), download_day.getDate()])
    var bucketParams = {
      Bucket: "data-belisama",
      // Prefix: detector_id + '/' + day.format('YYYYMM').toString() + '/' + day.format('YYYYMMDD').toString()
      Prefix: detector_id + '/' + 'zipFiles' + '/' + day.format('YYYYMMDD').toString()
    };
    s3.listObjects(bucketParams, function(err, data) {
        if (err) console.log(err); // an error occurred
        else if (data.Contents.length == 0) {
          alert("Aucune donnée à la date sélectionnée");
        } else {
          data.Contents.forEach(obj => {
            var suffixe = obj.Key.toString()
            table.push("https://data-belisama.s3.eu-west-3.amazonaws.com/" + suffixe) 
          })
          
        }
        resolve(table)
        })   
  })}

  async function downloadMultipleDayData(startDate, endDate, detector_id) {

    var table = [];
    var download_day = new Date(startDate)
    while(download_day <= endDate){   
      table = await download_RawFile(download_day, detector_id, s3, table)   
      var newDate = download_day.setDate(download_day.getDate() + 1);
      download_day = new Date(newDate);
    }
    return table
    }
    
  const download_once = (startDate, endDate, detector_id) => {
    setIsDownloadingData(true)
    downloadMultipleDayData(startDate, endDate, detector_id).then((table) => {zipMultipleFiles(table)})
  }




    return (

            // <Paper> 
              <Grid container justify = 'center' alignItems = 'center' className="download-container">
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <h4 className = 'title' style={{marginTop:"20px", marginBottom:"20px"}}>Téléchargement</h4>
                </Grid>
                <Grid container spacing = {3}>
                  <Grid item xs={12}>
                    <Paper square>
                      <Grid item justify = 'center'  className = 'download_data'>
                        <Grid>
                        <h6 style={{marginTop: "20px", marginBottom: "20px"}}>Données traitées</h6>
                        </Grid>
                        <Grid>
                        <Button classname = 'download_button' onClick={() => downloadAsJsonFile(props.dataLean, "dataLean.json")}>Téléchargement des données traitées</Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>


              <Grid item xs={12}>
                <Paper square>
                  <Grid item justify = 'center'  className = 'download_data'>

                    <Grid>
                    <h6 style={{margin: "20px"}}>Données brutes par jour </h6>
                    </Grid>

                    <Grid container direction="row" justify="center" className="periode-container">
                      <Grid item xs={12} sm = {6}>
                        <p style={{marginRight:"20px", marginLeft:"20px", marginTop : '15px', marginBottom : '15px'}}>Début</p>
                        <DatePicker minDate={new Date("07-01-2021")} maxDate={new Date(downloadRawTimeValue[1]).getTime()} dateFormat="dd/MM/yyyy" selected={downloadRawTimeValue[0]} onChange={date => handleDownloadRawTimeChange(false,date)} />
                      </Grid>
                      <Grid item xs={12} sm = {6}> 
                        <p style={{marginLeft:"20px",marginRight:"20px", marginTop : '15px', marginBottom : '15px'}}>Fin</p>
                        <DatePicker minDate={new Date(downloadRawTimeValue[0]).getTime()} maxDate={yesterday} dateFormat="dd/MM/yyyy" selected={downloadRawTimeValue[1]} onChange={date => handleDownloadRawTimeChange(true,date)} />
                      </Grid>
                    </Grid> 

                    <Grid>
                      <Button classname = 'download_button' onClick={() => download_once(new Date(downloadRawTimeValue[0]), new Date(downloadRawTimeValue[1]), props.detectorId)}>Téléchargement des données brutes</Button>
                    </Grid>

                    { isDownloadinData && 
                    <Grid item xs={12}>
                    <CircularProgress/>
                    </Grid>
                    }

                  </Grid>
                </Paper>
              </Grid>


              <Grid item xs={12}>
                <Paper square>
                  <Grid item justify = 'center'  className = 'download_data'>   
                    <Grid>
                      <h6 style={{margin: "20px"}}>Données brutes par mois </h6>
                    </Grid> 
                    <Grid container direction="row" justify="center" className="periode-container">
                      <Grid item xs={12} sm = {6}>
                        <p style={{marginRight:"20px", marginLeft:"20px", marginTop : '15px', marginBottom : '15px'}}>Mois</p>
                        <DatePicker
                          minDate={new Date('05-01-2021')}
                          maxDate = {oneMonthAgo(today)}
                          selected={downloadRawMonthValue}
                          onChange={(date) => setDownloadRawMonthValue(date)}
                          dateFormat="MM/yyyy"
                          showMonthYearPicker
                          showFullMonthYearPicker
                        />
                      </Grid>
                    </Grid> 
                    <Grid>
                      <Button classname = 'download_button' onClick={() => {download_onceMonth(downloadRawMonthValue, props.detectorId)}}>Téléchargement des données brutes</Button>
                    </Grid>
                    { isDownloadinMonthData &&
                      <Grid item xs={12}>
                    <CircularProgress/>
                    </Grid>
                    }
                    <Test/>
                  </Grid>
                </Paper>
              </Grid>


                </Grid>
                </Grid>
              </Grid>
            // </Paper> 



    )
}

export default Download