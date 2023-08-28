// @mui material components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
// NextJS Material Dashboard 2 PRO components
import MDBox from "/components/MDBox";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import Footer from "/examples/Footer";
import EventCalendar from "/examples/Calendar";
import Header from "/pagesComponents/applications/calendar/components/Header";
import NextEvents from "/pagesComponents/applications/calendar/components/NextEvents";
import ProductivityChart from "/pagesComponents/applications/calendar/components/ProductivityChart";
import calendarEventsData from "/pagesComponents/applications/calendar/data/calendarEventsData";
import React, {useState, useEffect} from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Card from "@mui/material/Card";
import MDButton from "../../../components/MDButton";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";

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

        console.log('PLANTONISTA',juizes);

    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card id="escalas" sx={{ overflow: "visible" }}>
                <MDBox p={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}  xl={12}>
                            <MDBox my={1}>
                                <h5>Juiz :</h5>
                            </MDBox>
                            <Autocomplete
                                options={juizes}
                                getOptionLabel={juiz => juiz.nome }
                                value={juizSelecionado}
                                onChange={(event, newValue) =>setJuizSelecionado(newValue)}
                                renderInput={(params) => <TextField {...params} label="Nome do Juiz" required />}
                            />
                            <MDButton size="small" onClick={showJSON} color="info">Exibir</MDButton>
                        </Grid>
                        <MDBox mb={3}>

                                <DataGrid
                                    checkboxSelection
                                    disableColumnMenu
                                    sx={{fontSize: '18px', fontWeight:'regular', }}
                                    pageSizeOptions={[5,10,20]}
                                    initialState={{pagination: { paginationModel: { pageSize: 20 } },}}
                                    rows={escalas}
                                    columns={[
                                        {field:'data', headerName:'Data',flex:1, sortable:false},
                                        {field:'descricao', headerName:'Escala',flex:1, sortable:false},
                                        {field:'tipo', headerName:'Tipo da Escala',flex:1, sortable:false},]}
                                    onRowSelectionModelChange={(newRowSelectionModel) => {setRowSelectionModel(newRowSelectionModel);}}
                                    rowSelectionModel={rowSelectionModel}
                                />

                        </MDBox>
                    </Grid>
                </MDBox>
            </Card>
            <Footer />
        </DashboardLayout>
    );
}
export default Meusplantoes;