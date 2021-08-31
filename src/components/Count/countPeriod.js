import { React, useState, useEffect } from "react";
import "./style.css";
import Slider from "@material-ui/core/Slider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Grid,
  Box,
} from "@material-ui/core";

import ChartPeriod from "../Chart/ChartPeriod";

/**
 * @author
 * @function CountPeriod
 * Displays the counting graph for two periods
 * Builds the data and calls ChartPeriod to draw the graphs (one onthe top of the other)
 * Props : One detector id, its data and information concerning all detectors (name, place, ...)
 * Please refer to count.js for more information
**/

const CountPeriod = (props) => {
  var detectorId = props.detectorId;
  var dataLean = props.dataLean;
  const dataDetector = props.dataDetector;
  // Defining the installation data to ensure the visualization of the available data
  // installation_date is a date object
  var installation_date = dataDetector.filter(function (detector) {
    return detector.id == detectorId;
  })[0].installation_date;
  installation_date = installation_date + "T00:00:00";


  const addDays = (date, number) => {
    var newDay = new Date();
    newDay = date.setDate(date.getDate() + number);
    return newDay;
  };

  const [countSliderValue, setCountSliderValue] = useState([
    dataLean[0][2],
    dataLean[0][2] + 7000,
  ]);
  // !!! Must take into account the two hour lag !!!
  // The second timestamp in the datalean has been understood as a UTC date and not a locale date, thus it has added two hours (GMT +02) in the transformation
  const [countData1, setCountData1] = useState([]);
  const [countData2, setCountData2] = useState([]);
  const [startDate1, setStartDate1] = useState(new Date(installation_date));
  const [endDate1, setEndDate1] = useState(addDays(new Date(startDate1), 1));
  const [startDate2, setStartDate2] = useState(endDate1);
  const [endDate2, setEndDate2] = useState(addDays(new Date(startDate2), 1));

  useEffect(() => {
    if (dataLean.length > 0) {
      setCountSerie(dataLean);
    }
  }, [startDate1, startDate2, endDate1, endDate2, countSliderValue]);

  useEffect(() => {
    if (dataLean.length > 0) {
      setCountSliderValue([dataLean[0][2], dataLean[0][2] + 7000]);
      // THe two hour lag
      setStartDate1(new Date(installation_date));
      setEndDate1(addDays(new Date(installation_date), 1));
      setStartDate2(addDays(new Date(installation_date), 1));
      setEndDate2(addDays(new Date(installation_date), 2));
    }
  }, [props.dataLean]);

  const handleCountSliderChange = (event, newValue) => {
    setCountSliderValue(newValue);
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

  const setCountSerie = (dataLean) => {
    let start_energy = Math.trunc(
      (countSliderValue[0] - dataLean[0][2]) / dataLean[0][3]
    );
    let end_energy = Math.trunc(
      (countSliderValue[1] - dataLean[0][2]) / dataLean[0][3]
    );
    let start_time1 = Math.trunc(
      (startDate1.getTime() - dataLean[0][0]) / 1000 / 3600
    );
    let end_time1 = Math.trunc((endDate1 - dataLean[0][0]) / 1000 / 3600);
    let start_time2 = Math.trunc((startDate2 - dataLean[0][0]) / 1000 / 3600);
    let end_time2 = Math.trunc((endDate2 - dataLean[0][0]) / 1000 / 3600);
    let data1 = loadCountSerie(
      dataLean,
      start_energy,
      end_energy,
      start_time1,
      end_time1
    );
    let data2 = loadCountSerie(
      dataLean,
      start_energy,
      end_energy,
      start_time2,
      end_time2
    );
    data1 = createChartData(data1[0], data1[1]);
    data2 = createChartData(data2[0], data2[1]);
    setCountData1(data1);
    setCountData2(data2);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container className="count-container">
          <Grid
            container
            justify="center"
            spacing={3}
            className="periode-container"
          >
            <Grid item xs={10}>
              <Grid container spacing={3}>
                {detectorId && (
                  <Grid item md={12} lg={6} xs={12}>
                    <p>Période 1</p>
                    <DatePicker
                      selected={startDate1}
                      onChange={(date) => setStartDate1(date)}
                      selectsStart
                      startDate={startDate1}
                      endDate={endDate1}
                      minDate={new Date(installation_date)}
                      maxDate={new Date(dataLean[0][1] - 2 * 3600 * 1000)}
                    />
                    <DatePicker
                      selected={endDate1}
                      onChange={(date) => setEndDate1(date)}
                      selectsEnd
                      startDate={startDate1}
                      endDate={endDate1}
                      minDate={startDate1}
                      maxDate={new Date(dataLean[0][1] - 2 * 3600 * 1000)}
                    />
                  </Grid>
                )}
                {detectorId && startDate1 && endDate1 && (
                  <Grid item md={12} lg={6} xs={12}>
                    <p>Période 2</p>
                    <DatePicker
                      selected={startDate2}
                      onChange={(date) => setStartDate2(date)}
                      selectsStart
                      dateFormat="dd/MM/yyyy"
                      startDate={startDate2}
                      endDate={endDate2}
                      minDate={new Date(installation_date)}
                      maxDate={new Date(dataLean[0][1] - 2 * 3600 * 1000)}
                    />
                    <DatePicker
                      selected={endDate2}
                      onChange={(date) => setEndDate2(date)}
                      selectsEnd
                      dateFormat="dd/MM/yyyy"
                      startDate={startDate2}
                      endDate={endDate2}
                      minDate={startDate2}
                      maxDate={new Date(dataLean[0][1] - 2 * 3600 * 1000)}
                    />
                  </Grid>
                )}
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
              <ChartPeriod
                data1={countData1}
                data2={countData2}
                startDate1={startDate1}
                startDate2={startDate2}
                endDate1={endDate1}
                endDate2={endDate2}
              />
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

export default CountPeriod;
