import Chart from "react-apexcharts";
import moment from 'moment'

/**
* @author
* @function ChartCPeriod
* Lance les graphiques adaptés à la comparaison de deux périodes pour un même détecteur pour le taux de comptage
**/

export default function ChartCPeriod(props) {
    // Les dates données en props du composant : début et fin des deux périodes
    const startDate1 = props.startDate1;
    const startDate2 = props.startDate2;
    const endDate1 = props.endDate1;
    const endDate2 = props.endDate2;
    var start1 = moment([new Date(startDate1).getFullYear(), new Date(startDate1).getMonth(), new Date(startDate1).getDate()])
    var end1 = moment([new Date(endDate1).getFullYear(), new Date(endDate1).getMonth(), new Date(endDate1).getDate()])
    var start2 = moment([new Date(startDate2).getFullYear(), new Date(startDate2).getMonth(), new Date(startDate2).getDate()])
    var end2 = moment([new Date(endDate2).getFullYear(), new Date(endDate2).getMonth(), new Date(endDate2).getDate()])
    
    const seriesLine1 = [{
            name: "Nombre de photons par heure",
            data: props.data1,
    }]

    const seriesLine2 = [{
            name: "Nombre de photons par heure",
            data: props.data2,
    }]

    const options = (start, end) => {
        return({
            chart: {
                autoSelected : 'selection',
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
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset : false,
                    },
                    export: {
                        csv: {
                        filename: 'comptage' + '_' + start.format('YYYYMMDD').toString()  + '_' + end.format('YYYYMMDD').toString()  ,
                        columnDelimiter: ';',
                        headerCategory: 'Date',
                        headerValue: 'Nombre de photons par heure',
                        dateFormatter : function(x) {return moment(x).format('YYYY-MM-DD HH:m');},  
                        },
                        svg: {
                        filename: "comptage"+ '_' + start.format('YYYYMMDD').toString()  + '_' + end.format('YYYYMMDD').toString() ,
                        },
                        png: {
                        filename: "comptage"+ '_' + start.format('YYYYMMDD').toString()  + '_' + end.format('YYYYMMDD').toString() ,
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
            markers: {
                size: 0,
            },
            yaxis: {
                labels: {
                formatter: function (val) {
                    return val.toFixed(0);
                    },
                },
                lines: {
                show: true,
                },
                title: {
                text: 'Photons par heure'
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
            colors:['#09476e'],
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
        })
    }

        

    return (
        <div id="wrapper">
            <div id="chart-line">
            <Chart options={options(start1, end1)} series={seriesLine1} type="line" height={200} />
            </div>
            <div id="chart-line2">
            <Chart options={options(start2, end2)} series={seriesLine2} type="line" height={200} />
            </div>
        </div>
    )
}
