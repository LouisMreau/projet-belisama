import { React, useState, useEffect } from "react";
import "./style.css";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import "moment/locale/fr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Grid,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Breadcrumbs,
  Hidden,
} from "@material-ui/core";

import Help from "../Help/help";

/**
 * @author
 * @function Energy
 * Permet d'afficher le graphique du spectre en énergie pour un détecteur (chargement des données réalisé au préalable et donné en props)
 **/

const Energy = (props) => {
  const detectorId = props.detectorId;
  const dataLean = props.dataLean;
  const dataDetector = props.dataDetector;
  // Definition de la date d'installation pour la sélection de dates avec des données disponibles
  var installation_date = dataDetector.filter(function (detector) {
    return detector.id == detectorId;
  })[0].installation_date;
  installation_date = installation_date + "T00:00:00";

  // Définit la ville pour l'entete breadcrumbs
  var city = dataDetector.filter(function (detector) {
    return detector.id == detectorId;
  })[0].city;

  // Décalage horaire de 2 heures à prendre en compte pour la date de fin 
  // le timestamp de la fin du dataLean s'appuie sur le nom du fichier qui est une date locale mais est comprise en tant que data UTC lors de la transformation
  const [spectrumTimeValue, setSpectrumTimeValue] = useState([
    new Date(installation_date),
    new Date(dataLean[0][1] - 2 * 3600 * 1000),
  ]);
  const [spectrumData, setSpectrumData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [switchState, setSwitchState] = useState(false);

  const handleChangeSwitch = (event) => {
    setLoadingData(true);
    console.log(switchState);
    setSwitchState(event.target.checked);
  };

  useEffect(() => {
    if (switchState) {
      switchToLogarithmData(spectrumData).then((data) => {
        setSpectrumData(data);
      });
    } else {
      setSpectrum(dataLean);
    }
    setLoadingData(false);
  }, [switchState]);

  useEffect(() => {
    if (dataLean.length > 0) {
      setSpectrum(dataLean);
      setSwitchState(false);
    }
  }, [spectrumTimeValue]);

  useEffect(() => {
    if (dataLean.length > 0) {
      // Décalage horaire de 2 heures à prendre en compte pour la date de fin
      // le timestamp de la fin du dataLean s'appuie sur le nom du fichier qui est une date locale mais est comprise en tant que data UTC lors de la transformation
      setSpectrumTimeValue([
        new Date(installation_date),
        new Date(dataLean[0][1] - 2 * 3600 * 1000),
      ]);
      setSwitchState(false);
    }
  }, [dataLean]);

  // On définit les heures limites du jeu de données traitées, attention, le fuseau horaire n'est pas le même
  const start_date_limit = moment(new Date(dataLean[0][0]));
  const end_date_limit = moment(new Date(dataLean[0][1] - 2 * 3600 * 1000));

  const handleSpectrumTimeChange = (isEndTime, newValue) => {
    if (isEndTime) {
      setSpectrumTimeValue([spectrumTimeValue[0], newValue]);
    } else {
      setSpectrumTimeValue([newValue, spectrumTimeValue[1]]);
    }
  };

  const createChartData = (xx, yy) => {
    let chartData = [];
    for (var i = 0; i < yy.length; i++) {
      chartData.push({ x: xx[i], y: yy[i] });
    }
    return chartData;
  };

  const loadSpectrum = (dataLean, inf_time, sup_time, energy_interval) => {
    // Traite les données pour déterminer la densité pour un intervalle d'énergie donné 

    // Initialisation
    let energies = [];
    let densities = new Array(dataLean[1][0].length);
    for (let i = 0; i < dataLean[1][0].length; ++i) densities[i] = 0;
    let total_density = 0;

    // Définition de l'axe x avec les différentes énergies
    for (var j = 0; j < dataLean[1][0].length; j++) {
      energies[j] = dataLean[0][2] + j * energy_interval;
    }

    // Pour une même énergie on somme sur les intervalles de temps
    for (var i = inf_time; i < sup_time; i++) {
      for (var j = 0; j < dataLean[1][0].length; j++) {
        densities[j] = densities[j] + dataLean[1][i][j];
        total_density += dataLean[1][i][j];
      }
    }
    // On divise par le nombre total de photons arrivés
    for (var j = 0; j < densities.length; j++) {
      densities[j] /= total_density;
    }

    return [energies, densities];
  };

  const setSpectrum = (dataLean) => {
    // Traite les données en lui appliquant la fonction de traitement et en les mettant sous le bon format
    let start_time =
      (spectrumTimeValue[0].getTime() - dataLean[0][0]) / 1000 / 3600;
    let end_time =
      (spectrumTimeValue[1].getTime() - dataLean[0][0]) / 1000 / 3600;
    let data = loadSpectrum(dataLean, start_time, end_time, dataLean[0][3]);
    data = createChartData(data[0], data[1]);
    setSpectrumData(data);
  };

  async function switchToLogarithmData(data) {
    let logData = data;
    for (let key in logData) {
      let y = logData[key].y;
      y = Math.log(y);
      logData[key].y = y;
    }
    return Promise.resolve(logData);
  }

  var series = [
    {
      name: "densité",
      type: "area",
      data: spectrumData,
    },
  ];

  const options = {
    // Définit les options du graphique
    chart: {
      type: "area",
      stacked: false,
      width: "100%",
      animations: {
        enabled: false,
      },
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        export: {
          csv: {
            filename: "spectre_energie_" + detectorId,
            columnDelimiter: ";",
            headerCategory: "Energie",
            headerValue: "Densité",
          },
          svg: {
            filename: "spectre_energie_" + detectorId,
          },
          png: {
            filename: "spectre_energie_" + detectorId,
          },
        },
        autoSelected: "zoom",
      },
    },
    colors: ["#09476e"],
    stroke: {
      show: true,
      curve: "smooth",
      width: 1.5,
      dashArray: 0,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    title: {
      text: "Spectre en énergie",
      align: "left",
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(3);
        },
      },
      tickAmount: 3,
      lines: {
        show: true,
      },
      title: {
        text: "Densité de photons",
      },
    },
    xaxis: {
      type: "numeric",
      min: 50,
      max: 10000,
      lines: {
        show: true,
      },
      title: {
        text: "Energie (keV)",
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(3);
        },
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          title: {
            text: "Energie",
            align: "left",
          },
          yaxis: {
            title: { text: "Densité" },
            tickAmount: 3,
            labels: {
              formatter: function (val) {
                return val.toFixed(2);
              },
            },
          },
          xaxis: {
            min: 50,
            max: 3000,
          },
          toolbar: {
            show: true,
            autoSelected: "zoom",
          },
          tooltip: {
            style: {
              fontSize: "8px",
            },
            x: {
              show: false,
            },
          },
        },
      },
    ],
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="inherit">{city}</Typography>
          <Typography color="textPrimary">Energie</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12}>
        <Hidden only="xs">
          <Grid container direction="row-reverse">
            <Grid>
              <Help page="Energy" />
            </Grid>
          </Grid>
        </Hidden>
        <Hidden smUp>
          <Grid container justify="center">
            <Grid>
              <Help page="Energy" />
            </Grid>
            {/* <Grid> */}
            {/* <Box margin = '1em'></Box> */}
            {/* </Grid> */}
            {/* <Grid> */}
            {/* <Button variant="outlined" color={color} startIcon={<CloudIcon />} onClick={() => {handleWeather()}}>Météo</Button> */}
            {/* </Grid> */}
          </Grid>
        </Hidden>
        <Grid container className="spectrum-container">
          <Grid item xs={12}>
            <h4
              classname="title"
              style={{ marginTop: "-30px", marginBottom: "20px" }}
            >
              Spectre en énergie
            </h4>
          </Grid>
          <Grid
            container
            justify="center"
            spacing={3}
            className="periode-container"
          >
            <Grid item xs={10}>
              <Grid container>
                <Grid item xs={12}>
                  <h6 style={{ marginBottom: "10px", marginTop: "50px" }}>
                    Période
                  </h6>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p
                    style={{
                      marginRight: "20px",
                      marginLeft: "20px",
                      marginTop: "20px",
                    }}
                  >
                    Début
                  </p>
                  <DatePicker
                    minDate={new Date(installation_date)}
                    maxDate={spectrumTimeValue[1]}
                    timeInputLabel="Heure :"
                    timeFormat="HH:mm"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeInput
                    selected={spectrumTimeValue[0]}
                    onChange={(date) => {
                      if (
                        date.getTime() > dataLean[0][1] - 2 * 3600 * 1000 ||
                        date.getTime() < dataLean[0][0]
                      ) {
                        alert(
                          "Erreur : Merci de bien sélectionner une date entre " +
                            start_date_limit.format("DD/MM/YYYY HH:mm:ss") +
                            " et " +
                            end_date_limit.format("DD/MM/YYYY HH:mm:ss")
                        );
                      } else handleSpectrumTimeChange(false, date);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p
                    style={{
                      marginLeft: "20px",
                      marginRight: "20px",
                      marginTop: "20px",
                    }}
                  >
                    Fin
                  </p>
                  <DatePicker
                    minDate={spectrumTimeValue[0]}
                    maxDate={new Date(dataLean[0][1] - 2 * 3600 * 1000)}
                    timeInputLabel="Heure :"
                    timeFormat="HH:mm"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeInput
                    selected={spectrumTimeValue[1]}
                    onChange={(date) => {
                      if (
                        date.getTime() > dataLean[0][1] - 2 * 3600 * 1000 ||
                        date.getTime() < dataLean[0][0]
                      ) {
                        alert(
                          "Erreur : Merci de bien sélectionner une date entre " +
                            start_date_limit.format("DD/MM/YYYY HH:mm:ss") +
                            " et " +
                            end_date_limit.format("DD/MM/YYYY HH:mm:ss")
                        );
                      } else handleSpectrumTimeChange(true, date);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} sm={9}>
              <Box margin="1.5em" color="white"></Box>
              {loadingData && (
                <Typography variant="h4">Chargement des données</Typography>
              )}
              {!loadingData && (
                <ReactApexChart options={options} series={series} />
              )}
            </Grid>
            <Grid item xs={12} sm={9}>
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
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Energy;
