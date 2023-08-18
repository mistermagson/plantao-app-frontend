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
import ParticipantesList from "../../participanteslist";
import {setParticipantesEscala} from "../../../utils/escalaUtils";
import MDButton from "../../../components/MDButton";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DataTable from "../../../examples/Tables/DataTable";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import Tooltip from '@mui/material/Tooltip';
import { format } from 'date-fns';
import {GridActionsCellItem,} from '@mui/x-data-grid';
import {removePlantonista} from "../../../utils/plantaoUtils";



const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
};
const parseJSON = resp => (resp.json ? resp.json() : resp);
const checkStatus = resp => {
    if (resp.status >= 200 && resp.status < 300) {
        return resp;
    }
    return parseJSON(resp).then(resp => {
        throw resp;
    });
};
function Participantes() {

    //------- CONSTANTES PARA O DATAGRID----------------------------------------
    const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    //--------------------------------------------------------------------------
    const [escalas, setEscalas] = useState([]);
    const [juizes, setJuizes] = useState([]);
    const [juizesRestantes, setJuizesRestantes] = useState([]);
    const [error, setError] = useState(null);
    const [jsonData, setJsonData]= useState([]);

    const [newJuizes, setNewJuizes] = useState([]);

    const fetchJuizes = async () => {
        try {
            const response1 = await fetch('http://localhost:1337/api/juizs?populate[plantoes][populate][0]=escala', {
                method: 'GET',
                headers,
            });
            if (!response1.ok) {
                throw new Error('Falha ao obter os dados dos juizes.');
            }

            const responseJuiz = await response1.json();
            console.log('')
            console.log('------------------------------------------------')
            console.log('-------| Constante responseJuiz:', responseJuiz);

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
    const fetchEscalas = async () => {
        try {

            const response2 = await fetch('http://localhost:1337/api/escalas?populate[participantes][populate][0]=plantoes', {
                method: 'GET',
                headers,
            });

            if (!response2.ok) {
                throw new Error('Falha ao obter os dados dos juizes.');
            }

            const responseEscala = await response2.json();
            setJsonData(responseEscala);

            if (Array.isArray(responseEscala.data)) {
                const escalasData = responseEscala.data.map((item) => ({id: item.id, ...item.attributes,}));
                setEscalas(escalasData);

            } else {
                setError('Formato de dados inválido.');
            }

        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchEscalas();
        fetchJuizes();
    }, []);

    const theme = createTheme({});

    const onChangeEscala = (selected)=>{
        try{
            const participantesArray = selected.participantes.data.map((item) => ({id: item.id, ...item.attributes,}));
            setNewJuizes(participantesArray)

            if(participantesArray) {
                const juizFiltrado = juizes.filter(item1 => {
                    return !participantesArray.some(item2 => item2.id === item1.id);
                });
                setJuizesRestantes(juizFiltrado);
            }
        }catch (error) {
            setError(error.message);
        }

    }

    const handleLimparPlantonista = async(row) => {
        try {
            const idJuiz = row.plantonista.data[0].id;
            console.log("Limpando plantonista do plantão do dia:", row.data);
            await removePlantonista(idJuiz, row.id, headers);
            setRowSelectionModel([]);
            await fetchEscalas();

        } catch (error) {
            console.error(error);
        }
    };



    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox p={2}>
                <h1>Lista de Participantes</h1>
            </MDBox>
            <Card sx={{ height: "100%" }}>
                <MDBox pt={2} px={2}>
                    <MDTypography variant="h6" >
                        Selecionar juizes participantes
                    </MDTypography>
                </MDBox>
                <MDBox p={2}>
                    <Grid item xs={12} md={6} xl={4}  sx={{ padding: '8px' }} >
                        <Autocomplete
                            options={escalas}
                            getOptionLabel={escala => escala.descricao}
                            value={opcaoSelecionada}
                            onChange={(event, newValue) =>{
                                setOpcaoSelecionada(newValue);
                                onChangeEscala(newValue);}}
                            renderInput={(params) => <TextField {...params} label="Escala" />}
                        />
                    </Grid>
                    <Grid container spacing={4} p={2} >
                        <Grid item xs={12} md={6} xl={6}  >
                            {opcaoSelecionada && (<h5>Adicionados:</h5>)}
                            {opcaoSelecionada && (
                                <DataGrid
                                    disableColumnMenu
                                    sx={{fontSize: '18px', fontWeight:'regular',padding: '10px'}}
                                    pageSizeOptions={[5,10,20]}
                                    initialState={{pagination:{paginationModel:{pageSize:5}},}}
                                    rows={newJuizes}
                                    columns={[{field:'nome',headerName:'Juizes Adicionados', flex:'1'},{
                                        field: 'id',
                                        headerName: 'Opções',
                                        width: 120,
                                        renderCell: (params) => (
                                            <Tooltip title="Limpar o plantonista">
                                                <GridActionsCellItem
                                                    icon={<CleaningServicesIcon />}
                                                    label="Limpar Plantonista"
                                                    onClick={() => handleLimparPlantonista(params.row)}
                                                    color="inherit"
                                                />
                                            </Tooltip>
                                        ),
                                    },]}
                                />)}

                        </Grid>
                        <Grid item xs={12} md={6} xl={6} >
                            {opcaoSelecionada && (<h5>Restantes:</h5>)}
                            {opcaoSelecionada && (
                                <DataGrid
                                    checkboxSelection
                                    disableColumnMenu
                                    sx={{fontSize: '18px', fontWeight:'regular', padding:'10px'}}
                                    pageSizeOptions={[5,10,20]}
                                    initialState={{pagination:{paginationModel:{pageSize:5}},}}
                                    rows={juizesRestantes}
                                    columns={[{field:'nome',headerName:'Juiz', flex:'1'},]}
                                    onRowSelectionModelChange={(newRowSelectionModel) => {
                                        setRowSelectionModel(newRowSelectionModel);
                                    }}
                                    rowSelectionModel={rowSelectionModel}
                                    /*isRowSelectable={(params) => console.log('PARAMS', params)}*/

                                />)}

                        </Grid>
                        <Grid>
                            {!opcaoSelecionada && (
                                <MDTypography variant="h6" mx={6} mt={2} mb={-3} fontWeight="light">
                                    Escala não selecionada
                                </MDTypography>
                            )}
                        </Grid>
                    </Grid>
                    <Grid my={2}>
                        {opcaoSelecionada && (<MDButton size="medium" lcolor="error" onClick={() => console.log(opcaoSelecionada,escalas,newJuizes, juizes)}>Imprimir Selecionados</MDButton>)}
                        {opcaoSelecionada && (<MDButton  size="small" color="success" onClick={() => setParticipantesEscala(opcaoSelecionada.id,rowSelectionModel,headers)}>Salvar</MDButton>)}
                    </Grid>
                </MDBox>
            </Card>
        </DashboardLayout>
    );
}

export default Participantes;
