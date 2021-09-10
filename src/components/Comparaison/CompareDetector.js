import { React, useState, useEffect } from "react";
import "./style.css";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {
  Grid,
  Box,
  Typography,
  FormControl,
  Breadcrumbs,
  Link,
  CircularProgress,
  Button,
  Paper,
  Hidden,
} from "@material-ui/core";

import axios from "axios";

import Count2 from "../Count/count2";
import Energy2 from "../Energy/energy2";

/**
 * @author
 * @function CompareDetector
 * Given two detectors (chosen by the user), loads the data of these two detectors 
 * dataDetector is a json object that gives information about each detector (name, id, place,...)
 * Returns a page in which the user can select two detectors and a graph type plus a button that triggers the display of the graph (count2)
 **/

const CompareDetector = (props) => {
  const [dataLean1, setDataLean1] = useState([]);
  const [dataLean2, setDataLean2] = useState([]);
  const [detector1, setDetector1] = useState("");
  const [detector2, setDetector2] = useState("");
  const dataDetector = props.dataDetector;
  const [type, setType] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Once the user changes one of the variables, the graph is hidden
  useEffect(() => {
    setShowGraph(false);
    setLoadingData(false);
  }, [detector1, detector2, type]);

  // Loading the data
  useEffect(() => {
    if (loadingData && detector1.length > 0 && detector2.length > 0) {
      loadData(detector1, detector2);
    }
  }, [loadingData]);

  // Displaying the data
  useEffect(() => {
    if (loadingData == false) {
      setShowGraph(true);
    }
  }, [loadingData]);

  const loadData = async (detectorId1, detectorId2) => {
    // Loads the processed data of two detectors
    // The argument "detectorId" is the id of the detector 
    let one =
      "https://data-belisama.s3.eu-west-3.amazonaws.com/" +
      detectorId1 +
      "/data_lean_update.json";
    let two =
      "https://data-belisama.s3.eu-west-3.amazonaws.com/" +
      detectorId2 +
      "/data_lean_update.json";

    const requestOne = axios.get(one);
    const requestTwo = axios.get(two);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          setDataLean1(responseOne.data);
          setDataLean2(responseTwo.data);
          setLoadingData(false);
        })
      )
      .catch((errors) => {
        console.log("Détecteur introuvable");
      });
  };

  // Selection : detector, graph type
  const handleChangeDetector1 = (event) => {
    setDetector1(event.target.value);
  };
  const handleChangeDetector2 = (event) => {
    setDetector2(event.target.value);
  };
  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleGraph = (detector1, detector2, type) => {
    if (detector1.length > 0 && detector2.length > 0 && type.length > 0) {
      setLoadingData(true);
    } else {
      alert("Veuillez choisir deux détecteurs et un type de graphique.");
    }
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
            <Typography color="textPrimary">Par détecteur</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12}>
          <Box margin="2em"></Box>
          <h3> Comparaison des données de deux détecteurs</h3>
          <Box margin="2em"></Box>
        </Grid>
        <Grid item md={9} xs={12}>
          <Hidden only="xs">
            <Paper>
              <Grid container justify="center" spacing={3}>
                <Grid item md={12} lg={4} xs={12}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Détecteur 1
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={detector1}
                      onChange={handleChangeDetector1}
                    >
                      {dataDetector
                        .filter(function (x) {
                          return x.id !== detector2;
                        })
                        .map((detector) => (
                          <MenuItem value={detector.id}>
                            {detector.place}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={12} lg={4} xs={12}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Détecteur 2
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={detector2}
                      onChange={handleChangeDetector2}
                    >
                      {dataDetector
                        .filter(function (x) {
                          return x.id !== detector1;
                        })
                        .map((detector) => (
                          <MenuItem value={detector.id}>
                            {detector.place}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={12} lg={4} xs={12}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Type de graphique
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={type}
                      onChange={handleChangeType}
                    >
                      <MenuItem value={"count"}>Taux de comptage</MenuItem>
                      <MenuItem value={"spectrum"}>Spectre en énergie</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box margin="1em"></Box>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleGraph(detector1, detector2, type);
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
            <Grid container justify="center" spacing={3}>
              <Grid item md={12} lg={4} xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    Détecteur 1
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={detector1}
                    onChange={handleChangeDetector1}
                  >
                    {dataDetector
                      .filter(function (x) {
                        return x.id !== detector2;
                      })
                      .map((detector) => (
                        <MenuItem value={detector.id}>
                          {detector.place}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={12} lg={4} xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    Détecteur 2
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={detector2}
                    onChange={handleChangeDetector2}
                  >
                    {dataDetector
                      .filter(function (x) {
                        return x.id !== detector1;
                      })
                      .map((detector) => (
                        <MenuItem value={detector.id}>
                          {detector.place}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12} lg={4} xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">
                    Type de graphique
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    onChange={handleChangeType}
                  >
                    <MenuItem value={"count"}>Taux de comptage</MenuItem>
                    <MenuItem value={"spectrum"}>Spectre en énergie</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box margin="1em"></Box>
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleGraph(detector1, detector2, type);
                  }}
                >
                  Comparer
                </Button>
                <Box margin="2em"></Box>
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </Grid>

      <Grid container justify="center">
        <Grid item xs={12}>
          <Box margin="2em"></Box>
          {loadingData &&
            detector1.length > 0 &&
            detector2.length > 0 &&
            type.length > 0 && (
              <Grid item xs={12}>
                <Box margin="2em"></Box>
                <CircularProgress />
              </Grid>
            )}
          {showGraph && detector1 && detector2 && type == "count" && (
            <Grid item xs={12}>
              <Count2
                dataLean1={dataLean1}
                detectorId1={detector1}
                dataLean2={dataLean2}
                detectorId2={detector2}
                dataDetector={dataDetector}
              />
            </Grid>
          )}
          {showGraph && detector1 && detector2 && type == "spectrum" && (
            <Grid item xs={12}>
              <Energy2
                dataLean1={dataLean1}
                detectorId1={detector1}
                dataLean2={dataLean2}
                detectorId2={detector2}
                dataDetector={dataDetector}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default CompareDetector;
