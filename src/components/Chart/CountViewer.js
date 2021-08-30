import Chart from "react-apexcharts";
import moment from 'moment'

/**
* @author
* @function CountViewer
* Lance le graphiques adapté au taux de comptage
* Prend en props un array avec en premier élément les noms des séries et en deuxième position le titre du graphique 
* Prend les données dans le format suivant : [{x : value, y : value}, ...]
**/

export default function CountViewer(props) {
  const seriesName = props.name[0];
  const data = props.data
  const title = props.name[1];
  var series = []
  var filename = 'comptage'
  seriesName.map(function(sname, index) {
      filename = filename + '_' + sname 
      return series.push({
          name : sname,
          data : data[index]
      });
  })
  // Définition des options du graphique : 
  // outil par défaut (zoom), barre d'outils, fichiers d'exportation, formatter des valeurs, responsive
  const options = {
    chart: {
      autoSelected : 'zoom',
      id : 'countChart',
      type: 'line',
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
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset : true,
        },
        export: {
          csv: {
            filename: filename,
            columnDelimiter: ';',
            headerCategory: 'Date',
            headerValue: 'Nombre de photons par heure',
            dateFormatter : function(x) {return moment(x).format('YYYY-MM-DD HH:m');},
          },
          svg: {
            filename: filename  ,
          },
          png: {
            filename: filename,
          }
        },
      },
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
      text: title,
      align: 'left'
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
      tickAmount : 3,
      lines: {
        show: true,
      },
      title: {
        text: 'Nombre de photons par heure'
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'dd/MM/yyyy, HH:mm',
        datetimeUTC: false,
      },
      lines: {
        show: true,
      },
      title: {
        text: 'Date'
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(0);
        }
      },
      x: {
        format: "dd/MM/yyyy, HH:mm",
      },
    },
    responsive: [{
      breakpoint: 600,
      options: {
        title: {
          text: 'Comptage',
          align: 'left'
        },
        yaxis: {
          show : true,  
          tickAmount : 3,
        }, 
        toolbar: {
          show : false, 

        },  
        tooltip: {
          style: {
            fontSize: '8px',
          },
          x: {
            show: false,},
          y: {
              title: {
                  formatter: (seriesName) => "Photons par heure",
              },
          },
        },   
      }
    }]
  }

  return (
    <div id="chart">
      <Chart options={options} series={series} />
    </div>
  );
}
