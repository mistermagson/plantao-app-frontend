import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import React, {useState, useEffect, get} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDButton from "../../components/MDButton";
import {setPlantonista, removePlantonista} from "../../utils/plantaoUtils";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import Tooltip from '@mui/material/Tooltip';
import {GridActionsCellItem,} from '@mui/x-data-grid';
import {fetchEscalas} from "../../utils/escalaUtils";
import Minuta from './Minuta';
import Calendario from "./calendario";



function Escalas({data, h}) {

    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [plantaoSelecionado, setPlantaoSelecionado] = useState([]);
    const [headers, setHeaders] = useState(h);
    const [juizes, setJuizes] = useState([]);
    const [escalas, setEscalas] = useState(data);
    const [plantoes, setPlantoes] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        if(escalaSelecionada) {

            const escalaEncontrada = escalas.find(escala => escala.id === escalaSelecionada.id);

            if (escalaEncontrada) {
                setEscalaSelecionada(escalaEncontrada);
                setPlantoes(escalaEncontrada.plantaos.data.map(item => ({ id: item.id, ...item.attributes })));
            }
        }
    }, [escalas, escalaSelecionada]);

    const handleSubmit =  async (event) => {
        event.preventDefault();
        try {
            //EDITAR ALTERAÇÕES DA ESCALA

        } catch (error) {
            console.error(error);
        }finally {
            const atualizaEscalas = await fetchEscalas(headers)
            setEscalas(atualizaEscalas)

        }
    };
    const onChangeEscala = (selected)=>{
        try{
            if(selected){

                const participantesArray = selected.participantes.data.map((item) => ({id: item.id, ...item.attributes,}));
                setJuizes(participantesArray);

                const plantaosArray = selected.plantaos.data.map((item) => ({id: item.id, ...item.attributes,}));
                setPlantoes(plantaosArray);


            }

        }catch (error) {
            setError(error.message);
        }

    }

    const calcularNumeroPlantoesPorJuiz = (juizes, plantoes) => {
        // Mapear os juízes e calcular o número de plantões para cada um
        return juizes.map((juiz) => {
            const juizPlantoes = plantoes.filter((plantao) =>
                plantao.plantonista.data.some((item) => item.id === juiz.id)
            );
            return {
                ...juiz,
                plantoesEscolhidos: juizPlantoes.length,
            };
        });
        return juizesComPlantoesCalculados;
    };

    const juizesComPlantoesCalculados = calcularNumeroPlantoesPorJuiz(juizes, plantoes);
    const showJSON = () => {

        console.log('plantao',plantoes);
        console.log('juiz',juizes);
        console.log('escalas',escalaSelecionada);

    };

    const theme = createTheme({

    });


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox p={3}>
                <MDTypography variant="h2">Dados da Escala</MDTypography>
            </MDBox>
            <Card>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} pb={3} px={3}>
                        <Grid item xs={12} sm={5} sx={{ height: "max-content" }}>
                            <MDBox pl={1} my={2}>
                                <h5>Selecione a escala:</h5>
                            </MDBox>
                            <MDBox >
                                <Grid container spacing={2} xl={12}>
                                    <Grid item xs={12} xl={12} >
                                        <Autocomplete
                                            options={escalas}
                                            getOptionLabel={escala => escala.descricao}
                                            value={escalaSelecionada}
                                            onChange={(event, newValue) =>{
                                                setEscalaSelecionada(newValue);
                                                onChangeEscala(newValue);}}
                                            renderInput={(params) => <TextField {...params} label="Escala" />}
                                        />
                                    </Grid>

                                </Grid>
                            </MDBox>

                        </Grid>
                        <Grid item xs={12} xl={10}>{escalaSelecionada &&(
                            <MDBox mt={2} display="flex" justifyContent="space-between">
                                <div>
                                    <h5>Descrição da escala</h5>
                                    <TextField
                                        id="outlined-descricao-input"
                                        value={escalaSelecionada ? escalaSelecionada.descricao : ""}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="outlined"
                                        style={{ flex: 1, marginRight: '8px' }}
                                    />
                                </div>
                                <div>
                                    <h5>Tipo da escala</h5>
                                    <TextField
                                        id="outlined-tipo-input"
                                        value={escalaSelecionada ? escalaSelecionada.tipo : ""}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="outlined"
                                        style={{ flex: 1, marginRight: '8px' }}
                                    />
                                </div>
                                <div>
                                    <h5>Data de início</h5>
                                    <TextField
                                        id="outlined-inicio-input"
                                        value={escalaSelecionada ? escalaSelecionada.inicio : ""}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="outlined"
                                        style={{ flex: 1, marginRight: '8px' }}
                                    />
                                </div>
                                <div>
                                    <h5>Data de término</h5>
                                    <TextField
                                        id="outlined-fim-input"
                                        value={escalaSelecionada ? escalaSelecionada.fim : ""}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="outlined"
                                        style={{ flex: 1, marginRight: '8px' }}
                                    />
                                </div>
                                <div>
                                    <h5>Escala fechada</h5>
                                    <TextField
                                        id="outlined-fechada-input"
                                        value={escalaSelecionada ? escalaSelecionada.fechada : ""}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="outlined"
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </MDBox>)}
                        </Grid>
                        <Grid item xs={12} xl={7}>{escalaSelecionada &&(
                            <DataGrid
                                editMode="row"
                                disableColumnMenu
                                sx={{fontSize: '18px', fontWeight: 'regular',color:'dark'}}
                                pageSizeOptions={[5, 10, 20]}
                                initialState={{pagination: {paginationModel: {pageSize: 20}},}}
                                rows={juizesComPlantoesCalculados}
                                columns={[
                                    {field: 'id', headerName: 'ID', width: 50},
                                    {field: 'nome', headerName: 'Nome', flex:1, minWidth:150},
                                    {field: 'email', headerName: 'Email',flex:2, minWidth:220},
                                    {field: 'rf', headerName: 'RF',width: 70, editable:true},
                                    {
                                        field: 'plantoesEscolhidos', // Adicione a coluna para exibir o número de plantões escolhidos
                                        headerName: 'N°',
                                        width:50,
                                        renderCell: (params) => {
                                            const numeroPlantoes = params.value;
                                            let textColor = '';


                                            if (numeroPlantoes === 0) {
                                                textColor = '#ff0000'; // Vermelho para 0 plantões
                                            } else if (numeroPlantoes === 1) {
                                                textColor = '#ff9900'; // Laranja para 1 plantão
                                            } else if (numeroPlantoes === 2) {
                                                textColor = '#ffd503'; // Amarelo para 2 plantões
                                            } else if (numeroPlantoes === 3) {
                                                textColor = '#00ff00'; // Verde para 3 plantões
                                            } else if (numeroPlantoes === 4) {
                                                textColor = '#0000ff'; // Azul para 4 plantões
                                            }

                                            return (
                                                <div
                                                    style={{
                                                        color: textColor,
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {numeroPlantoes}
                                                </div>
                                            );
                                        },
                                    },
                                ]}
                                onRowSelectionModelChange={(newRowSelectionModel) => {setRowSelectionModel(newRowSelectionModel);}}
                                disableColumnFilter
                                disableRowSelectionOnClick
                                slots={{toolbar: GridToolbar}}
                                slotProps={{toolbar: {showQuickFilter: true,},}}
                            />)}
                        </Grid>
                        <Grid item xs={12} xl={6}>{escalaSelecionada &&(
                            <Minuta plantoes={plantoes}/>)}
                        </Grid>
                        <Grid container spacing={2}  p={3}>
                            <Grid item xs={12} xl={12}>
                                <ThemeProvider theme={theme}>
                                    {escalaSelecionada && (
                                        <Calendario plantoes={plantoes} />
                                    )}
                                </ThemeProvider>

                            </Grid>
                        </Grid>
                        <MDBox ml={2} p={3}>
                            <MDButton size="small" onClick={showJSON} color="info">Exibir</MDButton>
                        </MDBox>

                    </Grid>
                </form>
            </Card>
        </DashboardLayout>
    );
}

    export async function getServerSideProps() {
        const h = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
        };
        const res = await fetch('http://127.0.0.1:1337/api/escalas?populate=plantaos.plantonista.lotacao.varas,participantes.plantoes,preferencia.juizs', {
            method: 'GET',
            headers: h,
        });
        //const data = await res.json();
        const responseEscala = await res.json();
        const data = responseEscala.data.map((item) => ({id: item.id, ...item.attributes,}));

        return { props: {data, h} };
    }

export default Escalas;