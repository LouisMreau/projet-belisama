import {React, useState, useEffect, useRef, Component } from 'react'
import './style.css'
import moment from 'moment'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Grid, Container, Button, Paper, Box, Typography} from '@material-ui/core';
import csvjson from 'csvjson'
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils'
import FileSaver from 'file-saver';


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
    
    const ListRef = useRef(false);
    const MonthListRef = useRef(false);

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
          setDownloadRawTimeValue([new Date(),new Date()])
          setDownloadRawMonthValue(new Date())
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
    
      const zipMultipleFiles = (fileList) => {
        // ----------------------- Telechargement et zip -----------------------
        var zip = new JSZip();  
        fileList.map((item, index) => {
          zip.file(item.slice(-24), urlToPromise(item), {binary:true});
        })
        zip.generateAsync({type:"blob"})
            .then(function (content) {
                FileSaver.saveAs(content, "donnees_brutes.zip");})
            }
    
    // Option1

      

      const downloadMultipleDayData = (startDate, endDate, detector_id) => {
        var AWS = require('aws-sdk');
        AWS.config.update(
          {
            accessKeyId: "AKIAUS5DHFAYTT34JPZ6",
            secretAccessKey: "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",
          }
          );
          
        var s3 = new AWS.S3();
    
        var download_day = new Date(startDate)
        download_RawFile(download_day, detector_id, s3)
        while(download_day < endDate){          
          var newDate = download_day.setDate(download_day.getDate() + 1);
          download_day = new Date(newDate);
          download_RawFile(download_day, detector_id, s3)
        } 
        }
      
      const downloadMonthRawFile = (download_month_year, detector_id, s3) => {
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
          Prefix: detector_id + '/' + month_year.format('YYYYMM').toString() + '/' 
        };
    
        const getFileFromS3 = (bucketParams) => {
          
          s3.listObjects(bucketParams, function(err, data) {
            if (err) console.log(err); // an error occurred
            else if (data.Contents.length == 0) {
              alert("Aucune donnée à la date sélectionnée");
            } else {
              var table = [...monthFileList];
              data.Contents.forEach(obj => {
                var suffixe = obj.Key.toString()
                table.push("https://data-belisama.s3.eu-west-3.amazonaws.com/" + suffixe) 
              })
              MonthListRef.current = true;
              setMonthFileList(table)
            }
            })
        }
        getFileFromS3(bucketParams)    
      }
      
      const download_RawFile = (download_day, detector_id, s3) => {
        var fileList = []
        var day = moment([download_day.getFullYear(), download_day.getMonth(), download_day.getDate()])
        var bucketParams = {
          Bucket: "data-belisama",
          Prefix: detector_id + '/' + day.format('YYYYMM').toString() + '/' + day.format('YYYYMMDD').toString()
        };
    
        const getFileFromS3 = (bucketParams) => {
          
          s3.listObjects(bucketParams, function(err, data) {
            if (err) console.log(err); // an error occurred
            else if (data.Contents.length == 0) {
              alert("Aucune donnée à la date sélectionnée");
            } else {
              var table = [...fileList];
              data.Contents.forEach(obj => {
                var suffixe = obj.Key.toString()
                table.push("https://data-belisama.s3.eu-west-3.amazonaws.com/" + suffixe) 
              })
              ListRef.current = true;
              setFileList(table)
            }
            })
        }
        getFileFromS3(bucketParams)    
      }

// option 2

      // const download_RawFile = (download_day, detector_id, s3, table) => {
      //   var day = moment([download_day.getFullYear(), download_day.getMonth(), download_day.getDate()])
      //   var bucketParams = {
      //     Bucket: "data-belisama",
      //     Prefix: detector_id + '/' + day.format('YYYYMM').toString() + '/' + day.format('YYYYMMDD').toString()
      //   };
      //   s3.listObjects(bucketParams, function(err, data) {
      //       if (err) console.log(err); // an error occurred
      //       else if (data.Contents.length == 0) {
      //         alert("Aucune donnée à la date sélectionnée");
      //       } else {
      //         data.Contents.forEach(obj => {
      //           var suffixe = obj.Key.toString()
      //           table.push("https://data-belisama.s3.eu-west-3.amazonaws.com/" + suffixe) 
      //         })
      //       }
      //       })
      //   return table   
      // }

      // const downloadMultipleDayData = (startDate, endDate, detector_id) => {
      //   var AWS = require('aws-sdk');
      //   AWS.config.update(
      //     {
      //       accessKeyId: "AKIAUS5DHFAYTT34JPZ6",
      //       secretAccessKey: "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",
      //     }
      //     );
          
      //   var s3 = new AWS.S3();
      //   var table = [...fileList];
      //   var download_day = new Date(startDate)
      //   while(download_day <= endDate){   
      //     table = download_RawFile(download_day, detector_id, s3, table)       
      //     var newDate = download_day.setDate(download_day.getDate() + 1);
      //     download_day = new Date(newDate);
      //   }
      //   ListRef.current = true;
      //   setFileList(table) 
      //   console.log(fileList)
      //   }


    return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper> 
              <div className="download-container">
                <Grid item xs={12}>
                <h4 classname = 'title' style={{marginBottom:"20px"}}>Téléchargement</h4>
                </Grid>
                <Grid container spacing = {3}>
                <Grid item xs={12}>
                  <Grid container>
                  <Grid item xs={12}>
                  <Paper>
                    <div className = 'download_data'>
                    <h6 style={{margin: "20px"}}>Données traitées</h6>
                    {/* <Grid container direction="row" justify = 'center' className="periode-container">
                      <Grid item xs={12} sm = {6}>
                        <p style={{marginRight:"20px", marginLeft:"20px"}}>Début</p>
                        <DatePicker minDate={new Date(props.dataLean[0][0])} maxDate={new Date(downloadTimeValue[1]).getTime()} dateFormat="dd/MM/yyyy" selected={downloadTimeValue[0]} onChange={date => handleDownloadTimeChange(false,date)} />
                      </Grid>
                      <Grid item xs={12} sm = {6}> 
                        <p style={{marginLeft:"20px",marginRight:"20px"}}>Fin</p>
                        <DatePicker minDate={new Date(downloadTimeValue[0]).getTime()} maxDate={new Date(props.dataLean[0][1])} dateFormat="dd/MM/yyyy" selected={downloadTimeValue[1]} onChange={date => handleDownloadTimeChange(true,date)} />
                      </Grid>
                    </Grid>  */}
                    <Button classname = 'download_button' onClick={() => downloadAsJsonFile(props.dataLean, "dataLean.json")}>Téléchargement des données traitées</Button>
                    
                    </div>
                  </Paper>
                  </Grid>
                  </Grid>
                </Grid>


                <Grid item xs={12}>
                  <Grid container>
                  <Grid item xs={12}>
                    <Paper >
                      <div className = 'download_data'>

                    <h6 style={{margin: "20px"}}>Données brutes par jour </h6>
                    <Grid container direction="row" justify="center" className="periode-container">
                      <Grid item xs={12} sm = {6}>
                        <p style={{marginRight:"20px", marginLeft:"20px", marginTop : '15px', marginBottom : '15px'}}>Début</p>
                        <DatePicker minDate={new Date('01-03-2021')} maxDate={new Date(downloadRawTimeValue[1]).getTime()} dateFormat="dd/MM/yyyy" selected={downloadRawTimeValue[0]} onChange={date => handleDownloadRawTimeChange(false,date)} />
                      </Grid>
                      <Grid item xs={12} sm = {6}> 
                        <p style={{marginLeft:"20px",marginRight:"20px", marginTop : '15px', marginBottom : '15px'}}>Fin</p>
                        <DatePicker minDate={new Date(downloadRawTimeValue[0]).getTime()} maxDate={new Date()} dateFormat="dd/MM/yyyy" selected={downloadRawTimeValue[1]} onChange={date => handleDownloadRawTimeChange(true,date)} />
                      </Grid>
                    </Grid> 
                    <Button classname = 'download_button' onClick={() => downloadMultipleDayData(new Date(downloadRawTimeValue[0]), new Date(downloadRawTimeValue[1]), props.detectorId )}>Téléchargement des données brutes</Button>
                    </div>
                    </Paper>
                    </Grid>
                    </Grid>
                  </Grid>

                <Grid item xs={12}>
                  <Grid container>
                  <Grid item xs={12}>
                    <Paper >
                      <div className = 'download_data'>    
                    <h6 style={{margin: "20px"}}>Données brutes par mois </h6>
                    <Grid container direction="row" justify="center" className="periode-container">
                      <Grid item xs={12} sm = {6}>
                        <p style={{marginRight:"20px", marginLeft:"20px", marginTop : '15px', marginBottom : '15px'}}>Mois</p>
                        <DatePicker
                          minDate={new Date('03-2021')}
                          maxDate = {new Date()}
                          selected={downloadRawMonthValue}
                          onChange={(date) => setDownloadRawMonthValue(date)}
                          dateFormat="MM/yyyy"
                          showMonthYearPicker
                          showFullMonthYearPicker
                        />
                      </Grid>
            
                    </Grid> 
                    <Button classname = 'download_button' onClick={() => {downloadMonthRawFile(downloadRawMonthValue, props.detectorId)}}>Téléchargement des données brutes</Button>

                    </div>
                    </Paper>
                    </Grid>
                    </Grid>
                  </Grid>

                </Grid>
              </div>
            </Paper> 
          </Grid>
        </Grid>


    )
}

export default Download