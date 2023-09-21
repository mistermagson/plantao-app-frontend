// @mui material components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MDBox from "/components/MDBox";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import Footer from "/examples/Footer";
import React, {useEffect, useState} from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Card from "@mui/material/Card";
import MDButton from "../../../components/MDButton";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import MDTypography from "../../../components/MDTypography";
import CollapseTable from "../tabela";

const headers= {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
};

function Meusplantoes() {

    const [juizes, setJuizes] = useState([]);
    const [escalas, setEscalas] = useState([]);
    const [plantoes, setPlantoes] = useState([]);
    const [error, setError] = useState(null);
    const [juizSelecionado, setJuizSelecionado] = useState(null);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

    useEffect(() => {
        const fetchEscalas = async () => {
            try {

                const response = await fetch('http://localhost:1337/api/juizs?populate[plantoes][populate][0]=escala', {
                    method: 'GET',
                    headers,
                });


                if (!response.ok) {
                    throw new Error('Falha ao obter os dados dos juizes.');
                }

                const responseJuiz = await response.json();
                console.log('response',responseJuiz);
                if (Array.isArray(responseJuiz.data)) {
                    const juizesData = responseJuiz.data.map((item) => ({id: item.id, ...item.attributes,}));
                    setJuizes(juizesData);


                } else {
                    setError('Formato de dados inválido.');
                }

            } catch (error) {
                setError(error.message);
            }
        };

        fetchEscalas();
    }, []);
    const showJSON = () => {
        console.log('PLANTONISTA',plantoes);
        console.log(escalas);
    };
    const rows = plantoes.map((plantao) => ({
        id: plantao.id,
        data: plantao.data,
        descricao: plantao.escala.data.attributes.descricao,
        tipo: plantao.escala.data.attributes.tipo,
    }));
    const setTabela= (dadosJuiz)=>{
        if(dadosJuiz) {
            setPlantoes(dadosJuiz.plantoes.data.map(item => ({ id: item.id, ...item.attributes })))
        }
    }


    plantoes.forEach((item) => {
        const escalaId = item.escala.data.id;
        const escalaIndex = escalas.findIndex((escala) => escala.id === escalaId);

        if (escalaIndex === -1) {
            escalas.push({
                id: escalaId,
                ...item.escala.data.attributes,
                plantoes: [item],
            });
        } else {
            escalas[escalaIndex].plantoes.push(item);
        }
    });



    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid container spacing={2}>
                <Grid item xs={12} xl={12}>
                    <MDBox p={2}>
                        <MDTypography variant="h2">Meus plantões</MDTypography>
                    </MDBox>
                    <Card  sx={{ overflow: "visible" }}>
                        <MDBox p={3}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={8}  xl={12}>
                                    <MDBox my={1}>
                                        <h5>Selecione um Juiz :</h5>
                                    </MDBox>
                                    <Grid item xs={12} md={8}  xl={6}>
                                        <Autocomplete
                                            options={juizes}
                                            getOptionLabel={juiz => juiz.nome }
                                            value={juizSelecionado}
                                            onChange={(event, newValue) =>{setJuizSelecionado(newValue);setTabela(newValue);}}
                                            renderInput={(params) => <TextField {...params} label="Nome do Juiz" required />}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={12} xl={6} >
                                    {juizSelecionado && (
                                        /*<DataGrid
                                            style={{ minHeight: '300px' }}
                                            disableColumnMenu
                                            sx={{fontSize: '18px', fontWeight:'regular', padding:'10px'}}
                                            pageSizeOptions={[5,10,20]}
                                            initialState={{pagination:{paginationModel:{pageSize:5}},}}
                                            rows={rows}
                                            columns={[{ field: 'data', headerName: 'Data do Plantão', flex:1,
                                                renderCell: (params) => {
                                                    const dateParts = params.value.split('-');
                                                    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                                                    return <span>{formattedDate}</span>;
                                                }, },
                                                { field: 'descricao', headerName: 'Descrição da Escala', flex:1 },
                                                { field: 'tipo', headerName: 'Tipo da Escala', flex:1 },]}
                                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                                setRowSelectionModel(newRowSelectionModel);
                                            }}
                                            rowSelectionModel={rowSelectionModel}
                                            disableColumnFilter
                                            disableColumnSelector
                                            disableDensitySelector
                                            slots={{ toolbar: GridToolbar }}
                                            slotProps={{
                                                toolbar: {
                                                    showQuickFilter: true,
                                                },
                                            }}

                                        />*/
                                        /*<CollapseTable plantoes={plantoes} />*/
                                        <DataGrid
                                            checkboxSelection
                                            style={{ minHeight: '300px' }}
                                            disableColumnMenu
                                            sx={{fontSize: '18px', fontWeight:'regular', padding:'10px'}}
                                            pageSizeOptions={[5,10,20]}
                                            initialState={{pagination:{paginationModel:{pageSize:5}},}}
                                            rows={escalas}
                                            columns={[
                                                { field: 'descricao', headerName: 'Descrição da Escala', flex:1 },
                                                { field: 'tipo', headerName: 'Tipo da Escala', flex:1 },]}
                                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                                setRowSelectionModel(newRowSelectionModel);
                                            }}
                                            rowSelectionModel={rowSelectionModel}
                                            disableColumnFilter
                                            disableColumnSelector
                                            disableDensitySelector
                                            slots={{ toolbar: GridToolbar }}
                                            slotProps={{
                                                toolbar: {
                                                    showQuickFilter: true,
                                                },
                                            }}/>
                                        )}
                                    <span style={{color:'red', fontSize:'13px'}}>
                                        alterar tabela, permitir que ele acesse as escalas que participa, indicar se ele precisa escolher algum plantao
                                    </span>
                                </Grid>
                            </Grid>
                        </MDBox>
                        <MDBox p={3}>
                            <MDButton size="small" onClick={showJSON} color="error">Exibir</MDButton>
                        </MDBox>
                    </Card>
                </Grid>
                <Grid item xs={12} xl={12}>
                    <Card id="escalas" sx={{overflow: "visible"}}></Card>

                </Grid>
            </Grid>
            <Footer />
        </DashboardLayout>
    );
}
export default Meusplantoes;