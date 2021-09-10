import { React, useState, useEffect } from "react";
import "./style.css";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Grid,
  Container,
  Button,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Breadcrumbs,
  Hidden,
  Divider,
} from "@material-ui/core";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import FileSaver from "file-saver";
import Help from "../Help/help";

/**
 * @author
 * @function Download
 * Returns a downloading tool to download data for a particular period during the current month or for a particular month
 * The downloading requiers the URL of the different files that change with the creation date
 * detectorId is a string that indicates the id of the detector (eg. obsmeudon)
 * dataDetector is a json object that gives information about each detector (name, id, place,...)
 * dataLean is an array that enumerates the number of arriving photons for each energy interval and each hour. It has the following format :
 * [[start_timestamp, end_timestamp, start_energy, number_of_energy_interval][[first_hour],[second_hour],[],...,[last_hour]]].
 **/

const Download = (props) => {
  var dataDetector = props.dataDetector
  // Defining the installation data to ensure the visualization of the available data
  // installation_date is a date object
  var installation_date = dataDetector.filter(function (detector) {
    return detector.id == props.detectorId;
  })[0].installation_date;
  installation_date = installation_date + "T00:00:00";

  // Defining the city for the header on the top of the page
  var city = dataDetector.filter(function (detector) {
    return detector.id == props.detectorId;
  })[0].city;

  const [downloadRawTimeValue, setDownloadRawTimeValue] = useState([]);
  const [downloadRawMonthValue, setDownloadRawMonthValue] = useState();
  const [isDownloadinData, setIsDownloadingData] = useState(false);
  const [isDownloadinMonthData, setIsDownloadingMonthData] = useState(false);

  // --------------- Definition of the variables that limit the downloading calendar ---------------

  const today = new Date();
  var yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  // !!! Must substract 5 hours to the date because files are uploaded each day at 5AM
  yesterday.setHours(today.getHours() - 5);

  const firstDayofMonth = (date) => {
    // Defines the beginning of the month : the first of the month at 9AM
    // date is a date object
    var firstDay = new Date();
    if (date.getDate() === 1 && date.getHours() < 9) {
      firstDay.setMonth(date.getMonth() - 1);
    }
    firstDay.setDate(1);
    return firstDay;
  };

  const oneMonthAgo = (date) => {
    // !!! The zipped month file is available on the first of the month at 10AM 
    // Substract 1 month and 10 hours to the date
    // date is a date object
    const previousMonth = new Date();
    previousMonth.setMonth(date.getMonth() - 1);
    previousMonth.setHours(date.getHours() - 10);
    return previousMonth;
  };

  useEffect(() => {
    if (props.dataLean.length > 0) {
      setDownloadRawTimeValue([yesterday, yesterday]);
    }
  }, [props.dataLean]);

  const handleDownloadRawTimeChange = (isEndTime, newValue) => {
    if (isEndTime) {
      setDownloadRawTimeValue([downloadRawTimeValue[0], newValue]);
    } else {
      setDownloadRawTimeValue([newValue, downloadRawTimeValue[1]]);
    }
  };

  // ---------------------------- Downloading and zip -------------------------------

  const downloadAsJsonFile = (data, filename) => {
    // Transforms data into json object and triggers the downloading of a file named filename
    const contentType = "application/octet-stream";
    if (!data) {
      console.error(" No data");
      return;
    }
    if (!filename) filename = "filetodownload.txt";
    if (typeof data === "object") {
      data = JSON.stringify(data, undefined, 4);
    }
    var blob = new Blob([data], { type: contentType }),
      e = document.createEvent("MouseEvents"),
      a = document.createElement("a");

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = [contentType, a.download, a.href].join(":");
    e.initMouseEvent(
      "click",
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    a.dispatchEvent(e);
  };

  function urlToPromise(url) {
    // Open the URL file and zip its content
    return new Promise(function (resolve, reject) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  const fileNaming = (text) => {
    // Return a string that selects only the date of the input text 
    const regex = /[0-9]{6,}/g;
    return text.slice(text.search(regex));
  };

  const zipMultipleFiles = (fileList, fileName) => {
    //  fileList is an array that contains all filename strings and fileName is the name given to the final zip with all the files
    var zip = new JSZip();
    fileList.map((item, index) => {
      zip.file(fileNaming(item), urlToPromise(item), { binary: true });
    });
    zip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, fileName);
      setIsDownloadingData(false);
      setIsDownloadingMonthData(false);
    });
  };

  function download_onceMonth(download_month_year, detector_id) {
    // Download all the files of download_month_year for the detector whose id is detector_id
    // download_month_year is a string in the following format : YYYYMM
    // detector_id is the string of the detector id (eg. "obsmeudon")
    const month_year = moment([
      download_month_year.getFullYear(),
      download_month_year.getMonth(),
    ]);
    const suffixe =
      detector_id +
      "/" +
      "zipFiles" +
      "/" +
      month_year.format("YYYYMM").toString() +
      ".zip";

    var link = document.createElement("a");
    link.download =
      detector_id + "_" + month_year.format("YYYYMM").toString() + ".zip";
    link.href = "https://data-belisama.s3.eu-west-3.amazonaws.com/" + suffixe;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function download_RawFile(download_day, detector_id, table) {
    // Adds to the list table the name of all the files of the download_day for the detector detector_id
    // download_day is a string date in the following format : YYYYMMDD 
    // detector_id is the string of the detector id (eg. "obsmeudon")
    return new Promise(function (resolve, reject) {
      var day = moment([
        download_day.getFullYear(),
        download_day.getMonth(),
        download_day.getDate(),
      ]);
      var suffixe =
        detector_id +
        "/" +
        "zipFiles" +
        "/" +
        day.format("YYYYMMDD").toString() +
        ".zip";
      table.push("https://data-belisama.s3.eu-west-3.amazonaws.com/" + suffixe);
      resolve(table);
    });
  }

  async function downloadMultipleDayData(startDate, endDate, detector_id) {
    // Returns a list of filenames uploaded between startDate and endDate for the detector detector_id
    // startDate and endDate are two string dates in the following format : YYYYMMDD 
    // detector_id is the string of the detector id (eg. "obsmeudon")
    var table = [];
    var download_day = new Date(startDate);
    while (download_day <= endDate) {
      table = await download_RawFile(download_day, detector_id, table);
      var newDate = download_day.setDate(download_day.getDate() + 1);
      download_day = new Date(newDate);
    }
    return table;
  }

  const download_once = (startDate, endDate, detector_id) => {
    // Downloads the files for a period between startDate and endDate
    // startDate and endDate are two string dates in the following format : YYYYMMDD 
    // detector_id is the string of the detector id (eg. "obsmeudon")
    setIsDownloadingData(true);
    var start = moment([
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    ]);
    var end = moment([
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
    ]);
    downloadMultipleDayData(startDate, endDate, detector_id).then((table) => {
      zipMultipleFiles(
        table,
        props.detectorId.toString() +
          "_" +
          start.format("YYYYMMDD").toString() +
          "_" +
          end.format("YYYYMMDD").toString() +
          ".zip"
      );
    });
  };

  const maximumOfTwoDates = (date1, date2) => {
    return date1 > date2 ? date1 : date2;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="inherit">{city}</Typography>
          <Typography color="textPrimary">Téléchargement</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12}>
        <Hidden only="xs">
          <Grid container direction="row-reverse">
            <Grid>
              <Help page="Download" />
            </Grid>
          </Grid>
        </Hidden>
        <Hidden smUp>
          <Grid container justify="center">
            <Grid>
              <Help page="Download" />
            </Grid>
          </Grid>
        </Hidden>
        <Hidden only="xs">
          <Container maxWidth="md">
            <Grid
              container
              justify="center"
              alignItems="center"
              className="download-container"
            >
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <h4
                    className="title"
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                  >
                    Téléchargement
                  </h4>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper square>
                      <Grid item justify="center" className="download_data">
                        <Grid>
                          <h6
                            className="title"
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                          >
                            Données traitées
                          </h6>
                        </Grid>
                        <Grid>
                          <Box margin="2em" color="white"></Box>
                          <Button
                            variant="contained"
                            classname="download_button"
                            onClick={() =>
                              downloadAsJsonFile(
                                props.dataLean,
                                props.detectorId.toString() + "_dataLean.json"
                              )
                            }
                          >
                            Téléchargement des données traitées
                          </Button>
                          <Box margin="1em" color="white"></Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper square>
                      <Grid item justify="center" className="download_data">
                        <Grid>
                          <h6 className="title" style={{ margin: "20px" }}>
                            Données brutes par jour{" "}
                          </h6>
                        </Grid>

                        <Grid
                          container
                          direction="row"
                          justify="center"
                          className="periode-container"
                        >
                          <Grid item xs={12} sm={6}>
                            <p
                              style={{
                                marginRight: "20px",
                                marginLeft: "20px",
                                marginTop: "15px",
                                marginBottom: "15px",
                              }}
                            >
                              Début
                            </p>
                            <DatePicker
                              minDate={maximumOfTwoDates(
                                firstDayofMonth(today),
                                new Date(installation_date)
                              )}
                              maxDate={new Date(
                                downloadRawTimeValue[1]
                              ).getTime()}
                              dateFormat="dd/MM/yyyy"
                              selected={downloadRawTimeValue[0]}
                              onChange={(date) =>
                                handleDownloadRawTimeChange(false, date)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <p
                              style={{
                                marginLeft: "20px",
                                marginRight: "20px",
                                marginTop: "15px",
                                marginBottom: "15px",
                              }}
                            >
                              Fin
                            </p>
                            <DatePicker
                              minDate={new Date(
                                downloadRawTimeValue[0]
                              ).getTime()}
                              maxDate={yesterday}
                              dateFormat="dd/MM/yyyy"
                              selected={downloadRawTimeValue[1]}
                              onChange={(date) =>
                                handleDownloadRawTimeChange(true, date)
                              }
                            />
                          </Grid>
                        </Grid>

                        <Grid>
                          <Button
                            variant="contained"
                            classname="download_button"
                            onClick={() =>
                              download_once(
                                new Date(downloadRawTimeValue[0]),
                                new Date(downloadRawTimeValue[1]),
                                props.detectorId
                              )
                            }
                          >
                            Téléchargement des données brutes
                          </Button>
                          <Box margin="1em" color="white"></Box>
                        </Grid>

                        {isDownloadinData && (
                          <Grid item xs={12}>
                            <Box margin="2em" color="white"></Box>
                            <CircularProgress />
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper square>
                      <Grid item justify="center" className="download_data">
                        <Grid>
                          <h6 className="title" style={{ margin: "20px" }}>
                            Archives{" "}
                          </h6>
                        </Grid>
                        <Grid
                          container
                          direction="row"
                          justify="center"
                          className="periode-container"
                        >
                          <Grid item xs={12} sm={6}>
                            <p
                              style={{
                                marginRight: "20px",
                                marginLeft: "20px",
                                marginTop: "15px",
                                marginBottom: "15px",
                              }}
                            >
                              Mois
                            </p>
                            <DatePicker
                              minDate={new Date(installation_date).setDate(1)}
                              maxDate={oneMonthAgo(today)}
                              selected={downloadRawMonthValue}
                              onChange={(date) =>
                                setDownloadRawMonthValue(date)
                              }
                              dateFormat="MM/yyyy"
                              showMonthYearPicker
                              showFullMonthYearPicker
                            />
                          </Grid>
                        </Grid>
                        <Grid>
                          <Button
                            variant="contained"
                            classname="download_button"
                            onClick={() => {
                              try {
                                download_onceMonth(
                                  downloadRawMonthValue,
                                  props.detectorId
                                );
                              } catch (err) {
                                alert("Données non disponibles");
                                setIsDownloadingMonthData(false);
                              }
                            }}
                          >
                            Téléchargement des données brutes
                          </Button>
                          <Box margin="1em" color="white"></Box>
                        </Grid>
                        {isDownloadinMonthData && (
                          <Grid item xs={12}>
                            <Box margin="2em" color="white"></Box>
                            <CircularProgress />
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Hidden>
        <Hidden smUp>
          <Container maxWidth="md">
            <Grid
              container
              justify="center"
              alignItems="center"
              className="download-container"
            >
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <h4
                    className="title"
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                  >
                    Téléchargement
                  </h4>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid item justify="center" className="download_data">
                      <Grid>
                        <h6
                          className="title"
                          style={{ marginTop: "20px", marginBottom: "20px" }}
                        >
                          Données traitées
                        </h6>
                      </Grid>
                      <Grid>
                        <Box margin="2em" color="white"></Box>
                        <Button
                          variant="contained"
                          classname="download_button"
                          onClick={() =>
                            downloadAsJsonFile(
                              props.dataLean,
                              props.detectorId.toString() + "_dataLean.json"
                            )
                          }
                        >
                          Téléchargement des données traitées
                        </Button>
                        <Box margin="1em" color="white"></Box>
                      </Grid>
                    </Grid>
                    <Divider variant="middle" />
                  </Grid>

                  <Grid item xs={12}>
                    <Grid item justify="center" className="download_data">
                      <Grid>
                        <h6 className="title" style={{ margin: "20px" }}>
                          Données brutes par jour{" "}
                        </h6>
                      </Grid>

                      <Grid
                        container
                        direction="row"
                        justify="center"
                        className="periode-container"
                      >
                        <Grid item xs={12} sm={6}>
                          <p
                            style={{
                              marginRight: "20px",
                              marginLeft: "20px",
                              marginTop: "15px",
                              marginBottom: "15px",
                            }}
                          >
                            Début
                          </p>
                          <DatePicker
                            minDate={maximumOfTwoDates(
                              firstDayofMonth(today),
                              new Date(installation_date)
                            )}
                            maxDate={new Date(
                              downloadRawTimeValue[1]
                            ).getTime()}
                            dateFormat="dd/MM/yyyy"
                            selected={downloadRawTimeValue[0]}
                            onChange={(date) =>
                              handleDownloadRawTimeChange(false, date)
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <p
                            style={{
                              marginLeft: "20px",
                              marginRight: "20px",
                              marginTop: "15px",
                              marginBottom: "15px",
                            }}
                          >
                            Fin
                          </p>
                          <DatePicker
                            minDate={new Date(
                              downloadRawTimeValue[0]
                            ).getTime()}
                            maxDate={yesterday}
                            dateFormat="dd/MM/yyyy"
                            selected={downloadRawTimeValue[1]}
                            onChange={(date) =>
                              handleDownloadRawTimeChange(true, date)
                            }
                          />
                        </Grid>
                      </Grid>

                      <Grid>
                        <Button
                          variant="contained"
                          classname="download_button"
                          onClick={() =>
                            download_once(
                              new Date(downloadRawTimeValue[0]),
                              new Date(downloadRawTimeValue[1]),
                              props.detectorId
                            )
                          }
                        >
                          Téléchargement des données brutes
                        </Button>
                        <Box margin="1em" color="white"></Box>
                      </Grid>

                      {isDownloadinData && (
                        <Grid item xs={12}>
                          <Box margin="2em" color="white"></Box>
                          <CircularProgress />
                        </Grid>
                      )}
                    </Grid>
                    <Divider variant="middle" />
                  </Grid>

                  <Grid item xs={12}>
                    <Grid item justify="center" className="download_data">
                      <Grid>
                        <h6 className="title" style={{ margin: "20px" }}>
                          Archives{" "}
                        </h6>
                      </Grid>
                      <Grid
                        container
                        direction="row"
                        justify="center"
                        className="periode-container"
                      >
                        <Grid item xs={12} sm={6}>
                          <p
                            style={{
                              marginRight: "20px",
                              marginLeft: "20px",
                              marginTop: "15px",
                              marginBottom: "15px",
                            }}
                          >
                            Mois
                          </p>
                          <DatePicker
                            minDate={new Date(installation_date).setDate(1)}
                            maxDate={today}
                            selected={downloadRawMonthValue}
                            onChange={(date) => setDownloadRawMonthValue(date)}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            showFullMonthYearPicker
                          />
                        </Grid>
                      </Grid>
                      <Grid>
                        <Button
                          variant="contained"
                          classname="download_button"
                          onClick={() => {
                            try {
                              download_onceMonth(
                                downloadRawMonthValue,
                                props.detectorId
                              );
                            } catch (err) {
                              alert("Données non disponibles");
                              setIsDownloadingMonthData(false);
                            }
                          }}
                        >
                          Téléchargement des données brutes
                        </Button>
                        <Box margin="1em" color="white"></Box>
                      </Grid>
                      {isDownloadinMonthData && (
                        <Grid item xs={12}>
                          <Box margin="2em" color="white"></Box>
                          <CircularProgress />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Hidden>
      </Grid>
    </Grid>
  );
};

export default Download;
