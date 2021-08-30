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

import CountPeriod from "../Count/countPeriod";
import SpectrumPeriod from "../Energy/spectrumPeriod";

/**
 * @author
 * @function ComparePeriod
 * Permet le chargement des données pour un détecteur donné en input par l'utilisateur (en vue de visualiser les graphiques de deux périodes données)
 * Appelle CountPeriod qui demande les deux périodes à l'utilisateur
 **/

const ComparePeriod = (props) => {
  const [dataLean, setDataLean] = useState([]);
  const dataDetector = props.dataDetector;
  const [detectorId, setDetectorId] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [type, setType] = useState("");

  useEffect(() => {
    setShowGraph(false);
    setLoadingData(false);
  }, [detectorId, type]);

  useEffect(() => {
    if (dataLean.length > 0 && dataDetector.length > 0) {
      setShowGraph(true);
      setLoadingData(false);
    }
  }, [dataLean]);

  useEffect(() => {
    if (detectorId.length > 0) {
      loadData(detectorId);
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
      alert("Veuillez choisir un détecteur et un type de graphique.");
      setShowGraph(false);
    }
  };

  const loadData = async (detector) => {
    await axios
      .get(
        "https://data-belisama.s3.eu-west-3.amazonaws.com/" +
          detector +
          "/data_lean_update.json"
      )
      .then((response) => {
        setDataLean(response.data);
      })
      .catch((error) => {
        console.log("Détecteur introuvable");
      });
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
            <Typography color="textPrimary">Par période</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12}>
          <Box margin="2em"></Box>
          <h3> Comparaison de deux périodes</h3>
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
        {loadingData && detectorId.length > 0 && type.length > 0 && (
          <Grid item xs={12}>
            <Box margin="2em"></Box>
            <CircularProgress />
          </Grid>
        )}
        {showGraph && type == "count" && (
          <CountPeriod
            detectorId={detectorId}
            dataLean={dataLean}
            dataDetector={dataDetector}
          />
        )}
        {showGraph && type == "spectrum" && (
          <SpectrumPeriod
            detectorId={detectorId}
            dataLean={dataLean}
            dataDetector={dataDetector}
          />
        )}
      </Grid>
    </div>
  );
};

export default ComparePeriod;
