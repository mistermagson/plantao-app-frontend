import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import {DataGrid} from '@mui/x-data-grid';
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
import Calendar from 'react-calendar'; // Importe a biblioteca do calendário



function Escalas({data, h}) {

    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [juizSelecionado, setJuizSelecionado] = useState(null);
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
            setPlantonista(juizSelecionado.id, plantaoSelecionado, headers)

        } catch (error) {
            console.error(error);
        }finally {
            setPlantaoSelecionado([])
            const atualizaEscalas = await fetchEscalas(headers)
            setEscalas(atualizaEscalas)

        }
    };
    const onChangeEscala = (selected)=>{
        try{
            if(!selected){
                setJuizSelecionado(null);
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

        console.log('plantao',plantoes);
        console.log('juiz',juizSelecionado);
        console.log('escalas',escalaSelecionada);

    };

    const theme = createTheme({});

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
                        <Grid item xs={12} xl={10}>
                            <MDBox mt={2} display="flex" justifyContent="space-between">
                                <div>
                                    <h6>Descrição da escala</h6>
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
                                    <h6>Tipo da escala</h6>
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
                                    <h6>Data de início</h6>
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
                                    <h6>Data de término</h6>
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
                                    <h6>Escala fechada</h6>
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
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} xl={12}>{escalaSelecionada &&(
                            <Minuta plantoes={plantoes}/>)}
                        </Grid>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>

                                <Calendar

                                />

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