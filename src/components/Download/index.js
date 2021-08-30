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
import urlExist from "url-exist";

import dataDetector from "../../resources/data/data_detector.json";
import Help from "../Help/help";

/**
 * @author
 * @function Download
 * Permet le téléchargement des données brutes, traitées selon certaines périodes (téléchargement par jour ou par mois selon ancienneté)
 * Le téléchargement se fait par l'utilisation d'un URL dont l'intitulé diffère selon la date d'envoi des données
 **/

const Download = (props) => {
   // Definition de la date d'installation pour la sélection de dates avec des données disponibles
  var installation_date = dataDetector.filter(function (detector) {
    return detector.id == props.detectorId;
  })[0].installation_date;
  installation_date = installation_date + "T00:00:00";

  // Définit la ville pour l'entete breadcrumbs
  var city = dataDetector.filter(function (detector) {
    return detector.id == props.detectorId;
  })[0].city;

  const [downloadRawTimeValue, setDownloadRawTimeValue] = useState([]);
  const [downloadRawMonthValue, setDownloadRawMonthValue] = useState();
  const [isDownloadinData, setIsDownloadingData] = useState(false);
  const [isDownloadinMonthData, setIsDownloadingMonthData] = useState(false);

  // --------------- Définition des variables pour limiter les dates du calendrier de téléchargement ---------------

  const today = new Date();
  var yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  // Il faut retirer 5 heures car les données zippées de la veille sont disponibles tous les jours à partir de 5h 
  yesterday.setHours(today.getHours() - 5);

  const firstDayofMonth = (date) => {
    // Définit le début du calendrier pour le téléchargement journalier (switch de mois à partir du 1er à 9h) 
    var firstDay = new Date();
    if (date.getDate() === 1 && date.getHours() < 9) {
      firstDay.setMonth(date.getMonth() - 1);
    }
    firstDay.setDate(1);
    return firstDay;
  };

  const oneMonthAgo = (date) => {
    // Permet le téléchargement des données d'un mois particulier seulement à partir du 1er du mois après 10h 
    // Les données zippées ne sont pas encore disponibles sinon !
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

  // ---------------------------- Téléchargement et zippage -------------------------------

  const downloadAsJsonFile = (data, filename) => {
    // Transforme les données en fichier json et déclenche le téléchargement
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
    // Ouvre un url accédant à un fichier et zip le body du fichier
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
    // Nomme les fichiers en ne sélectionnant que la date du fichier
    const regex = /[0-9]{6,}/g;
    return text.slice(text.search(regex));
  };

  const zipMultipleFiles = (fileList, fileName) => {
    //  Telechargement et zip d'une liste de fichiers 
    // Prend en argument une liste de noms de fichiers et un nom de fichier zip
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
    // Télécharge les données d'un mois en invoquant l'url publique d'AWS
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
    // Ajoute à une liste de noms de fichier le nom du fichier du jour à télécharger
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
    // Renvoie une liste de noms de fichier en fonction du jour à télécharger
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
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Hidden>
      <Hidden>
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
                          maxDate={new Date(downloadRawTimeValue[1]).getTime()}
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
                          minDate={new Date(downloadRawTimeValue[0]).getTime()}
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
                          maxDate={oneMonthAgo(today)}
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
  );
};

export default Download;
