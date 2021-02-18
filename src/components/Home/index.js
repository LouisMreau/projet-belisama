import React from 'react'
import './style.css'
import {Link} from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';
import moment from 'moment'
import chartData from '../../resources/data/data_lean.json'
import Slider from '@material-ui/core/Slider';


/**
* @author
* @function Home
**/

const Home = (props) => {
  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return(
      <div className="home-container">
          
        <div className="spectre-container">
          
        Spectre 
        <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        
        />

        <ResponsiveContainer width='100%' height={400}>
                
            <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
            dataKey = 'b'
            domain = {['0', 'maxData']}
            name = 'Time'
            type = 'number'
            label={{ value: 'Energie (keV)', position: 'insideBottomRight', offset: 0 }} />
            <YAxis  domain={[0, 'maxData']}/>
            <Legend />
            <Line name="" type="monotone" dataKey="v" stroke="#82ca9d" dot={false} />
        </LineChart>
        </ ResponsiveContainer>
        </div>
    </div>
   )

 }

export default Home