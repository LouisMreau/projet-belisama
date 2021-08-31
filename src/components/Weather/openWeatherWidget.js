import { React } from "react";
import "./style.css";
import { Grid, Box } from "@material-ui/core";

/**
 * @author
 * @function openWeatherWidget
 * Gives the weather with a seven day forecast for one city given and gives info on realtime lightning 
 **/

const OpenWeatherWidget = (props) => {
  const city = props.city;
  const weatherURL = props.weatherURL;
  // const firstClick = props.firstClick
  var firstClick = true;

  function weather(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (!d.getElementById(id)) {
      js = d.createElement(s);
      js.id = id;
      js.src = "https://weatherwidget.io/js/widget.min.js";
      fjs.parentNode.insertBefore(js, fjs);
    }
  }

  return (
    <Grid container>
      <Grid container direction="justify">
        {firstClick && (
          <Grid item xs={12}>
            <a
              class="weatherwidget-io"
              href={weatherURL}
              data-label_1={city.toUpperCase()}
              data-label_2="WEATHER"
              language="french"
              data-theme="original"
            ></a>
            {weather(document, "script", "weatherwidget-io-js")}
            <p>
              Pour avoir la carte des orages en temps réel, voir{" "}
              <a
                href="https://map.blitzortung.org/#5.21/47.078/2.367"
                target="_blank"
              >
                ici
              </a>
            </p>
          </Grid>
        )}
        {!firstClick && (
          <Grid container direction="row-reverse">
            <Grid>
              <Box margin="2em"></Box>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default OpenWeatherWidget;
