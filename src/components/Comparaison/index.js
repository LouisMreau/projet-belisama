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
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import RoomIcon from "@material-ui/icons/Room";
import DateRangeIcon from "@material-ui/icons/DateRange";

import CompareDetector from "../Comparaison/CompareDetector";
import ComparePeriod from "../Comparaison/ComparePeriod";

/**
 * @author
 * @function Comparaison
 * Loads the data concerning all the detectors and displays the appbar that enables to switch from one comparison type to another
 **/

const Comparaison = (props) => {
  const [value, setValue] = useState(0);
  const [dataDetector, setDataDetector] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    loadDataDetector();
  }, []);

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

  return (
    <div>
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
            <Tab label="Par détecteur" icon={<RoomIcon />} {...a11yProps(0)} />
            <Tab
              label="Par période"
              icon={<DateRangeIcon />}
              {...a11yProps(1)}
            />
          </Tabs>
        </Paper>
      </AppBar>
      <TabPanel value={value} index={0}>
        <CompareDetector dataDetector={dataDetector} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ComparePeriod dataDetector={dataDetector} />
      </TabPanel>
    </div>
  );
};

export default Comparaison;
