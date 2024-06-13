import style from './Weather.module.css'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Days from '../Days/Days'
import CityToday from '../CityToday/CityToday'
import CitySelector from '../CitySelector/CitySelector'

export default function Weather({ provincias }) {
  let [response, setResponse] = useState()
  let [provincia, setProvincia] = useState('Buenos+Aires')
  let [city, setCity] = useState({name: '', lat: '', lon: '' })
  let [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    const fetchClimateData = async () => {
      try {
        let cityClimate = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,precipitation&minutely_15=temperature_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,precipitation_probability_max&timezone=auto`);
        setResponse(cityClimate.data);
      } catch (error) {
        console.error('Error en la solicitud:', error)
      }
    }
    fetchClimateData();
  }, [city])

  useEffect(() => {
    const fetchProvinceData = async () => {
      try {
        //Se obtiene el id de la provincia deseada
        let prov = provincia.replaceAll('+', ' ')
        let provNameId = await axios.get(`https://apis.datos.gob.ar/georef/api/provincias?nombre=${prov}`)
        let id = provNameId.data.provincias[0].id

        //Se obtienen todos los municipios de esa provincia
        var Municipios = await axios.get(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${id}&campos=id,nombre,centroide&max=1000`)
        let sortedMunicipios = Municipios.data.municipios.sort(function (a, b) {
          if (a.nombre > b.nombre) {
            return 1;
          }
          if (a.nombre < b.nombre) {
            return -1;
          }
          return 0;
        })
        setMunicipios(sortedMunicipios)
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    }
    fetchProvinceData();
  }, [provincia])

  const setCiudad = (e) => {
    const selectedOption = JSON.parse(e)
    const { name, lat, lon } = selectedOption;
    setCity({name, lat, lon });
  };

  const setProvince = (e) => {
    setProvincia(e)
  }

  let maxTemp, minTemp;

  let maxTempArr = []
  let minTempArr = []
  let aux


  let municipiosOrdered = municipios.map((municipio, index) => {

    let name = municipio.nombre.replaceAll(' ', '+')
    let lon = parseFloat(municipio.centroide.lon.toFixed(3));
    let lat = parseFloat(municipio.centroide.lat.toFixed(3));

    let value = JSON.stringify({
      name,
      lat,
      lon
    });

    return (
      <option value={value} key={index} label={name}>
        {municipio.nombre}
      </option>
    )
  })

  provincias.sort(function (a, b) {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });

  let provinciasOrdered = provincias.map((provincia, index) => {

    if (provincia.name === 'Santa Cruz' || provincia.name === 'Santiago del Estero') {
      return
    } else {
      let name = provincia.name.replaceAll(' ', '+')
      return (
        <option value={name} key={index} label={name}>
          {provincia.name}
        </option>
      )
    }
  })



  if (response) {
    minTempArr = response.daily.temperature_2m_min
    maxTempArr = response.daily.temperature_2m_max

    for (let i = 0; i < maxTempArr.length; i++) {
      for (let j = 0; j < maxTempArr.length - 1; j++) {
        if (maxTempArr[j] > maxTempArr[j + 1]) {
          aux = maxTempArr[j + 1]
          maxTempArr[j + 1] = maxTempArr[j]
          maxTempArr[j] = aux
        }
      }
    }

    for (let i = 0; i < minTempArr.length; i++) {
      for (let j = 0; j < minTempArr.length - 1; j++) {
        if (minTempArr[j] > minTempArr[j + 1]) {
          aux = minTempArr[j + 1]
          minTempArr[j + 1] = minTempArr[j]
          minTempArr[j] = aux
        }
      }
    }
    maxTemp = maxTempArr[maxTempArr.length - 1]
    minTemp = minTempArr[0]

    
    return (
      <div className={style.gridContainer}>
        <CitySelector setProvince={setProvince} provinciasOrdered={provinciasOrdered} setCiudad={setCiudad} nombre={municipios[0].nombre} municipiosOrdered={municipiosOrdered}/>
        <CityToday num={response.daily.time[0]} name={city.name.replaceAll('+', ' ')} temp={response.current.temperature_2m} precipitation={response.current.precipitation} minTemp={minTemp} maxTemp={maxTemp} sunrise={response.daily.sunrise[0].slice(11)} sunset={response.daily.sunset[0].slice(11)}/>
        <button className={style.botonPronostico}>
          <strong>Pronóstico de 5 días</strong>
        </button>
        <div className={style.item3}>
          <Days maxPrecipitation={response.daily.precipitation_probability_max[1]} minTemp={response.daily.temperature_2m_min[1]} maxTemp={response.daily.temperature_2m_max[1]} num={response.daily.time[1]} name={city.name.replaceAll('+', ' ')}  sunrise={response.daily.sunrise[1].slice(11)} sunset={response.daily.sunset[1].slice(11)}/>
          <Days maxPrecipitation={response.daily.precipitation_probability_max[2]} minTemp={response.daily.temperature_2m_min[2]} maxTemp={response.daily.temperature_2m_max[2]} num={response.daily.time[2]} name={city.name.replaceAll('+', ' ')}  sunrise={response.daily.sunrise[2].slice(11)} sunset={response.daily.sunset[2].slice(11)}/>
          <Days maxPrecipitation={response.daily.precipitation_probability_max[3]} minTemp={response.daily.temperature_2m_min[3]} maxTemp={response.daily.temperature_2m_max[3]} num={response.daily.time[3]} name={city.name.replaceAll('+', ' ')}  sunrise={response.daily.sunrise[3].slice(11)} sunset={response.daily.sunset[3].slice(11)}/>
          <Days maxPrecipitation={response.daily.precipitation_probability_max[4]} minTemp={response.daily.temperature_2m_min[4]} maxTemp={response.daily.temperature_2m_max[4]} num={response.daily.time[4]} name={city.name.replaceAll('+', ' ')}  sunrise={response.daily.sunrise[4].slice(11)} sunset={response.daily.sunset[4].slice(11)}/>
          <Days maxPrecipitation={response.daily.precipitation_probability_max[5]} minTemp={response.daily.temperature_2m_min[5]} maxTemp={response.daily.temperature_2m_max[5]} num={response.daily.time[5]} name={city.name.replaceAll('+', ' ')}  sunrise={response.daily.sunrise[5].slice(11)} sunset={response.daily.sunset[5].slice(11)}/>
        </div>
      </div>
    )
  }
  else {
    return (
    <div style={{
      position: 'fixed',
      left: '40%',
      top: '30%',
      color: 'white'
    }}>
      <CitySelector setProvince={setProvince} provinciasOrdered={provinciasOrdered} setCiudad={setCiudad} municipiosOrdered={municipiosOrdered}/>
  </div>)
  }
}