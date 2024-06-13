import React from 'react';
import style from './CitySelector.module.css';
import Select, { components, styles } from 'react-select';

const convertToOptions = (options) => {
  return options.filter(Boolean).map((option) => ({
    value: option.props.value,
    label: option.props.children,
  }));
};

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? '#fff' : '#333', // Color de las opciones no seleccionadas
    backgroundColor: state.isSelected ? '#333' : '#fff', // Color de fondo de las opciones no seleccionadas
  }),
};

export default function CitySelector({ setProvince, provinciasOrdered, setCiudad, nombre, municipiosOrdered }) {
  const provinciaOptions = convertToOptions(provinciasOrdered);
  const municipioOptions = convertToOptions(municipiosOrdered);
  return (
    <div className={style.item1}>
      <p>Selecciona una provincia</p>
      <Select
        options={provinciaOptions}
        onChange={(option) => setProvince(option.value)}
        defaultValue={{ value: 'Buenos Aires', label: 'Buenos Aires' }}
        styles={customStyles}
        components={components}
      />
      <hr style={{ opacity: 0 }}></hr>
      <hr style={{ opacity: 0 }}></hr>
      <p>Selecciona una localidad</p>
      <Select
        options={municipioOptions}
        onChange={(option) => setCiudad(option.value)}
        
        styles={customStyles}
        components={components}
      />
    </div>
  );
}


/*import style from './CitySelector.module.css'
import Select from 'react-select';


export default function CitySelector ({setProvince, provinciasOrdered, setCiudad, nombre, municipiosOrdered}) {
    return (
        <div className={style.item1}>
            <p>Selecciona una provincia</p>
            <select onChange={setProvince}>
              {provinciasOrdered}
            </select>
            <hr style={{opacity: 0}}></hr>
            <hr style={{opacity: 0}}></hr>
            <p>Selecciona una localidad</p>
            <select onChange={setCiudad} defaultValue={nombre}>
              {municipiosOrdered}
            </select>
        </div>
    )
    
}*/