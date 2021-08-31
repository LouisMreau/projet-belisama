import { React, useState, useEffect } from "react";
import Chart from "react-apexcharts";
import moment from "moment";
import { Slider, Typography, Box, TextField, Grid } from "@material-ui/core";

/**
 * @author
 * @function EnergyViewer
 * Return the energy graph
 * Takes in props an array whose first element is an array of the series name and whose second element is the graph title and data
 * Format of data : [{x : value, y : value}, ...]
 **/

export default function EnergyViewer(props) {
  const seriesName = props.name[0];
  const data = props.data;
  var largeTitle = props.name[1];
  let separator = largeTitle.search(" ");
  var series = [];
  var filename = "spectre_energie";
  seriesName.map(function (sname, index) {
    filename = filename + "_" + sname;
    return series.push({
      name: sname,
      data: data[index],
    });
  });

  // Defining the graph options 
  // autoselected tool (zoom), toolbar, exported files, value formatter, responsive
  const options = {
    chart: {
      type: "area",
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
          reset: true | '<img src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
        export: {
          csv: {
            filename: filename,
            columnDelimiter: ";",
            headerCategory: "Energie",
            headerValue: "Densité",
          },
          svg: {
            filename: filename,
          },
          png: {
            filename: filename,
          },
        },
        autoSelected: "zoom",
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
      text: largeTitle,
      align: "left",
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(3);
        },
      },
      tickAmount: 3,
      lines: {
        show: true,
      },
      title: {
        text: "Densité de photons",
      },
    },
    xaxis: {
      type: "numeric",
      min: 50,
      max: 19950,
      lines: {
        show: true,
      },
      title: {
        text: "Energie (keV)",
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(5);
        },
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          title: {
            text: "Energie",
            align: "left",
          },
          yaxis: {
            title: { text: "Densité" },
            show: true,
            labels: {
              formatter: function (val) {
                return val.toFixed(2);
              },
            },
            tickAmount: 3,
          },
          toolbar: {
            show: true,
            autoSelected: "zoom",
          },
          tooltip: {
            style: {
              fontSize: "8px",
            },
            x: {
              show: false,
            },
          },
        },
      },
    ],
  };

  return (
    <div id="chart">
      <Chart options={options} series={series} />
      <Grid item xs={12}>
        <Box margin="3em"></Box>
      </Grid>
    </div>
  );
}
