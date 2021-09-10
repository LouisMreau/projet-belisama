import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useEventHandlers,
} from "react";
import "./style.css";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import axios from "axios";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
  Rectangle,
} from "react-leaflet";
import {
  Grid,
  Container,
  Button,
  Paper,
  Box,
  Typography,
  Hidden,
} from "@material-ui/core";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { NavLink, Link } from "react-router-dom";
import Help from "../Help/help";
import DetectList from "../DetectorList/detectorList";

/**
 * @author
 * @function DetectorMap
 * The home page, it displays the detector map with marker for each detector and it calls detectorList.js for the list on the left
 * Loads the json object that gives all the information about detectors
 **/

const BootstrapButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 14,
    padding: "4px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    borderColor: "black",
    fontFamily: "Arial",
    "&:hover": {
      backgroundColor: "#dcdcdc",
      borderColor: "black",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#dcdcdc",
      borderColor: "#0062cc",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  },
})(Button);

const DetectorMap = (props) => {
  const [dataDetector, setDataDetector] = useState([]);

  const loadDataDetector = async () => {
    // Loads the data about all detectors (place, informations...)
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

  useEffect(() => {
    loadDataDetector();
  }, []);

  return (
    <Grid container justify="center">
      <Grid item xs={9}>
        <Hidden only="xs">
          <Grid container direction="row-reverse">
            <Grid>
              <Help page="Map" />
            </Grid>
          </Grid>
        </Hidden>
        <Hidden smUp>
          <Grid container justify="center">
            <Grid>
              <Help page="Map" />
              <Box margin="1em"></Box>
            </Grid>
          </Grid>
        </Hidden>

        <h3 style={{ marginBottom: "50px", marginTop: "10px" }}>
          Sélectionnez un détecteur
        </h3>
        <Paper elevation={3}>
          <Grid container direction="row">
            <DetectList dataDetector={dataDetector} />
            <Grid item xs={12} sm={8}>
              <MapContainer
                center={[47, 2]}
                zoom={6}
                minZoom={3}
                maxBounds={[
                  [-90, -180],
                  [90, 180],
                ]}
              >
                {/* Zoom on ile de France : 48.80496, 2.23108 zoom 9 */}
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                {dataDetector.map((detector) => (
                  <Marker position={detector.position}>
                    <Popup maxWidth={500}>
                      <Grid container justify="center" spacing={3}>
                        <Grid item xs={12}>
                          <b>Lieu : </b> {detector.place} <br />
                          {/* <b>Contact : </b> {detector.contact} <br /> */}
                          <b>Date d'installation : </b>{" "}
                          {detector.installation_date} <br />
                          <b>Statut : </b>{" "}
                          {detector.breakdown && (
                            <FiberManualRecordIcon
                              fontSize="small"
                              style={{ color: "red" }}
                            />
                          )}
                          {!detector.breakdown && (
                            <FiberManualRecordIcon
                              fontSize="small"
                              style={{ color: "green" }}
                            />
                          )}
                          <br />
                          <Grid>
                            <BootstrapButton
                              variant="outlined"
                              startIcon={<DoubleArrowIcon />}
                              href={"/data/" + detector.id}
                              style={{ marginTop: "20px" }}
                            >
                              Voir les données
                            </BootstrapButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Popup>
                    {/* </Grid> */}
                  </Marker>
                ))}
              </MapContainer>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DetectorMap;
