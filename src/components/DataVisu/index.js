import { React, useState, useEffect, useRef, Component } from "react";
import "./style.css";
import { Link, useParams } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

import {
  Grid,
  Container,
  Button,
  Paper,
  Box,
  Typography,
  Card,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";

import GetAppIcon from "@material-ui/icons/GetApp";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import GraphicEqIcon from "@material-ui/icons/GraphicEq";
import WarningIcon from "@material-ui/icons/Warning";

import Download from "../Download/index";
import Count from "../Count/count";
import Energy from "../Energy/energy";
import OpenWeatherWidget from "../Weather/openWeatherWidget";

/**
 * @author
 * @function DataVisu
 * Permet l'affichage des trois onglets : Taux de comptage, Spectre en énergie, Téléchargements avec navigation en utilisant une AppBar
 * Charge le dataLean du détecteur choisi et les informations des détecteurs (dataDetector)
 **/

const DataVisu = (props) => {
  let { detectorId } = useParams();
  const [dataLean, setDataLean] = useState([]);
  const [dataDetector, setDataDetector] = useState([]);
  const [isLoadinData, setIsLoadingData] = useState(true);
  const [loadingMessage, setloadingMessage] = useState(
    "Chargement des données du détecteur..."
  );
  // Détermine si un detecteur fonctionne ou non en lisant le fichier dataDetector
  const [breakdown, setBreakdown] = useState(false);

  useEffect(() => {
    if (dataLean.length > 0 && dataDetector.length > 0) {
      setIsLoadingData(false);
    }
  }, [dataLean, dataDetector]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadDataDetector();
  }, []);

  useEffect(() => {
    if (dataDetector.length > 0) {
      var status = dataDetector.filter(function (detector) {
        return detector.id == detectorId;
      })[0].breakdown;
      setBreakdown(status);
    }
  }, [dataDetector]);

  const loadDataDetector = async () => {
    await axios
      .get(
        "https://data-belisama.s3.eu-west-3.amazonaws.com/data_detector.json"
      )
      .then((response) => {
        setDataDetector(response.data);
      })
      .catch((error) => {
        console.log("Données introuvables");
      });
  };

  const loadData = async () => {
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
        setloadingMessage("Détecteur introuvable");
      });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const [value, setValue] = useState(0);

  return (
    <Grid>
      {isLoadinData && <h2 style={{ margin: "30px" }}>{loadingMessage}</h2>}
      {!isLoadinData && (
        <Grid>
          <AppBar position="static">
            <Paper square>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
                textColor="primary"
                centered
              >
                <Tab
                  label="Taux de comptage"
                  icon={<ShowChartIcon />}
                  {...a11yProps(0)}
                />
                <Tab
                  label="Spectre en énergie"
                  icon={<GraphicEqIcon />}
                  {...a11yProps(1)}
                />
                <Tab
                  label="Téléchargement"
                  icon={<GetAppIcon />}
                  className="word"
                  {...a11yProps(2)}
                />
              </Tabs>
            </Paper>
          </AppBar>
          {breakdown && (
            <Grid item xs={12}>
              <Card>
                {" "}
                <WarningIcon /> Attention, ce détecteur est désactivé ou
                n'envoie plus de données depuis plus de 24 heures.{" "}
              </Card>
            </Grid>
          )}
          <TabPanel value={value} index={0}>
            <Count
              dataLean={dataLean}
              detectorId={detectorId}
              dataDetector={dataDetector}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Energy
              dataLean={dataLean}
              detectorId={detectorId}
              dataDetector={dataDetector}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Download
              dataLean={dataLean}
              detectorId={detectorId}
              dataDetector={dataDetector}
            />
          </TabPanel>
        </Grid>
      )}
    </Grid>
  );
};

export default DataVisu;
