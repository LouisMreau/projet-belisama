import {React, useState, useEffect} from 'react'
import Chart from "react-apexcharts";
import moment from 'moment'
import {Slider, Typography, Box} from '@material-ui/core'

/**
* @author
* @function EnergyViewer
* Lance le graphiques adapté au spectre d'énergie
* Prend en props un array avec en premier élément les noms des séries et en deuxième position le titre du graphique 
* Prend également les données dans le format suivant : [{x : value, y : value}, ...]
**/

export default function EnergyViewer(props) {
  const seriesName = props.name[0];
  const data = props.data
  var largeTitle = props.name[1];
  let separator = largeTitle.search(" ")
  var series = []
  var filename = 'spectre_energie'
  seriesName.map(function(sname, index) {
    filename = filename + '_' + sname 
    return series.push({
        name : sname,
        data : data[index]
    });
  })

  const [energyValue, setEnergyValue] = useState([50, 10000])
  const [densityValue, setDensityValue] = useState([50, 10000])

  
  const handleChangeEnergyValue = (event, newValue) => {
    setEnergyValue(newValue);
  };

 
  const options = {
    chart: {
      type: 'area',
      stacked: false,
      width: '100%',
      animations : {
        enabled : false,
      },
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        show : true, 
        tools: {
          download: true,
          selection: true,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false | '<img src="/static/icons/reset.png" width="20">',
          customIcons: []
        },
        export: {
          csv: {
            filename: filename,
            columnDelimiter: ';',
            headerCategory: 'Energie',
            headerValue: 'Densité',
          },
          svg: {
            filename:  filename,
          },
          png: {
            filename:  filename,
          }
        },
        autoSelected: 'selection'
      }
    },
    stroke: {
      show: true,
      curve: 'smooth',
      width: 1.5,
      dashArray: 0,      
    },
    dataLabels: {
      enabled: false
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
      align: 'left'
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(3);
        },
      },
      lines: {
        show: true,
      },
      title: {
        text: 'Densité de photons'
      },
    },
    xaxis: {
      type: 'numeric',
      min : energyValue[0], 
      max : energyValue[1],
      lines: {
        show: true,
      },
      title: {
        text: 'Energie (keV)'
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(5);
        }
      }
    }, 
    responsive : [{
      breakpoint: 600,
      options: {
          title: {
            text: 'Energie',
            align: 'left'
          },
          yaxis: {  
            title : {text : "Densité",},
            labels: {
              formatter: function (val) {
                return val.toFixed(3);
              },},
            forceNiceScale: true, 
          }, 
          xaxis: {
            min : energyValue[0], 
            max : energyValue[1],
          },
          toolbar: {
            show : true, 
            autoSelected: 'zoom',

              
          }, 
          tooltip: {
            style: {
              fontSize: '8px',
            },
            x: {
              show: false,},
          }, 

          
      }
    }]
  }
  
  return (
    <div id="chart">
      <Chart options={options} series={series} />
      <Typography id="range-slider" gutterBottom>
        Sélectionnez l'intervalle d'énergie du graphique ci-dessus
      </Typography>
      <Box margin = '1em'></Box>
      <Slider
        value={energyValue}
        onChange={handleChangeEnergyValue}
        min = {50}
        max = {13000}
        step={50}
        marks
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
      />
     <Box margin = '3em'></Box>
    </div>
  );
}