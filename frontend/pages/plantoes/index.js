import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";


import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";

import { DataGrid } from '@mui/x-data-grid';
import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export async function getStaticProps(){
    const data1 = await fetch('http://localhost:3000/api/plantao')
    const plantoes = await data1.json()

    const data2 = await fetch('http://localhost:3000/api/juiz')
    const juizes = await data2.json()

    const data3 = await fetch('http://localhost:3000/api/escala')
    const escalas = await data3.json()



    return{
        props: {plantoes,juizes,escalas},
    }
}
function Plantoes({plantoes,juizes,escalas}) {

    const {register} = useForm();
    const onSubmit = () => {};

    const juizProps = {
        options: juizes,
        getOptionLabel: (option) => option.nome,
    };

    const escalaProps = {
        options: escalas,
        getOptionLabel: (option) => option.descricao,
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card id="basic-info" sx={{ overflow: "visible" }}>
                <MDBox p={3}>
                    <MDTypography variant="h2">Plantões</MDTypography>
                </MDBox>
                <MDBox component="form" pb={3} px={3}>
                    <Grid item xs={12}>
                        <h5>Selecione o nome do juiz e a escala:</h5>
                        <Grid container spacing={2} mt={0.1}>
                            <Grid item xs={12} sm={3.2}>
                                <Autocomplete
                                    {...juizProps}
                                    disablePortal
                                    sx={{ width: 300 }}
                                    size="Big"
                                    renderInput={(params) =>
                                        <TextField {...params} label="Nome do Juiz" required />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={1} >
                                <Autocomplete
                                    {...escalaProps}
                                    disablePortal
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Escala" />}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} my={3} >
                        <Grid mb={1}>
                            <h5>Plantões Disponiveis:</h5>
                        </Grid>
                        <div style={{ width: '400px' }}>
                        <DataGrid
                            rows={plantoes}
                            columns={[{field:'data', headerName:'Datas',flex:'1', sortable:false}]}
                            pageSize={6}
                            pageSizeOptions={[5,10,20]}
                            checkboxSelection
                            sx={{ fontSize: '18px' }}
                            autoHeight
                            disableColumnMenu
                        />
                    </div>
                    </Grid>
                    <Button color="error" size="large" >Salvar</Button>
                </MDBox>
            </Card>
        </DashboardLayout>
    );
}

export default Plantoes;