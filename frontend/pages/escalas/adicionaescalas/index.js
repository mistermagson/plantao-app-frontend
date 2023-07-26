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
import {FormControlLabel, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";

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

const valorInicial={
    descricao:'',
    tipo:'',
    inicio:'',
    fim:'',
    status:false,

}
function AdicionaEscala({escalas}) {

    const [modifiedData, setModifiedData] = useState(valorInicial);
 /*
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
    };*/

    const handleChange = e =>{
        const {name,value} = e.target
        setModifiedData({
            ...modifiedData,
            [name]: value
        })
    }



    const opEscala = ["Local","Regional","Distribuidor"];
    const [selectedOpEscala, setselectedOpEscala] = useState(null);
    const [escalaInputValue, setEscalaInputValue] = useState("");
    modifiedData.tipo = escalaInputValue;

          return (
               <DashboardLayout>
                   <DashboardNavbar />
                   <Card id="escalas" sx={{ overflow: "visible" }}>
                       <MDBox p={3}>
                           <MDTypography variant="h2">Adicionar Escala</MDTypography>
                       </MDBox>
                       <MDBox p={1} ml={2} mb={1}>
                           <h5>Insira uma descrição e selecione o tipo de escala:</h5>
                       </MDBox>
                       <MDBox component="form" pb={3} px={3}>
                           <Grid container spacing={3}>
                               <Grid item xs={12} sm={4}>
                                   <FormField
                                       label="Descrição"
                                       placeholder="Insira uma descrição"
                                       name="descricao"
                                       variant="outlined"
                                       value={modifiedData.descricao}
                                       onChange={handleChange}
                                       multiline
                                       rows={4}
                                   />
                               </Grid>
                               <Grid item xs={12} sm={2.5}>
                                   <Autocomplete
                                       name="tipoEscala"
                                       options={opEscala}
                                       value={selectedOpEscala}
                                       onChange={(event, newOpEscala) => {
                                           setselectedOpEscala(newOpEscala);
                                       }}
                                       inputValue={escalaInputValue}
                                       onInputChange={(event, newEscalaInputValue) => {
                                           setEscalaInputValue(newEscalaInputValue);
                                       }}
                                       renderInput={(params) => <TextField {...params} label="Tipo" />}
                                   />
                               </Grid>
                           </Grid>

                           <Grid container spacing={1.5}>
                               <Grid item xs={6} sm={2.5}>
                                   <MDBox mt={3} >
                                       <h5>Selecione a data de Inicio:</h5>
                                   </MDBox>
                                   <MDDatePicker

                                       value={modifiedData.inicio}
                                       onChange={(event, value) => console.log(value)}
                                       input={{ placeholder: "Data de Inicio" }}/>
                               </Grid>
                               <Grid item xs={6} sm={2.5} >
                                   <MDBox mt={3} >
                                       <h5>Selecione a data de Fim:</h5>
                                   </MDBox>
                                   <MDDatePicker
                                       name="dataFim"
                                       value={modifiedData.fim}
                                       onChange={(event, value) => console.log(value)}
                                       input={{ placeholder: "Data de Fim" }} />
                               </Grid>
                           </Grid>
                           <FormControlLabel control={<Checkbox defaultChecked />} label="Fechada" />

                           <Button onClick={()=>{console.log(modifiedData.descricao,modifiedData.tipo)}}>Salvar</Button>
                       </MDBox>
                   </Card>
               </DashboardLayout>
              );
  }
export default AdicionaEscala;