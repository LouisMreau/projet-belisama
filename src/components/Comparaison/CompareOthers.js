import { React, useState, useEffect, useRef, Component } from "react";
import "./style.css";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  Grid,
  Container,
  Button,
  Paper,
  Box,
  Typography,
  Link,
  Breadcrumbs,
  CircularProgress,
  Hidden,
} from "@material-ui/core";
import axios from "axios";

import CountWeather from "../Count/countWeather";

/**
 * @author
 * @function CompareOthers
 * Given one weather parameter (temperature, pressure, humidity) and one period, loads the data
 * dataDetector is a json object that gives information about each detector (name, id, place,...)
 * Returns a page in which the user can select one period and a weather parameter plus a button that triggers the display of the graph (countWeather)
 **/

const CompareOthers = (props) => {
  const [dataLean, setDataLean] = useState([]);
  const dataDetector = props.dataDetector;
  const [detectorId, setDetectorId] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const [HKData, setHKData] = useState([]);

  const [loadingData, setLoadingData] = useState(false);
  const [type, setType] = useState("");

  useEffect(() => {
    setShowGraph(false);
    setLoadingData(false);
  }, [detectorId, type]);

  useEffect(() => {
    if (dataLean.length > 0 && HKData.length > 0) {
      setLoadingData(false)
      setShowGraph(true);
    }
  }, [dataLean, HKData]);

  useEffect(() => {
    if (detectorId.length > 0 && loadingData) {
      loadHKData();
    }
  }, [loadingData]);

  useEffect(() => {
    if (detectorId.length > 0 && loadingData) {
      loadData();
      ;
    }
  }, [loadingData]);

  const handleChangeDetector = (event) => {
    setDetectorId(event.target.value);
  };
  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleGraph = (detectorId, type) => {
    if (detectorId.length > 0 && type.length > 0) {
      setLoadingData(true);
    } else {
      alert("Veuillez choisir un détecteur et un paramètre.");
      setShowGraph(false);
    }
  };

  const loadHKData = async () => {
    // Loads the file that concentrates the information about the temperature, pressure and humidity
    const url =
      "https://data-belisama.s3.eu-west-3.amazonaws.com/" +
      detectorId +
      "/hk_files/" +
      detectorId +
      "_hk_THP.json";
    await axios
      .get(url)
      .then((response) => {
        setHKData(response.data);
        if (response.data.length == 0) {
          alert("Données non disponibles");
        }
      })
      .catch((error) => {
        console.log("Données introuvables");
        setHKData([]);
      });
  };

  const loadData = async () => {
    // Loads the processed data of one detector 
    // The argument "detector" is the id of the detector 
    await axios
      .get(
        "https://data-belisama.s3.eu-west-3.amazonaws.com/" +
          detectorId +
          "/data_lean_update.json"
      )
      .then((response) => {
        setDataLean(response.data);
      })
      .catch((error) => {
        console.log("Détecteur introuvable");
        console.log(error);
      });
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

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
  }));

  const classes = useStyles();

  return (
    <div>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography color="inherit">Analyse</Typography>
            <Typography color="textPrimary">Météo</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12}>
          <Box margin="2em"></Box>
          <h3> Comparaison avec le temps météorologique</h3>
          <Box margin="2em"></Box>
        </Grid>
        <Grid item md={9} xs={12}>
          <Hidden only="xs">
            <Paper>
              <Grid container xs={12} justify="center">
                <Grid item xs={12}>
                  <Box margin="1em"></Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Détecteur
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={detectorId}
                      onChange={handleChangeDetector}
                    >
                      {dataDetector.map((detector) => (
                        <MenuItem value={detector.id}>
                          {detector.place}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box margin="2em"></Box>
                </Grid>

                <Grid item sm={6} xs={12}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Paramètres
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={type}
                      onChange={handleChangeType}
                    >
                      <MenuItem value={"Température"}>Température</MenuItem>
                      <MenuItem value={"Pression"}>Pression</MenuItem>
                      <MenuItem value={"Humidité"}>Humidité</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box margin="1em"></Box>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleGraph(detectorId, type);
                    }}
                  >
                    Comparer
                  </Button>
                  <Box margin="2em"></Box>
                </Grid>
              </Grid>
            </Paper>
          </Hidden>
          <Hidden smUp>
            <Grid container xs={12} justify="center">
              <Grid item xs={12}>
                <Box margin="1em"></Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    Détecteur
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={detectorId}
                    onChange={handleChangeDetector}
                  >
                    {dataDetector.map((detector) => (
                      <MenuItem value={detector.id}>{detector.place}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box margin="2em"></Box>
              </Grid>

              <Grid item sm={6} xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    Paramètres
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    onChange={handleChangeType}
                  >
                    <MenuItem value={"Température"}>Température</MenuItem>
                    <MenuItem value={"Pression"}>Pression</MenuItem>
                    <MenuItem value={"Humidité"}>Humidité</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box margin="2em"></Box>
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleGraph(detectorId, type);
                  }}
                >
                  Comparer
                </Button>
                <Box margin="2em"></Box>
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
        {loadingData && (
          <Grid item xs={12}>
            <Box margin="2em"></Box>
            <CircularProgress />
          </Grid>
        )}
        {showGraph && (
          <CountWeather
            detectorId={detectorId}
            dataLean={dataLean}
            dataDetector={dataDetector}
            HKData={HKData}
            type={type}
          />
        )}
      </Grid>
    </div>
  );
};

export default CompareOthers;
