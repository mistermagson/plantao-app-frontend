import React from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import DataTable from "/examples/Tables/DataTable";
import {keys} from "regenerator-runtime";
import MDBox from "/components/MDBox";
import { useState } from 'react';


// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "/components/MDTypography";
// Date picker
import MDDatePicker from "/components/MDDatePicker";
import FormField from "/pagesComponents/pages/account/components/FormField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

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

    const opcoes = [{label:'Local'},{label:'Regional'},{label:'Distribuidor'}];

          return (
               <DashboardLayout>
                   <DashboardNavbar />
                   <Card id="escalas" sx={{ overflow: "visible" }}>
                       <MDBox p={3}>
                           <MDTypography variant="h2">Adicionar Escala</MDTypography>
                       </MDBox>
                       <MDBox component="form" py={3} px={3}>
                           <Grid container spacing={3}>
                               <Grid item xs={12} sm={6}>
                                   <FormField label="Descrição" placeholder="Insira uma descrição" multiline rows={4} variant="outlined"/>
                               </Grid>
                               <Grid item xs={12} sm={6}>
                                   <Autocomplete
                                       disablePortal
                                       options={opcoes}
                                       sx={{ width: 300 }}
                                       renderInput={(params) => <TextField {...params} label="Tipo" />}
                                   />
                               </Grid>
                           </Grid>
                           <Grid container spacing={3} p={3}>
                               <Grid item xs={12} sm={6} >

                               </Grid>
                               <Grid item xs={12} sm={6}>
                               </Grid>
                           </Grid>

                       <Grid mb={3}>
                           <MDDatePicker   label="Controlled picker"
                                           value={modifiedData.inicio}
                                           onChange={(newValue) => setModifiedData(inicio, newValue)} />
                           <MDDatePicker  name="descricao"
                                          value={modifiedData.descricao}
                                          onChange={handleChange} input={{ placeholder: "Data de Fim" }} />
                       </Grid>

                       <label>Fechada:
                            <input
                             type="checkbox"
                             checked="true"
                             onChange={handleChange}
                             name="fechada"
                             id={modifiedData.fechada}
                            />
                       </label>
                       <Button onClick={()=>{console.log(modifiedData.descricao)}}>Salvar</Button>
                       </MDBox>
                   </Card>
               </DashboardLayout>
              );
  }
export default AdicionaEscala;