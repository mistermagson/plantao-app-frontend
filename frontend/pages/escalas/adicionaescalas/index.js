import React from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import DataTable from "/examples/Tables/DataTable";
import {keys} from "regenerator-runtime";
import { useState } from 'react';

// Parses the JSON returned by a network request
const parseJSON = resp => (resp.json ? resp.json() : resp);
// Checks if a network request came back fine, and throws an error if not
const checkStatus = resp => {
  if (resp.status >= 200 && resp.status < 300) {
    return resp;
  }
  return parseJSON(resp).then(resp => {
    throw resp;
  });
};
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer fdf91895e074ebc8f78176d61d74b3c62612c5a3bd80d86d83c2fcd6da7cce2cf0eeae3218760769aa7e2c81cee7cc5b3f27d21575cc5257d8c3f6067dd49e5fbef4d808da83216d3222f5c847029e5ae1e9f3df5221b562ba19cdb2f3fc07abe334b4862313acf441a8905d02af247df8ec219ea674c2f7759c85d614096141'
};


function AdicionaEscala({escalas}) {

 const [modifiedData, setModifiedData] = useState({
    descricao: '',
    inicio: '',
    fim: '',
    tipo:''
  });
  const [errorEscalas, setErrorEscalas] = useState(null);

 const handleChange = ({ target: { name, value } }) => {
    setModifiedData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

   const handleSubmit = async e => {
      e.preventDefault();

      try {
        const response = await fetch('http://localhost:1337/api/escalas', {
          method: 'POST',
          headers,
          body: JSON.stringify({ data: modifiedData }),
        })
          .then(checkStatus)
          .then(parseJSON);
      } catch (error) {
        setErrorEscalas(error);
      }
    };
          return (
                   <DashboardLayout>
                       <DashboardNavbar />
                       <h1>Escalas</h1>
                        <form onSubmit={handleSubmit}>
                               <label>
                                 Descricao:
                                 <input type="text" name="descricao" value={modifiedData.descricao} onChange={handleChange} />
                               </label>
                               <label>
                                 inicio:
                                 <input
                                   type="text"
                                   name="inicio"
                                   value={modifiedData.inicio}
                                   onChange={handleChange}
                                 />
                                 </label>
                                 <label>
                                                                  Fim:
                                                                  <input
                                                                    type="text"
                                                                    name="fim"
                                                                    value={modifiedData.fim}
                                                                    onChange={handleChange}
                                                                  />
                            </label>
                              <label>
                                                               Tipo:
                                                               <input
                                                                 type="text"
                                                                 name="tipo"
                                                                 value={modifiedData.tipo}
                                                                 onChange={handleChange}
                                                               />
                            </label>
  <label>
                                                               Fechada:
                                                                <input
                                                                         type="checkbox"
                                                                         checked="true"
                                                                         onChange={handleChange}
                                                                         name="fechada"
                                                                         id={modifiedData.fechada}
                                                                       />
                            </label>
                               <button type="submit">Submit</button>
                             </form>
                   </DashboardLayout>
                  );
  }
export default AdicionaEscala;