import logo from './logo.svg';
import './App.css';
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment'

function App() {
  const chartData = [
    { value: 14, time: 1503638297689 },
    { value: 15, time: 1503629962277 },
    { value: 15, time: 1503620882654 },
    { value: 20, time: 1503619184594 },
    { value: 15, time: 1503618308914 },
    { value: 14, time: 1503617297689 },
    { value: 15, time: 1503616962277 },
    { value: 15, time: 1503616882654 },
    { value: 20, time: 1503613184594 },
    { value: 15, time: 1503611308914 },
    
  ]

  return (
    <div className="App">
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
          dataKey = 'time'
          domain = {['0', 'maxData']}
          name = 'Time'
          tickFormatter = {(unixTime) => moment(unixTime).format('HH Do')}
          type = 'number' />
        <YAxis domain={[0, dataMax => (dataMax +5)]}/>
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}

export default App;
