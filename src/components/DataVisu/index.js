import {React, useState, useEffect } from 'react'
import './style.css'
import {Link, useParams} from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';
import moment from 'moment'
// import dataLean from '../../resources/data/data_lean.json'
import Slider from '@material-ui/core/Slider';
import { getDefaultNormalizer } from '@testing-library/dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';


/**
* @author
* @function DataVisu
**/

const DataVisu = (props) => {
  let { detectorId } = useParams();
  const [countSliderValue, setCountSliderValue] = useState([]);
  const [countTimeValue, setCountTimeValue] = useState([]);
  const [spectrumTimeValue, setSpectrumTimeValue] = useState([]);
  const [spectrumData, setSpectrumData] = useState([]);
  const [countData, setCountData] = useState([]);
  const [dataLean, setDataLean] = useState([]);
  const [isLoadinData, setIsLoadingData] = useState(true); 
  const [loadingMessage, setloadingMessage] = useState("Chargement des données du détecteur..."); 

  useEffect(() => {
    if (dataLean.length > 0) { setCountSerie(dataLean) }
  },[countTimeValue,countSliderValue]);

  useEffect(() => {
    if (dataLean.length > 0) { setSpectrum(dataLean) }
  },[spectrumTimeValue]);

  useEffect(() => {
    loadData();
  },[])

  useEffect(() => {
    if (dataLean.length > 0) {
      setCountSliderValue([dataLean[0][2], dataLean[0][2]+500])
      setCountTimeValue([new Date(dataLean[0][0]),new Date(dataLean[0][1])])
      setSpectrumTimeValue([new Date(dataLean[0][0]),new Date(dataLean[0][1])]) 
    }
  },[dataLean])

  const loadData = async () => {
    await axios.get('https://data-belisama.s3.eu-west-3.amazonaws.com/'+detectorId+'/data_lean.json')
        .then(response => {
            setDataLean(response.data)
            setIsLoadingData(false)
            
          })
        .catch(error => {
          console.log("Détecteur introuvable")
          setloadingMessage("Détecteur introuvable")
        })
  }

  const test = () => {
    console.log(props.search)
  }

  const handleCountSliderChange = (event, newValue) => {
    setCountSliderValue(newValue);
  };

  const handleCountTimeChange = (isEndTime, newValue) => {
    if (isEndTime) { setCountTimeValue([countTimeValue[0],newValue]); }
    else { setCountTimeValue([newValue,countTimeValue[1]]); }
  };

  const handleSpectrumTimeChange = (isEndTime, newValue) => {
    if (isEndTime) { setSpectrumTimeValue([spectrumTimeValue[0],newValue]); }
    else { setSpectrumTimeValue([newValue,spectrumTimeValue[1]]); }
  };

  const createChartData = (xx,yy) => {
    let chartData = []
    for (var i = 0; i<xx.length; i++) {
      chartData.push({x:xx[i],y:yy[i]})
    }
    return chartData
  };

  const loadCountSerie = (dataLean, inf_energy,sup_energy, inf_time, sup_time) => {
    let counts = []
    let times = []
    for (var i = inf_time; i<sup_time;i++) {
      counts.push(dataLean[1][i].slice(inf_energy,sup_energy).reduce((a, b) => a + b, 0))
      times.push(i)
    }
    return [times,counts]
  }

  const setCountSerie = (dataLean) => {
    let start_energy  = Math.trunc((countSliderValue[0]-dataLean[0][2])/dataLean[0][3])
    let end_energy = Math.trunc((countSliderValue[1]-dataLean[0][2])/dataLean[0][3])
    let start_time = (countTimeValue[0].getTime()-dataLean[0][0])/1000/3600
    let end_time = (countTimeValue[1].getTime()+24*3600*1000-dataLean[0][0])/1000/3600
    let data = loadCountSerie(dataLean,start_energy, end_energy,start_time,end_time)
    data = createChartData(data[0],data[1])
    setCountData(data)
  }

  const loadSpectrum = (dataLean,inf_time, sup_time) => {

    let energies = []
    let densities = new Array(dataLean[1][0].length); for (let i=0; i<dataLean[1][0].length; ++i) densities[i] = 0;
    let total_density = 0
    
    for (var j = 0; j<dataLean[1][0].length;j++) {
      energies[j] = dataLean[0][2]+j*20
    }
    for (var i = inf_time; i<=sup_time;i++) {
      for (var j = 0; j<dataLean[1][0].length;j++) {
        densities[j] = densities[j]+dataLean[1][i][j]
        total_density += dataLean[1][i][j]
      }
    }
    for (var j = 0; j<densities.length;j++) {
      densities[j] /= total_density
    }
    return [energies,densities]
  };

  const setSpectrum = (dataLean) => {
    let start_time = (spectrumTimeValue[0].getTime()-dataLean[0][0])/1000/3600
    let end_time = (spectrumTimeValue[1].getTime()-dataLean[0][0])/1000/3600
    let data = loadSpectrum(dataLean,start_time,end_time)
    data = createChartData(data[0],data[1])
    setSpectrumData(data)
  } 

  const diff_date_in_hour = (date1,date2) => {
    var diff_time = date2.getTime()-date1.getTime()
    return diff_time / (1000 * 3600);
  }

  return(
      <div className="data-container">
        { isLoadinData && 
          <h2 style={{margin:"30px"}}>{loadingMessage}</h2>}
        { !isLoadinData && 
          <div>
            
          <div className="count-container">
          
          <h4 style={{marginBottom:"20px"}}>Taux de comptage temporel</h4>
          <h6 style={{marginBottom:"20px"}}>Période</h6>
          <div className="periode-container">
            <p style={{marginRight:"20px"}}>Début</p>
            <DatePicker minDate={new Date(dataLean[0][0])} maxDate={new Date(countTimeValue[1].getTime())} dateFormat="dd/MM/yyyy" selected={countTimeValue[0]} onChange={date => handleCountTimeChange(false,date)} />
            <p style={{marginLeft:"20px",marginRight:"20px"}}>Fin</p>
            <DatePicker minDate={new Date(countTimeValue[0].getTime())} maxDate={new Date(dataLean[0][1])} dateFormat="dd/MM/yyyy" selected={countTimeValue[1]} onChange={date => handleCountTimeChange(true,date)} />
          </div>
          <h6 style={{marginBottom:"20px"}}>Gamme d'énergie</h6>
          <Slider
          min={dataLean[0][2]}
          max={dataLean[0][2]+dataLean[0][3]*dataLean[0][4]}
          step={dataLean[0][3]}
          value={countSliderValue}
          onChange={handleCountSliderChange}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          marks={[{value:dataLean[0][2],label:dataLean[0][2].toString()+" keV"},{value:dataLean[0][2]+dataLean[0][3]*dataLean[0][4],label:(dataLean[0][2]+dataLean[0][3]*dataLean[0][4]).toString()+" keV"}]}
          />

          
          {/* Count Serie */}
          <ResponsiveContainer width='100%' height={400}>
                  
                  <LineChart
                  width={50}
                  height={300}
                  data={countData}
                  margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                  }}
              >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                  dataKey = 'x'
                  domain = {['0', 'maxData']}
                  name = 'Time'
                  type = 'number'
                  label={{ value: 'Date', position: 'insideBottomRight', offset: 0 }} />
                  <YAxis  domain={[0, 'maxData']}/>
                  <Legend/>
                  <Line name="Coûts/s" type="monotone" dataKey="y" stroke="#82ca9d" dot={false} />
              </LineChart>
          </ ResponsiveContainer>
        </div>

        {/* Energy Spectrum */}
        <div className="spectrum-container">
          <h4 style={{marginBottom:"20px"}}>Spectre en énergie</h4>
          <h6 style={{marginBottom:"20px"}}>Période</h6>
          <div className="periode-container">
            <p style={{marginRight:"20px"}}>Début</p>
            <DatePicker minDate={new Date(dataLean[0][0])} maxDate={new Date(spectrumTimeValue[1].getTime())} dateFormat="dd/MM/yyyy" selected={spectrumTimeValue[0]} onChange={date => handleSpectrumTimeChange(false,date)} />
            <p style={{marginLeft:"20px",marginRight:"20px"}}>Fin</p>
            <DatePicker minDate={new Date(spectrumTimeValue[0].getTime())} maxDate={new Date(dataLean[0][1])} dateFormat="dd/MM/yyyy" selected={spectrumTimeValue[1]} onChange={date => handleSpectrumTimeChange(true,date)} />
          </div>
        
        
        
        <ResponsiveContainer width='100%' height={400}>
                
            <LineChart
            width={50}
            height={300}
            data={spectrumData}
            margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
            dataKey = 'x'
            domain = {['0', 'maxData']}
            name = 'Time'
            type = 'number'
            label={{ value: 'Energie (keV)', position: 'insideBottomRight', offset: 0 }} />
            <YAxis  domain={[0, 'maxData']}/>
            <Legend />
            <Line name="Densité d'énergie" type="monotone" dataKey="y" stroke="#82ca9d" dot={false} />
        </LineChart>
        </ ResponsiveContainer>
        </div>

        </div> }
    </div> 
   )

 }

export default DataVisu