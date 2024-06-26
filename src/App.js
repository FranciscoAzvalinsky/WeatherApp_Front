import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Weather from './Components/Weather/Weather';

import {URL} from './config'

function App() {

  let location = useLocation();
  let [provincias, setProvincias] = useState([])

  useEffect(() => {
    const fetchProvinces = async () => {
      let {data} = await axios.get(`${URL}province`)
      setProvincias(data)

    }
    fetchProvinces();
  }, [])
  
  return (
    <div className="App">
      <Routes>
        <Route path='/' element = {<Weather provincias={provincias}/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
