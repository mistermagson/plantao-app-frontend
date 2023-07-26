import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import {DataGrid, GridFooter, useGridApiContext, useGridApiEventHandler, useGridApiRef} from '@mui/x-data-grid';
import React, {useState, useEffect} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Alert} from "@mui/material";
import {createTheme} from "@mui/material/styles";
export async function getStaticProps(){

    const data1 = await fetch('http://localhost:3000/api/plantao')
    const plantoes = await data1.json()

    const data2 = await fetch('http://localhost:3000/api/juiz')
    const juizes = await data2.json()

    const data3 = await fetch('http://localhost:3000/api/escala')
    const escalas = await data3.json()

    return{props: {plantoes,juizes,escalas},}
}
function Plantoes({plantoes,juizes,escalas}) {

    const {register} = useForm();
    const onSubmit = () => {};

    const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
    // Constantes para os Autocompletes
    const juizProps = {
        options: juizes,
        getOptionLabel: (option) => option.nome,
    };
    const filterEscalas = (escalas, { inputValue }) => {
        const inputValueLowerCase = inputValue.toLowerCase();
        return escalas.filter(escala =>
            escala.status.toLowerCase() === '0'
        );
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card id="basic-info" sx={{ overflow: "visible" }}>
                <MDBox p={3}>
                    <MDTypography variant="h2">Plantões</MDTypography>
                </MDBox>
                <MDBox p={1} ml={2}>
                    <h5>Selecione o nome do juiz e a escala:</h5>
                </MDBox>
                <MDBox component="form" pb={3} px={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Autocomplete
                                    {...juizProps}
                                    onChange={(event, value) => console.log(value)}
                                    renderInput={(params) => <TextField {...params} label="Nome do Juiz" required />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} >
                                <Autocomplete
                                    options={escalas}
                                    getOptionLabel={escala => escala.descricao}
                                    filterOptions={filterEscalas}
                                    value={opcaoSelecionada} // Define o valor selecionado
                                    onChange={(event, newValue) => setOpcaoSelecionada(newValue)} // Atualiza o estado com a opção selecionada
                                    renderInput={(params) => <TextField {...params} label="Escala" />}
                                />
                            </Grid>
                        </Grid>
                    <MDBox my={2} >
                        <h5>Plantões Disponiveis:</h5>
                    </MDBox>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                        <Grid style={{ flex: '1' }}>

                            {opcaoSelecionada && opcaoSelecionada.datasplantao && (
                            <DataGrid

                            initialState={{pagination: { paginationModel: { pageSize: 5 } },}}
                            pageSizeOptions={[5,10,20]}
                            checkboxSelection
                            sx={{ fontSize: '17px' }}
                            disableColumnMenu

                            onClick={(event, value) => console.log(value)}
                            isRowSelectable={(params) => params.row.status === true}
                            rows={opcaoSelecionada.datasplantao}
                            columns={[{field:'data', headerName:'Datas',flex:'1', sortable:false},{
                                field: 'status', headerName: 'Status', width: 120,
                                renderCell: (params) => (
                                    <span style={{ color: params.value ? 'green' : 'red' }}>
                                      {params.value ? 'Disponível' : 'Ocupado'}
                                    </span>
                                ),
                            },]}

                        />)}
                    </Grid>
                    <Grid item xs={12} sm={6} >

                    </Grid>
                </Grid>
                    </Grid>
                    <Button color="error" size="large" onClick={()=>{console.log("teste")}}>Salvar</Button>
                </MDBox>
            </Card>
        </DashboardLayout>
    );
}
export default Plantoes;