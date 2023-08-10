import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import {DataGrid} from '@mui/x-data-grid';
import React, {useState, useEffect} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDButton from "../../components/MDButton";
import {setPlantonista} from "../../utils/plantaoUtils";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const headers= {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
};

function Plantoes() {

    //------- CONSTANTES PARA O DATAGRID----------------------------------------
    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [juizSelecionado, setJuizSelecionado] = useState(null);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    //--------------------------------------------------------------------------

    const [juizes, setJuizes] = useState([]);
    const [escalas, setEscalas] = useState([]);
    const [plantoes, setPlantoes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEscalas = async () => {
            try {

                const response2 = await fetch('http://localhost:1337/api/escalas?populate[plantaos][populate][0]=plantonista&populate[participantes][populate][0]=plantoes', {
                    method: 'GET',
                    headers,
                });

                if (!response2.ok) {
                    throw new Error('Falha ao obter os dados dos juizes.');
                }

                const responseEscala = await response2.json();

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

        fetchEscalas();
        ///NECESSITA DOS PLANTOES FILTRADOS PELA ESCALA SELECIONADA PARA O DATAGRID
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setPlantonista(juizSelecionado.id,rowSelectionModel,headers);
        console.log(juizSelecionado.id,rowSelectionModel,headers);

    };
    const onChangeEscala = (selected)=>{
        try{
            if(selected==null){setJuizSelecionado(null);
            }else{
                const participantesArray = selected.participantes.data.map((item) => ({id: item.id, ...item.attributes,}));
                setJuizes(participantesArray);

                const plantaosArray = selected.plantaos.data.map((item) => ({id: item.id, ...item.attributes,}));
                setPlantoes(plantaosArray);

                setJuizSelecionado(null);
            }

        }catch (error) {
            setError(error.message);
        }

    }
    const showJSON = () => {

        console.log('PLANTONISTA',plantoes);

    };

    const theme = createTheme({
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    cellSelected: {
                        backgroundColor: 'blue', // Cor das células selecionadas
                    },
                    cell: {
                        '&.status-ocupado': {
                            color: 'red', // Cor do texto das células com status igual a "Ocupado"
                        },
                    },
                },
            },
        },
    });

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox p={3}>
                <MDTypography variant="h2">Plantões</MDTypography>
            </MDBox>
            <Card>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={5} sx={{ height: "max-content" }}>
                            <MDBox pl={3} my={2}>
                                <h5>Selecione a escala:</h5>
                            </MDBox>

                            <MDBox pb={3} px={3}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} xl={12} >
                                        <Autocomplete
                                            options={escalas}
                                            getOptionLabel={escala => escala.descricao}
                                            value={escalaSelecionada}
                                            onChange={(event, newValue) =>{setEscalaSelecionada(newValue); onChangeEscala(newValue)}}
                                            renderInput={(params) => <TextField {...params} label="Escala" />}
                                        />
                                    </Grid>

                                    <Grid item xs={12}  xl={12}>
                                        <MDBox my={2}>
                                            <h5>Selecione o nome do juiz :</h5>
                                        </MDBox>
                                        <Autocomplete
                                            options={juizes}
                                            getOptionLabel={juiz => juiz.nome }
                                            value={juizSelecionado}
                                            onChange={(event, newValue) =>setJuizSelecionado(newValue)}
                                            renderInput={(params) => <TextField {...params} label="Nome do Juiz" required />}
                                        />
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} xl={6}>
                            <MDBox mb={3}>
                                <MDBox pt={2} px={2}>{escalaSelecionada && juizSelecionado &&(
                                    <MDTypography variant="h6" >
                                        Selecione os plantões:
                                    </MDTypography>)}
                                </MDBox>
                                <ThemeProvider theme={theme}>
                                <MDBox p={2}>{escalaSelecionada && (
                                    <DataGrid
                                        checkboxSelection
                                        disableColumnMenu
                                        sx={{ fontSize: '17px' }}
                                        pageSizeOptions={[5,10,20]}
                                        initialState={{pagination: { paginationModel: { pageSize: 5 } },}}
                                        rows={plantoes}
                                        columns={[
                                            {field:'data', headerName:'Datas',width: 120, sortable:false},
                                            {field: 'plantonista', headerName: 'Status', width: 300,
                                                renderCell: (params) => (
                                                    console.log(params.value.data[0]),
                                                    <span style={{ color: params.value.data[0] ? 'red': 'green' }}>
                                                            {params.value.data[0] ?  params.value.data[0].attributes.nome:'Disponível' }
                                                        </span>
                                                ),
                                            },]}
                                        disableSelectionOnClick={true} // Desabilita a seleção ao clicar nas células
                                        isRowSelectable={(params) => params.row.plantonista.data[0] ? false : true}
                                        onRowSelectionModelChange={(newRowSelectionModel) => {setRowSelectionModel(newRowSelectionModel);}}
                                        rowSelectionModel={rowSelectionModel}
                                    />)}
                                </MDBox>
                                </ThemeProvider>
                            </MDBox>
                        </Grid>
                        <MDBox ml={2} p={3}>
                            <Button color="error" size="large" type="submit">Salvar</Button>
                            <MDButton size="small" onClick={showJSON} color="info">Exibir</MDButton>
                        </MDBox>

                    </Grid>
                </form>
            </Card>
        </DashboardLayout>
    );
}
export default Plantoes;