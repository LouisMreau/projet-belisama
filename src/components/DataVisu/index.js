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
  Hidden,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";

import GetAppIcon from "@material-ui/icons/GetApp";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import GraphicEqIcon from "@material-ui/icons/GraphicEq";
import WarningIcon from "@material-ui/icons/Warning";
import AcUnitIcon from "@material-ui/icons/AcUnit";

import Download from "../Download/index";
import Count from "../Count/count";
import Energy from "../Energy/energy";
import HKGraph from "../HK/hkGraph";
import OpenWeatherWidget from "../Weather/openWeatherWidget";

/**
 * @author
 * @function DataVisu
 * Displays the tabs to switch between three sections : counting graph, energy graph, downloading, etc
 * Loads the data for one particular detector selected on the home page (map), loads the information concerning all detectors and the hk data which is the data concerning temperature, pressure and humidity
 **/

const DataVisu = (props) => {
  let { detectorId } = useParams();
  const [dataLean, setDataLean] = useState([]);
  const [dataDetector, setDataDetector] = useState([]);
  const [HKData, setHKData] = useState([]);
  const [noData, setNoData] = useState(false)
  const [isLoadinData, setIsLoadingData] = useState(true);
  const [loadingMessage, setloadingMessage] = useState(
    "Chargement des données du détecteur..."
  );
  // Determine if the detector is broken/does not send data by reading the dataDetector file
  const [breakdown, setBreakdown] = useState(false);

  useEffect(() => {
    if (dataLean.length > 0 && dataDetector.length > 0 && (HKData.length > 0 || noData)) {
      setIsLoadingData(false);
      console.log(HKData)
    }
  }, [dataLean, dataDetector, HKData, noData]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadDataDetector();
  }, []);

  useEffect(() => {
    loadHKData();
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

  const loadHKData = async () => {

    const url =
      "https://data-belisama.s3.eu-west-3.amazonaws.com/"+ detectorId +"/hk_files/"+ detectorId +"_hk_THP.json";
    await axios
      .get(url)
      .then((response) => {
        setHKData(response.data);
        if (response.data.length == 0) {
          setNoData(true)
        }
      })
      .catch((error) => {
        console.log("Données introuvables");
        setHKData([])
      });
  };

  const loadData = async () => {
    // Loads the processed data of one detector 
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

  function TabPanelMin(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-force-tabpanel-${index}`}
        aria-labelledby={`scrollable-force-tab-${index}`}
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

  TabPanelMin.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  function a11yPropsMin(index) {
    return {
      id: `scrollable-force-tab-${index}`,
      "aria-controls": `scrollable-force-tabpanel-${index}`,
    };
  }

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
          <Hidden smUp>
            <Grid>
              <AppBar position="static" color="default">
                <Paper square>
                  <Grid container justify="center">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      variant="scrollable"
                      scrollButtons="on"
                      indicatorColor="primary"
                      textColor="primary"
                      aria-label="scrollable force tabs example"
                      centered
                    >
                      <Tab
                        label="Taux de comptage"
                        icon={<ShowChartIcon />}
                        {...a11yPropsMin(0)}
                      />
                      <Tab
                        label="Spectre en énergie"
                        icon={<GraphicEqIcon />}
                        {...a11yPropsMin(1)}
                      />
                      
                      <Tab
                        label="Téléchargement"
                        icon={<GetAppIcon />}
                        className="word"
                        {...a11yPropsMin(2)}
                      />
                      {!noData && (
                      <Tab
                        label="Température, pression et humidité"
                        icon={<AcUnitIcon />}
                        {...a11yPropsMin(3)}
                      />
                      )}
                    </Tabs>
                  </Grid>
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
              <TabPanelMin value={value} index={0}>
                <Count
                  dataLean={dataLean}
                  detectorId={detectorId}
                  dataDetector={dataDetector}
                />
              </TabPanelMin>
              <TabPanelMin value={value} index={1}>
                <Energy
                  dataLean={dataLean}
                  detectorId={detectorId}
                  dataDetector={dataDetector}
                />
              </TabPanelMin>
              {!noData && (
              <TabPanelMin value={value} index={3}>
                <HKGraph
                  dataLean={dataLean}
                  detectorId={detectorId}
                  dataDetector={dataDetector}
                  HKData = {HKData}
                />
              </TabPanelMin>
              )}
              <TabPanelMin value={value} index={2}>
                <Download
                  dataLean={dataLean}
                  detectorId={detectorId}
                  dataDetector={dataDetector}
                />
              </TabPanelMin>
            </Grid>
          </Hidden>
          <Hidden only = "xs">
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
                    {!noData && (
                    <Tab
                      label="Température, pression et humidité"
                      icon={<AcUnitIcon />}
                      {...a11yProps(3)}
                    />
                    )}
                    
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
              
              <TabPanel value={value} index={3}>
              {!noData && (
                <HKGraph
                  dataLean={dataLean}
                  detectorId={detectorId}
                  dataDetector={dataDetector}
                  HKData = {HKData}
                />
                )}
              </TabPanel>
              
              <TabPanel value={value} index={2}>
                <Download
                  dataLean={dataLean}
                  detectorId={detectorId}
                  dataDetector={dataDetector}
                />
              </TabPanel>
            </Grid>
          </Hidden>
        </Grid>
      )}
    </Grid>
  );
};

export default DataVisu;
