import { React, useState, useEffect } from "react";
import "./style.css";
import Chart from "react-apexcharts";
import moment from "moment";
import {
  Grid,
  Button,
  Breadcrumbs,
  Typography,
  Box,
  CircularProgress,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * @author
 * @function HKGraph
 * Shows the data concerning the temperature, pressure and humidity
 * detectorId is a string that indicates the id of the detector (eg. obsmeudon)
 * dataDetector is a json object that gives information about each detector (name, id, place,...)
 * dataLean is an array that enumerates the number of arriving photons for each energy interval and each hour. It has the following format :
 * [[start_timestamp, end_timestamp, start_energy, number_of_energy_interval][[first_hour],[second_hour],[],...,[last_hour]]].
 * HKData is an array that contains two-minute interval array of temperature, humidity and pressure.
 **/

const HKGraph = (props) => {
  var dataDetector = props.dataDetector;
  var detectorId = props.detectorId;
  var HKData = props.HKData;
  // Temperature data
  const [tempData, setTempData] = useState([]);
  // Pressure data 
  const [pressureData, setPressureData] = useState([]);
  // Humidity data
  const [humData, setHumData] = useState([]);
  // Parameter that indicates the type of data that need to be shown
  const [type, setType] = useState(0);
  const [loadingData, setIsLoadingData] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [title, setTitle] = useState("");
  const [units, setUnits] = useState("");
  const [series, setSeries] = useState([]);
  // Defines the beginning of the vizualization : the initial date at midnight
  var start_date = new Date(Math.trunc(HKData[0][0] / 3600) * 3600 * 1000);
  start_date.setHours(0, 0);
  start_date.setDate(start_date.getDate() + 1);
  // Defines the end of the vizualization : the final date at midnight the previous day
  var end_date = new Date(Math.trunc(HKData[HKData.length - 1][0] / 3600) * 3600 * 1000);
  end_date.setHours(0, 0);
  const [TimeValue, setTimeValue] = useState([
    new Date(start_date),
    new Date(end_date),
  ]);

  // Defining the city for the header on the top of the page
  var city = dataDetector.filter(function (detector) {
    return detector.id == props.detectorId;
  })[0].city;

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleCountTimeChange = (isEndTime, newValue) => {
    if (isEndTime) {
      setTimeValue([TimeValue[0], newValue]);
    } else {
      setTimeValue([newValue, TimeValue[1]]);
    }
  };

  useEffect(() => {
    if (HKData.length > 0) {
      setShowGraph(false);
      loadHKDates(HKData);
    }
  }, [TimeValue]);


  useEffect(() => {
    if (HKData.length > 0) {
      loadTempSerie(HKData);
      loadPressureSerie(HKData);
      loadHumSerie(HKData);
    }
  }, [HKData]);

  useEffect(() => {
    if (HKData.length > 0) {
      setShowGraph(false);
    }
  }, [type]);

  useEffect(() => {
    if (series.length > 0) setShowGraph(true);
  }, [series]);

  const loadTempSerie = (
    // Extract the timetags and the temperature and set the temperature data
    HKData
  ) => {
    let temp = [];
    let times = [];
    for (var i = 0; i < HKData.length; i++) {
      temp.push(HKData[i][1]);
      times.push(new Date(1000 * HKData[i][0]));
    }
    let data = createChartData(times, temp);
    setTempData(data);
  };

  const loadPressureSerie = (
    // Extract the timetags and the pressure and set the pressure data
    HKData
  ) => {
    let pressure = [];
    let times = [];
    for (var i = 0; i < HKData.length; i++) {
      pressure.push(HKData[i][3]);
      times.push(new Date(1000 * HKData[i][0]));
    }
    let data = createChartData(times, pressure);
    setPressureData(data);
  };

  const loadHumSerie = (
    // Extract the timetags and the humidity and set the humidity data
    HKData
  ) => {
    let humidity = [];
    let times = [];
    for (var i = 0; i < HKData.length; i++) {
      humidity.push(HKData[i][2]);
      times.push(new Date(1000 * HKData[i][0]));
    }
    let data = createChartData(times, humidity);
    setHumData(data);
  };

  const loadHKDates = (HKData) => {
    // Processes and slices the hk data to adapt it to the period
    let start_time = Math.trunc(
      (TimeValue[0] - HKData[0][0] * 1000) / 1000 / (60 * 2)
    );
    let end_time = Math.trunc(
      (TimeValue[1] - Math.trunc(HKData[0][0] / 3600) * 3600 * 1000) /
        1000 /
        (60 * 2)
    );
    console.log(start_time);
    console.log(end_time);
    let data = HKData;
    data = data.slice(start_time, end_time);
    loadTempSerie(data);
    loadPressureSerie(data);
    loadHumSerie(data);
  };

  const selectSeries = (type) => {
    // Defines each series, units, title
    let series = [];
    let units = "";
    let title = "";
    if (type === 1) {
      series = [{ name: "Température", data: tempData }];
      units = "°C";
    } else if (type === 2) {
      series = [{ name: "Humidité", data: humData }];
      units = "%";
    } else if (type === 3) {
      series = [{ name: "Pression", data: pressureData }];
      units = "mbar";
    }
    title = series[0].name;
    return [series, title, units];
  };

  const displayGraph = (type) => {
    // Updates the series, title and units
    if (type > 0) {
      let seriesAndCo = [];
      if (type > 0) {
        seriesAndCo = selectSeries(type);
      }
      setTitle(seriesAndCo[1]);
      setSeries(seriesAndCo[0]);
      setUnits(seriesAndCo[2]);
    } else {
      alert("Sélectionnez un type de graphique.");
    }
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

  const options = {
    chart: {
      autoSelected: "zoom",
      id: "countChart",
      type: "line",
      stacked: false,
      width: "100%",
      animations: {
        enabled: false,
      },
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        export: {
          csv: {
            filename: detectorId + "_" + title,
            columnDelimiter: ";",
            headerCategory: "Date",
            headerValue: title,
            dateFormatter: function (x) {
              return moment(x).format("YYYY-MM-DD HH:m");
            },
          },
          svg: {
            filename: detectorId + "_" + title,
          },
          png: {
            filename: detectorId + "_" + title,
          },
        },
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      width: 1.5,
      dashArray: 0,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      showForSingleSeries: true,
    },
    markers: {
      size: 0,
    },
    title: {
      text: title,
      align: "left",
    },
    yaxis: {
      lines: {
        show: true,
      },
      title: {
        text: title + " (" + units + ")",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "dd/MM/yyyy, HH:mm",
        datetimeUTC: false,
      },
      lines: {
        show: true,
      },
      title: {
        text: "Date",
      },
    },
    tooltip: {
      shared: false,
      x: {
        format: "dd/MM/yyyy, HH:mm",
      },
      y: {
        title: {
          formatter: (seriesName) => seriesName + " (" + units + ") :",
        },
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          title: {
            text: title,
            align: "left",
          },
          yaxis: {
            show: true,
            tickAmount: 3,
          },
          toolbar: {
            show: false,
          },
          tooltip: {
            style: {
              fontSize: "8px",
            },
            x: {
              show: false,
            },
            y: {
              title: title + " (" + units + ")",
            },
          },
        },
      },
    ],
  };

  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={12}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="inherit">{city}</Typography>
          <Typography color="textPrimary">Données utiles</Typography>
        </Breadcrumbs>
      </Grid>

      <Grid item xs={12}>
        <h4
          className="title"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          Données utiles
        </h4>
      </Grid>
      <Grid item md={9} xs={12}>
        <Paper>
          <Grid container xs={12} justify="center">
            <Grid item xs={12}>
              <Box margin="1em"></Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container xs={12}>
                <Grid item xs={12} sm={6}>
                  <Grid item xs={12}>
                    <Typography
                      style={{
                        marginRight: "20px",
                        marginLeft: "20px",
                      }}
                    >
                      Début de la période
                    </Typography>
                  </Grid>
                  <DatePicker
                    minDate={start_date}
                    maxDate={end_date}
                    dateFormat="dd/MM/yyyy"
                    selected={TimeValue[0]}
                    onChange={(date) => handleCountTimeChange(false, date)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid item xs={12}>
                    <Typography
                      style={{
                        marginLeft: "20px",
                        marginRight: "20px",
                      }}
                    >
                      Fin de la période
                    </Typography>
                  </Grid>
                  <DatePicker
                    minDate={TimeValue[0]}
                    maxDate={end_date}
                    dateFormat="dd/MM/yyyy"
                    selected={TimeValue[1]}
                    onChange={(date) => handleCountTimeChange(true, date)}
                  />
                </Grid>
              </Grid>
              <Box margin="2em"></Box>
            </Grid>
            <Grid item xs={12} md={4}>
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
                  <MenuItem value={1}>Température</MenuItem>
                  <MenuItem value={2}>Humidité</MenuItem>
                  <MenuItem value={3}>Pression</MenuItem>
                </Select>
              </FormControl>
              <Box margin="2em"></Box>
            </Grid>
            <Grid item xs={12}>
              <Box margin="0.5em"></Box>
            </Grid>
          </Grid>
        </Paper>

        <Grid container>
          <Grid item xs={12}>
            <Box margin="2em"></Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={() => {
                displayGraph(type);
              }}
            >
              Voir les données
            </Button>
            <Grid item xs={12}>
              <Box margin="1.5em"></Box>
            </Grid>
            {loadingData && <CircularProgress />}
          </Grid>
        </Grid>

        {showGraph && <Chart options={options} series={series} />}
      </Grid>
    </Grid>
  );
};

export default HKGraph;
