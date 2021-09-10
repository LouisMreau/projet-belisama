import { React, useState, useEffect } from "react";
import "./style.css";
import Chart from "react-apexcharts";
import moment from "moment";
import Slider from "@material-ui/core/Slider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Grid,
  Button,
  Box,
  Typography,
  Breadcrumbs,
  Hidden,
} from "@material-ui/core";
import CloudIcon from "@material-ui/icons/Cloud";

import Help from "../Help/help";
import OpenWeatherWidget from "../Weather/openWeatherWidget";

/**
 * @author
 * @function Count
 * Display the counting graph given a detector, its processed data (dataLean) and information concerning all the detectors
 * detectorId is a string that indicates the id of the detector (eg. obsmeudon)
 * dataDetector is a json object that gives information about each detector (name, id, place,...)
 * dataLean is an array that enumerates the number of arriving photons for each energy interval and each hour. It has the following format :
 * [[start_timestamp, end_timestamp, start_energy, number_of_energy_interval][[first_hour],[second_hour],[],...,[last_hour]]].
 **/

const Count = (props) => {
  const detectorId = props.detectorId;
  const dataDetector = props.dataDetector;
  var dataLean = props.dataLean;
  // Defining the installation data to ensure the visualization of the available data
  // installation_date is a date object
  var installation_date = dataDetector.filter(function (detector) {
    return detector.id == detectorId;
  })[0].installation_date;
  installation_date = installation_date + "T00:00:00";

  // Defining the city for the weather widget
  var city = dataDetector.filter(function (detector) {
    return detector.id == detectorId;
  })[0].city;

  // Weather widget
  var weatherURL = dataDetector.filter(function (detector) {
    return detector.id == detectorId;
  })[0].weatherURL;

  // Slider that selects the energy interval
  const [countSliderValue, setCountSliderValue] = useState([
    dataLean[0][2],
    dataLean[0][2] + 7000,
  ]);
  // !!! Must take into account the two hour lag !!!
  // The second timestamp in the datalean has been understood as a UTC date and not a locale date, thus it has added two hours (GMT +02) in the transformation
  const [countTimeValue, setCountTimeValue] = useState([
    new Date(installation_date),
    new Date(dataLean[0][1] - 2 * 3600 * 1000),
  ]);
  const [countData, setCountData] = useState([]);
  const [showWeather, setShowWeather] = useState(false);
  const [weatherColor, setWeatherColor] = useState("primary");

  useEffect(() => {
    if (dataLean.length > 0) setCountSerie(dataLean);
  }, [countTimeValue, countSliderValue]);

  useEffect(() => {
    if (dataLean.length > 0) {
      setCountSliderValue([dataLean[0][2], dataLean[0][2] + 7000]);
      // The two hour lag must be taken into account
      setCountTimeValue([
        new Date(installation_date),
        new Date(dataLean[0][1] - 2 * 3600 * 1000),
      ]);
    }
  }, [props.dataLean]);

  const handleCountSliderChange = (event, newValue) => {
    setCountSliderValue(newValue);
  };

  const handleCountTimeChange = (isEndTime, newValue) => {
    if (isEndTime) {
      setCountTimeValue([countTimeValue[0], newValue]);
    } else {
      setCountTimeValue([newValue, countTimeValue[1]]);
    }
  };

  function handleWeather() {
    // Display the weather widget and transform the color of the button
    var x = document.getElementById("weather");
    if (!showWeather) {
      x.style.display = "block";
      setWeatherColor("active");
      setShowWeather(true);
    } else {
      x.style.display = "none";
      setShowWeather(false);
      setWeatherColor("primary");
    }
  }

  const createChartData = (xx, yy) => {
    // Transforms two arrays into a json format object for data visualization
    // xx : the array containing all the x values
    // yy : the array containing all the y values
    let chartData = [];
    for (var i = 0; i < yy.length; i++) {
      chartData.push({ x: xx[i], y: yy[i] });
    }
    return chartData;
  };

  const loadCountSerie = (
    // Sums the number of arriving photons for a specific time range
    // inf_energy, sup_energy are the two energy limits given in the dataLean variable
    // inf_time, sup_time are the two time limits given in the dataLean variable
    dataLean,
    inf_energy,
    sup_energy,
    inf_time,
    sup_time
  ) => {
    let counts = [];
    let times = [];
    for (var i = inf_time; i < sup_time; i++) {
      counts.push(
        dataLean[1][i].slice(inf_energy, sup_energy).reduce((a, b) => a + b, 0)
      );
      times.push(new Date(i * 3600 * 1000 + dataLean[0][0]));
    }
    return [times, counts];
  };

  const setCountSerie = (dataLean) => {
    // Processes the data and changes it into a json object
    let start_energy = Math.trunc(
      (countSliderValue[0] - dataLean[0][2]) / dataLean[0][3]
    );
    let end_energy = Math.trunc(
      (countSliderValue[1] - dataLean[0][2]) / dataLean[0][3]
    );
    let start_time = (countTimeValue[0] - dataLean[0][0]) / 1000 / 3600;
    let end_time = Math.trunc(
      (countTimeValue[1] - dataLean[0][0]) / 1000 / 3600
    );
    let data = loadCountSerie(
      dataLean,
      start_energy,
      end_energy,
      start_time,
      end_time
    );
    data = createChartData(data[0], data[1]);
    setCountData(data);
  };

  var series = [
    {
      name: "Nombre de photons par heure",
      data: countData,
    },
  ];

  const options = {
    // Defining the graph options
    // autoselected tool (zoom), toolbar, exported files, value formatter, responsive
    chart: {
      type: "line",
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
        show: true,
        autoSelected: "zoom",
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
        },
        export: {
          csv: {
            filename: "comptage_" + detectorId,
            columnDelimiter: ";",
            headerCategory: "Date",
            headerValue: "Nombre de photons par heure",
            dateFormatter: function (x) {
              return moment(x).format("YYYY-MM-DD HH:m");
            },
          },
          svg: {
            filename: "comptage_" + detectorId,
          },
          png: {
            filename: "comptage_" + detectorId,
          },
        },
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
      text: "Taux de comptage",
      align: "left",
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      tickAmount: 3,
      lines: {
        show: true,
      },
      title: {
        text: "Nombre de photons par heure",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "dd/MM/yyyy, HH:mm",
        datetimeUTC: false,
      },
      lines: {
        show: true,
      },
      title: {
        text: "Date",
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      x: {
        format: "dd/MM/yyyy, HH:mm",
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          title: {
            text: "Comptage",
            align: "left",
          },
          yaxis: {
            show: true,
            tickAmount: 3,
          },
          toolbar: {
            show: false,
          },
          tooltip: {
            style: {
              fontSize: "8px",
            },
            x: {
              show: false,
            },
            y: {
              title: {
                formatter: (seriesName) => "Photons par heure",
              },
            },
          },
        },
      },
    ],
  };

  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={12}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="inherit">{city}</Typography>
          <Typography color="textPrimary">Comptage</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12}>
        <Grid id="weather" style={{ display: "none" }}>
          <OpenWeatherWidget city={city} weatherURL={weatherURL} />
        </Grid>

        <Hidden only={['xs', 'sm']}>
          <Grid container direction="row-reverse">
            <Grid item xs={12} sm={2}>
              <Help page="Count" />
            </Grid>
            <Grid>
              <Box margin="1em"></Box>
            </Grid>
            <Grid xs={12} sm={1}>
              <Button
                variant="outlined"
                color={weatherColor}
                startIcon={<CloudIcon />}
                onClick={() => {
                  handleWeather();
                }}
              >
                Météo
              </Button>
            </Grid>
          </Grid>
        </Hidden>

        <Hidden mdUp>
          <Grid container justify="center">
            <Grid>
              <Help page="Count" />
              <Box margin="1em"></Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color={weatherColor}
                startIcon={<CloudIcon />}
                onClick={() => {
                  handleWeather();
                }}
              >
                Météo
              </Button>
            </Grid>
          </Grid>
        </Hidden>

        <Grid container className="count-container">
          <Grid item xs={12}>
            <h4
              classname="title"
              style={{ marginTop: "-30px", marginBottom: "20px" }}
            >
              Taux de comptage temporel
            </h4>
          </Grid>
          <Grid
            container
            justify="center"
            spacing={3}
            className="periode-container"
          >
            <Grid item xs={12}>
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
                    maxDate={new Date(dataLean[0][1] - 2 * 3600 * 1000)}
                    dateFormat="dd/MM/yyyy"
                    selected={countTimeValue[0]}
                    onChange={(date) => handleCountTimeChange(false, date)}
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
                    minDate={countTimeValue[0]}
                    maxDate={new Date(dataLean[0][1] - 2 * 1000 * 3600)}
                    dateFormat="dd/MM/yyyy"
                    selected={countTimeValue[1]}
                    onChange={(date) => handleCountTimeChange(true, date)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container justify="center" alignItems="center">
            <Grid item xs={12}>
              <h6 style={{ marginBottom: "20px", marginTop: "50px" }}>
                Gamme d'énergie
              </h6>
            </Grid>
            <Grid item xs={9}>
              <Slider
                min={dataLean[0][2]}
                max={dataLean[0][2] + dataLean[0][3] * dataLean[0][4]}
                step={dataLean[0][3]}
                value={countSliderValue}
                onChange={handleCountSliderChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                marks={[
                  {
                    value: dataLean[0][2],
                    label: dataLean[0][2].toString() + " keV",
                  },
                  {
                    value: dataLean[0][2] + dataLean[0][3] * dataLean[0][4],
                    label:
                      (
                        dataLean[0][2] +
                        dataLean[0][3] * dataLean[0][4]
                      ).toString() + " keV",
                  },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={9}>
              <Box margin="2em" color="white"></Box>
              <Chart options={options} series={series} />
            </Grid>
            <Grid xs={12} sm={9}>
              <Box margin="2em" color="white"></Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Count;
