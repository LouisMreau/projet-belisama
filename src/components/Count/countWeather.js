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

/**
 * @author
 * @function CountWeather
 * Display the counting graph given a detector, its processed data (dataLean) and information concerning all the detectors
 * detectorId is a string that indicates the id of the detector (eg. obsmeudon)
 * dataDetector is a json object that gives information about each detector (name, id, place,...)
 * dataLean is an array that enumerates the number of arriving photons for each energy interval and each hour. It has the following format :
 * [[start_timestamp, end_timestamp, start_energy, number_of_energy_interval][[first_hour],[second_hour],[],...,[last_hour]]].
 * HKData is an array that contains two-minute interval array of temperature, humidity and pressure.
 * type is the type of parameters among temperature, humidity and pressure
 * Please refer to count.js for more information
 **/

const CountWeather = (props) => {
  const detectorId = props.detectorId;
  const dataDetector = props.dataDetector;
  const dataLean = props.dataLean;
  const HKData = props.HKData;
  const type = props.type;
  const [tempData, setTempData] = useState([]);
  const [pressureData, setPressureData] = useState([]);
  const [humData, setHumData] = useState([]);
  const [countData, setCountData] = useState([]);
  const [showGraph, setShowGraph] = useState(true);

  // Defining the installation date to ensure the visualization of the available data
  // installation_date is a date object
  var installation_date = dataDetector.filter(function (detector) {
    return detector.id == detectorId;
  })[0].installation_date;
  installation_date = installation_date + "T00:00:00";

  // Defining the hk date to ensure the visualization of the available data
  var hk_date = new Date(Math.trunc(HKData[0][0] / 3600) * 3600 * 1000);
  hk_date.setHours(0, 0);
  hk_date.setDate(hk_date.getDate() + 1);

  const maximumOfTwoDates = (date1, date2) => {
    // Determine the fisrt date between two dates
    return date1 > date2 ? date1 : date2;
  };
  const minimumOfTwoDates = (date1, date2) => {
    // Determine the latest date between two dates
    return date1 < date2 ? date1 : date2;
  };
  var end_date = minimumOfTwoDates(
    new Date(dataLean[0][1] - 2 * 1000 * 3600),
    new Date(Math.trunc(HKData[HKData.length - 1][0] / 3600) * 3600 * 1000)
  );
  end_date.setHours(0, 0);
  var last_date = maximumOfTwoDates(new Date(installation_date), hk_date);
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

  const [countTimeValue, setCountTimeValue] = useState([
    new Date(last_date),
    new Date(end_date),
  ]);

  useEffect(() => {
    if (dataLean.length > 0) setCountSerie(dataLean);
  }, [countTimeValue, countSliderValue]);

  useEffect(() => {
    if (HKData.length > 0) loadHKDates(HKData);
  }, [countTimeValue]);

  useEffect(() => {
    if (dataLean.length > 0 && HKData.length > 0) {
      setCountSliderValue([dataLean[0][2], dataLean[0][2] + 7000]);
      setCountTimeValue([new Date(last_date), new Date(end_date)]);
    }
  }, [dataLean, HKData]);

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

  const selectSeries = (type) => {
    // Defines the series for each type
    // type is a string among "temperature", "humidity" and "pressure"
    let series = [];
    if (type == "Température") {
      series = [
        { name: "Photons par heure", data: countData },
        { name: "Température (en °C)", data: tempData },
      ];
    } else if (type == "Humidité") {
      series = [
        { name: "Photons par heure", data: countData },
        { name: "Humidité (en %)", data: humData },
      ];
    } else if (type == "Pression") {
      series = [
        { name: "Photons par heure", data: countData },
        { name: "Pression (en mbar)", data: pressureData },
      ];
    }

    return series;
  };

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

  const loadTempSerie = (
    // Extract the timetags and the temperature and set the temperature data
    HKData
  ) => {
    let temp = [];
    let times = [];
    for (var i = 0; i < HKData.length; i++) {
      temp.push(HKData[i][1]);
      times.push(new Date(1000 * HKData[i][0]));
    }
    let data = createChartData(times, temp);
    setTempData(data);
  };

  const loadPressureSerie = (
    // Extract the timetags and the pressure and set the pressure data
    HKData
  ) => {
    let pressure = [];
    let times = [];
    for (var i = 0; i < HKData.length; i++) {
      pressure.push(HKData[i][3]);
      times.push(new Date(1000 * HKData[i][0]));
    }
    let data = createChartData(times, pressure);
    setPressureData(data);
  };

  const loadHumSerie = (
    // Extract the timetags and the humidity and set the humidity data
    HKData
  ) => {
    let humidity = [];
    let times = [];
    for (var i = 0; i < HKData.length; i++) {
      humidity.push(HKData[i][2]);
      times.push(new Date(1000 * HKData[i][0]));
    }
    let data = createChartData(times, humidity);
    setHumData(data);
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

  const loadHKDates = (HKData) => {
    // Processes the data and changes it into a json object
    let start_time =
      (countTimeValue[0] - HKData[0][0] * 1000) / 1000 / (60 * 2);
    let end_time = Math.trunc(
      (countTimeValue[1] - Math.trunc(HKData[0][0] / 3600) * 3600 * 1000) /
        1000 /
        (60 * 2)
    );
    console.log(start_time);
    console.log(end_time);
    let data = HKData;
    data = data.slice(start_time, end_time);
    loadTempSerie(data);
    loadPressureSerie(data);
    loadHumSerie(data);
  };

  var series = selectSeries(type);

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
            filename: "comptage_" + type + "_" + detectorId,
            columnDelimiter: ";",
            headerCategory: "Date",
            headerValue: "Nombre de photons par heure",
            dateFormatter: function (x) {
              return moment(x).format("YYYY-MM-DD HH:m");
            },
          },
          svg: {
            filename: "comptage_" + type + "_" + detectorId,
          },
          png: {
            filename: "comptage_" + type + "_" + detectorId,
          },
        },
      },
    },
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
      text: "Analyse avec le taux de comptage",
      align: "left",
    },
    yaxis: [
      {
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
      {
        opposite: true,
        title: {
          text: type,
        },
        min: function(min) {if (type == "Pression") {return 930} else {return min}},
        forceNiceScale : true,
      },
    ],
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
          return val.toFixed(2);
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
            text: "Comparaison",
            align: "left",
          },
          yaxis: [
            {
              labels: {
                formatter: function (val) {
                  return val.toFixed(0);
                },
              },
              tickAmount: 2,
              lines: {
                show: true,
              },
              title: {
                text: "Coups/heure",
              },
            },
            {
              opposite: true,
              tickAmount: 2,
              title: {
                text: type,
              },
              forceNiceScale : true,
            },
          ],
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
          },
        },
      },
    ],
  };

  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={12}>
        {showGraph && (
          <Grid container className="count-container">
            <Grid item xs={12}>
              <h4
                classname="title"
                style={{ marginTop: "-30px", marginBottom: "20px" }}
              >
                Analyse avec le taux de comptage temporel
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
                      minDate={last_date}
                      maxDate={
                        new Date(
                          Math.trunc(HKData[HKData.length - 1][0] / 3600) *
                            3600 *
                            1000
                        )
                      }
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
                      maxDate={
                        new Date(
                          Math.trunc(HKData[HKData.length - 1][0] / 3600) *
                            3600 *
                            1000
                        )
                      }
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
        )}
      </Grid>
    </Grid>
  );
};

export default CountWeather;
