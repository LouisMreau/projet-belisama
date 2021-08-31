import { React, useState, useEffect, useRef, Component } from "react";
import "./style.css";
import { Link, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import moment from "moment";
import Slider from "@material-ui/core/Slider";
import { getDefaultNormalizer } from "@testing-library/dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Grid,
  Container,
  Button,
  Paper,
  Box,
  Typography,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import csvjson from "csvjson";

import CountViewer from "../Chart/CountViewer";

/**
 * @author
 * @function Count2
 * Displays the counting graph for two detectors
 * Builds the data and calls CountViewer to draw the graph
 * Props : Two detector id, their data and information concerning all detectors (name, place, ...)
 * Please refer to count.js for more information
**/

const Count2 = (props) => {
  var detectorId1 = props.detectorId1;
  var detectorId2 = props.detectorId2;

  var dataLean1 = props.dataLean1;
  var dataLean2 = props.dataLean2;

  const dataDetector = props.dataDetector;

  const maximumOfTwoDates = (date1, date2) => {
    // Determine the latest date between two dates
    return date1 > date2 ? date1 : date2;
  };

  const getFirst = (detectorId1, detectorId2) => {
    var installation_date1 = dataDetector.filter(function (detector1) {
      return detector1.id == detectorId1;
    })[0].installation_date;
    var installation_date2 = dataDetector.filter(function (detector2) {
      return detector2.id == detectorId2;
    })[0].installation_date;
    installation_date1 = installation_date1 + "T00:00:00";
    installation_date2 = installation_date2 + "T00:00:00";
    return maximumOfTwoDates(installation_date1, installation_date2);
  };
  // Defining the installation data to ensure the visualization of the available data
  // installation_date is a date object
  var installation_date = getFirst(detectorId1, detectorId2);

  // Same minimum and maximum of energy for all detectors
  const [countSliderValue, setCountSliderValue] = useState([
    dataLean1[0][2],
    dataLean1[0][2] + 7000,
  ]);
  // !!! Must take into account the two hour lag !!!
  // The second timestamp in the datalean has been understood as a UTC date and not a locale date, thus it has added two hours (GMT +02) in the transformation
  const [countTimeValue, setCountTimeValue] = useState([
    new Date(installation_date),
    new Date(dataLean1[0][1] - 2 * 3600 * 1000),
  ]);
  // Defining the three series (first detector, second, difference)
  const [countData1, setCountData1] = useState([]);
  const [countData2, setCountData2] = useState([]);
  const [dataDiff, setCountDifference] = useState([]);
  // Names for the graph (array of series name, graph title)
  const nameDiff = [
    ["Différence détecteur1 - détecteur2"],
    "Différence détecteur1 - détecteur2",
  ];
  // Names for the graph (array of series name, graph title)
  const name = [[detectorId1, detectorId2], "Taux de comptage"];

  useEffect(() => {
    if (dataLean1.length > 0 && dataLean2.length > 0)
      setCountSerie(dataLean1, dataLean2);
  }, [countTimeValue, countSliderValue]);

  useEffect(() => {
    if (dataLean1.length > 0 && dataLean2.length > 0) {
      setCountSliderValue([dataLean1[0][2], dataLean1[0][2] + 7000]);
      setCountTimeValue([
        new Date(installation_date),
        new Date(dataLean1[0][1] - 2 * 3600 * 1000),
      ]);
    }
  }, [props.dataLean1, props.dataLean2]);

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

  const createChartData = (xx, yy) => {
    let chartData = [];
    for (var i = 0; i < yy.length; i++) {
      chartData.push({ x: xx[i], y: yy[i] });
    }
    return chartData;
  };

  const loadCountSerie = (
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

  const setCountSerie = (dataLean1) => {
    let start_energy = Math.trunc(
      (countSliderValue[0] - dataLean1[0][2]) / dataLean1[0][3]
    );
    let end_energy = Math.trunc(
      (countSliderValue[1] - dataLean1[0][2]) / dataLean1[0][3]
    );
    let start_time1 = Math.trunc(
      (countTimeValue[0].getTime() - dataLean1[0][0]) / 1000 / 3600
    );
    let end_time1 = Math.trunc(
      (countTimeValue[1].getTime() - dataLean1[0][0]) / 1000 / 3600
    );
    let data1 = loadCountSerie(
      dataLean1,
      start_energy,
      end_energy,
      start_time1,
      end_time1
    );

    let start_time2 = Math.trunc(
      (countTimeValue[0].getTime() - dataLean2[0][0]) / 1000 / 3600
    );
    let end_time2 = Math.trunc(
      (countTimeValue[1].getTime() - dataLean2[0][0]) / 1000 / 3600
    );
    let data2 = loadCountSerie(
      dataLean2,
      start_energy,
      end_energy,
      start_time2,
      end_time2
    );
    let dataDifference = [[], []];
    dataDifference[0] = data1[0];
    dataDifference[1] = data1[1].map(function (item, index) {
      return item - data2[1][index];
    });
    dataDifference = createChartData(dataDifference[0], dataDifference[1]);
    setCountDifference(dataDifference);

    data1 = createChartData(data1[0], data1[1]);
    setCountData1(data1);

    data2 = createChartData(data2[0], data2[1]);
    setCountData2(data2);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container className="count-container">
          <Grid item xs={12}>
            <h4
              classname="title"
              style={{ marginTop: "20px", marginBottom: "20px" }}
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
                    maxDate={new Date(dataLean1[0][1] - 2 * 3600 * 1000)}
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
                    maxDate={new Date(dataLean1[0][1] - 2 * 3600 * 1000)}
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
                min={dataLean1[0][2]}
                max={dataLean1[0][2] + dataLean1[0][3] * dataLean1[0][4]}
                step={dataLean1[0][3]}
                value={countSliderValue}
                onChange={handleCountSliderChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                marks={[
                  {
                    value: dataLean1[0][2],
                    label: dataLean1[0][2].toString() + " keV",
                  },
                  {
                    value: dataLean1[0][2] + dataLean1[0][3] * dataLean1[0][4],
                    label:
                      (
                        dataLean1[0][2] +
                        dataLean1[0][3] * dataLean1[0][4]
                      ).toString() + " keV",
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <Box margin="2em" color="white"></Box>
              <CountViewer data={[countData1, countData2]} name={name} />
            </Grid>
            <Grid xs={12} sm={9}>
              <CountViewer data={[dataDiff]} name={nameDiff} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Count2;
