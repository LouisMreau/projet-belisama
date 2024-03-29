import { React, useState, useEffect } from "react";
import "./style.css";
import moment from "moment";
import "moment/locale/fr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Grid,
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from "@material-ui/core";

import EnergyViewer from "../Chart/EnergyViewer";

/**
 * @author
 * @function Energy2
 * Displays the energy graph for two detectors
 * Builds the data and calls EnergyViewer to draw the graph
 * Props : Two detector id, their data (dataLean) and information concerning all detectors (name, place, ...)
 * Please refer to energy.js for more information
 **/

const Energy2 = (props) => {
  const detectorId1 = props.detectorId1;
  const detectorId2 = props.detectorId2;
  const dataDetector = props.dataDetector;
  var dataLean1 = props.dataLean1;
  var dataLean2 = props.dataLean2;
  // Defining the installation data to ensure the visualization of the available data
  // installation_date is a date object
  var installation_date1 = dataDetector.filter(function (detector1) {
    return detector1.id == detectorId1;
  })[0].installation_date;

  var installation_date2 = dataDetector.filter(function (detector2) {
    return detector2.id == detectorId2;
  })[0].installation_date;

  installation_date1 = installation_date1 + "T00:00:00";
  installation_date2 = installation_date2 + "T00:00:00";

  const maximumOfTwoDates = (date1, date2) => {
    return date1 > date2 ? date1 : date2;
  };
  
  const installation_date = maximumOfTwoDates(
    installation_date1,
    installation_date2
  );


   // !!! Must take into account the two hour lag !!!
  // The second timestamp in the datalean has been understood as a UTC date and not a locale date, thus it has added two hours (GMT +02) in the transformation
  const [spectrumTimeValue, setSpectrumTimeValue] = useState([
    new Date(installation_date),
    new Date(dataLean1[0][1] - 2 * 3600 * 1000),
  ]);
  const [spectrumData1, setSpectrumData1] = useState([]);
  const [spectrumData2, setSpectrumData2] = useState([]);
  const [dataDiff, setEnergyDifference] = useState([]);
  const name = [[detectorId1, detectorId2], "Spectre en énergie"];
  const nameDiff = [
    ["Différence détecteur1 - détecteur2"],
    "Différence détecteur1 - détecteur2",
  ];
  const [loadingData, setLoadingData] = useState(false);
  const [switchState, setSwitchState] = useState(false);

  const handleChangeSwitch = (event) => {
    setLoadingData(true);
    setSwitchState(event.target.checked);
  };

  useEffect(() => {
    if (switchState) {
      switchToLogarithmData(spectrumData1, spectrumData2).then(
        (data1, data2) => {
          setSpectrumData1(data1);
          setSpectrumData2(data2);
        }
      );
    } else {
      setSpectrum(dataLean1, dataLean2);
    }
    setLoadingData(false);
  }, [switchState]);

  useEffect(() => {
    if (switchState)
      switchToLogarithmDifference(dataDiff).then((data) => {
        setEnergyDifference(data);
      });
  }, [switchState]);

  useEffect(() => {
    if (dataLean1.length > 0) {
      setSpectrum(dataLean1, dataLean2);
      setSwitchState(false);
    }
  }, [spectrumTimeValue]);

  useEffect(() => {
    if (dataLean1.length > 0) {
      setSpectrumTimeValue([
        new Date(installation_date),
        new Date(dataLean1[0][1] - 2 * 3600 * 1000),
      ]);
      setSwitchState(false);
    }
  }, [dataLean1, dataLean2]);

  // !!! Must take into account the two hour lag !!!
  // The second timestamp in the datalean has been understood as a UTC date and not a locale date, thus it has added two hours (GMT +02) in the transformation
  const start_date_limit = moment(new Date(dataLean1[0][0]));
  const end_date_limit = moment(new Date(dataLean1[0][1] - 2 * 3600 * 1000));

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
    let energies = [];
    let densities = new Array(dataLean[1][0].length);
    for (let i = 0; i < dataLean[1][0].length; ++i) densities[i] = 0;
    let total_density = 0;

    for (var j = 0; j < dataLean[1][0].length; j++) {
      energies[j] = dataLean[0][2] + j * energy_interval;
    }
    for (var i = inf_time; i < sup_time; i++) {
      for (var j = 0; j < dataLean[1][0].length; j++) {
        densities[j] = densities[j] + dataLean[1][i][j];
        total_density += dataLean[1][i][j];
      }
    }
    for (var j = 0; j < densities.length; j++) {
      densities[j] /= total_density;
    }
    return [energies, densities];
  };

  const setSpectrum = (dataLean1, dataLean2) => {
    let start_time1 =
      (spectrumTimeValue[0].getTime() - dataLean1[0][0]) / 1000 / 3600;
    let end_time1 =
      (spectrumTimeValue[1].getTime() - dataLean1[0][0]) / 1000 / 3600;
    let start_time2 =
      (spectrumTimeValue[0].getTime() - dataLean2[0][0]) / 1000 / 3600;
    let end_time2 =
      (spectrumTimeValue[1].getTime() - dataLean2[0][0]) / 1000 / 3600;
    let data1 = loadSpectrum(
      dataLean1,
      start_time1,
      end_time1,
      dataLean1[0][3]
    );
    let data2 = loadSpectrum(
      dataLean2,
      start_time2,
      end_time2,
      dataLean2[0][3]
    );
    let dataDifference = [[], []];
    dataDifference[0] = data1[0];
    dataDifference[1] = data1[1].map(function (item, index) {
      return item - data2[1][index];
    });

    data1 = createChartData(data1[0], data1[1]);
    data2 = createChartData(data2[0], data2[1]);
    dataDifference = createChartData(dataDifference[0], dataDifference[1]);
    setSpectrumData1(data1);
    setSpectrumData2(data2);
    setEnergyDifference(dataDifference);
  };

  async function switchToLogarithmData(data1, data2) {
    let logData1 = data1;
    let logData2 = data2;
    for (let key in logData1) {
      let y1 = logData1[key].y;
      let y2 = logData2[key].y;
      y1 = Math.log(y1);
      y2 = Math.log(y2);
      logData1[key].y = y1;
      logData2[key].y = y2;
    }
    return Promise.resolve(logData1, logData2);
  }

  async function switchToLogarithmDifference(data) {
    let logDataDiff = data;
    for (let key in logDataDiff) {
      let y3 = logDataDiff[key].y;
      y3 = Math.abs(y3);
      y3 = Math.log(y3);
      logDataDiff[key].y = y3;
    }
    return Promise.resolve(logDataDiff);
  }



  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container className="spectrum-container">
          <Grid item xs={12}>
            <h4
              classname="title"
              style={{ marginTop: "20px", marginBottom: "20px" }}
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
                      handleSpectrumTimeChange(false, date);
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
                    maxDate={new Date(dataLean1[0][1] - 2 * 3600 * 1000)}
                    timeInputLabel="Heure :"
                    timeFormat="HH:mm"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeInput
                    selected={spectrumTimeValue[1]}
                    onChange={(date) => {
                      handleSpectrumTimeChange(true, date);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {loadingData && (
            <Typography variant="h4">Chargement des données</Typography>
          )}
          {!loadingData && (
            <Grid container justify="center" alignItems="center">
              <Grid item xs={12} sm={9}>
                <Box margin="1.5em" color="white"></Box>
                <EnergyViewer
                  data={[spectrumData1, spectrumData2]}
                  name={name}
                />
              </Grid>

              <Grid item xs={12} sm={9}>
                <Box margin="1.5em" color="white"></Box>
                <EnergyViewer data={[dataDiff]} name={nameDiff} />
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
                  label="Passage au logarithme"
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Energy2;
