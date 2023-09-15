import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useState, useEffect, get } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDButton from "../../components/MDButton";
import { setPlantonista, removePlantonista } from "../../utils/plantaoUtils";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import Tooltip from "@mui/material/Tooltip";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { fetchEscalas } from "../../utils/escalaUtils";
import Minuta from "./Minuta";
import Calendario from "./calendario";
import Switch from "@mui/material/Switch";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function Escalas({ data, h }) {
    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [plantaoSelecionado, setPlantaoSelecionado] = useState([]);
    const [headers, setHeaders] = useState(h);
    const [juizes, setJuizes] = useState([]);
    const [escalas, setEscalas] = useState(data);
    const [plantoes, setPlantoes] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (escalaSelecionada) {
            const escalaEncontrada = escalas.find(
                (escala) => escala.id === escalaSelecionada.id
            );

            if (escalaEncontrada) {
                setEscalaSelecionada(escalaEncontrada);
                setPlantoes(
                    escalaEncontrada.plantaos.data.map((item) => ({
                        id: item.id,
                        ...item.attributes,
                    }))
                );
            }
        }
    }, [escalas, escalaSelecionada]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            //EDITAR ALTERAÇÕES DA ESCALA
        } catch (error) {
            console.error(error);
        } finally {
            const atualizaEscalas = await fetchEscalas(headers);
            setEscalas(atualizaEscalas);
        }
    };
    const onChangeEscala = (selected) => {
        try {
            if (selected) {
                const participantesArray = selected.participantes.data.map((item) => ({
                    id: item.id,
                    ...item.attributes,
                }));
                setJuizes(participantesArray);

                const plantaosArray = selected.plantaos.data.map((item) => ({
                    id: item.id,
                    ...item.attributes,
                }));
                setPlantoes(plantaosArray);
            }
        } catch (error) {
            setError(error.message);
        }
    };

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

    const juizesComPlantoesCalculados = calcularNumeroPlantoesPorJuiz(
        juizes,
        plantoes
    );
    const showJSON = () => {
        console.log("plantao", plantoes);
        console.log("juiz", juizes);
        console.log("escalas", escalaSelecionada);
    };

    const theme = createTheme();

    const statusEscala = () => {
        const fechada = {
            fechada: `${!escalaSelecionada.fechada}`,
        };
        console.log("REAL", escalaSelecionada.fechada);
        console.log(fechada);

        const setStatus = async () => {
            try {
                const response = await fetch(
                    `http://localhost:1337/api/escalas/${escalaSelecionada.id}`,
                    {
                        method: "PUT",
                        headers,
                        body: JSON.stringify({ data: fechada }),
                    }
                );
            } catch (error) {
                return error;
            } finally {
                const atualizaEscalas = await fetchEscalas(headers);
                setEscalas(atualizaEscalas);
            }
        };

        setStatus();
    };

    const redirectToParticipantes = () => {
        // Redirecionar para a página de participantes
        window.location.href = `http://localhost:3000/escalas/participantes?valor=${escalaSelecionada.descricao}`;
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox p={3}>
                <MDTypography variant="h2">Dados da Escala</MDTypography>
            </MDBox>
            <Card>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} pb={3} px={3}>
                        <Grid item xs={12} sm={5}  sx={{ height: "max-content" }}>
                            <MDBox pl={1} my={2}>
                                <h5 >Selecione a escala:</h5>
                            </MDBox>
                            <MDBox>
                                <Grid container spacing={2} xl={12}>
                                    <Grid item xs={12} xl={12}>
                                        <Autocomplete
                                            options={escalas}
                                            getOptionLabel={(escala) => escala.descricao}
                                            value={escalaSelecionada}
                                            onChange={(event, newValue) => {
                                                setEscalaSelecionada(newValue);
                                                onChangeEscala(newValue);
                                            }}
                                            renderInput={(params) => (<TextField {...params} label="Escala" />)}
                                        />
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Grid>
                        <Grid ml={2} item xs={12} xl={10}>
                            {escalaSelecionada && (
                                <Grid container spacing={2} mb={-2}>
                                    <Grid item xs={12} xl={5}>
                                        <h5 style={{ color: "#344767" }}>Descrição da escala</h5>
                                        <TextField
                                            fullWidth
                                            id="outlined-descricao-input"
                                            value={escalaSelecionada ? escalaSelecionada.descricao : ""}
                                            InputProps={{readOnly: true,}}
                                            variant="outlined"
                                            style={{ flex: 1, marginRight: "8px" }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} xl={5}>
                                        <h5 style={{ color: "#344767" }}>Tipo da escala</h5>
                                        <TextField
                                            fullWidth
                                            id="outlined-tipo-input"
                                            value={escalaSelecionada ? escalaSelecionada.tipo : ""}
                                            InputProps={{readOnly: true,}}
                                            variant="outlined"
                                            style={{ flex: 1, marginRight: "8px" }}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                            {escalaSelecionada && (
                                <Grid container mt={2} spacing={2}>
                                    <Grid item xs={6} xl={4}>
                                        <h5 style={{ color: "#344767" }}>Data de início</h5>
                                        <TextField
                                            fullWidth
                                            id="outlined-inicio-input"
                                            value={escalaSelecionada ? escalaSelecionada.inicio : ""}
                                            InputProps={{readOnly: true,}}
                                            variant="outlined"
                                            style={{ flex: 1, marginRight: "8px" }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} xl={4}>
                                        <h5 style={{ color: "#344767" }}>Data de término</h5>
                                        <TextField
                                            fullWidth
                                            id="outlined-fim-input"
                                            value={escalaSelecionada ? escalaSelecionada.fim : ""}
                                            InputProps={{readOnly: true,}}
                                            variant="outlined"
                                            style={{ flex: 1, marginRight: "8px" }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} xl={4}>
                                        <h5 style={{ color: "#344767" }}>Status</h5>
                                        <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
                                            <h5 style={{color: escalaSelecionada ? escalaSelecionada.fechada ? "red" : "green" : "inherit", marginLeft: "8px"}}>
                                                {escalaSelecionada ? escalaSelecionada.fechada ? "Fechada" : "Aberta" : ""}
                                            </h5>
                                            <Switch
                                                checked={escalaSelecionada ? escalaSelecionada.fechada : false}
                                                color="primary"
                                                inputProps={{ "aria-label": "toggle escala" }}
                                                onChange={() => statusEscala()}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                        <Grid item xs={12} xl={6.5} >
                            {escalaSelecionada && (
                                <Accordion style={{ boxShadow: "none" }}>
                                    <AccordionSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <h5 style={{ color: "#344767" }}>Participantes</h5>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <DataGrid
                                            density="compact"
                                            style={{ minHeight: "300px" }}
                                            editMode="row"
                                            disableColumnMenu
                                            sx={{ fontSize: "18px", fontWeight: "regular", color: "dark" }}
                                            pageSizeOptions={[5, 10, 20]}
                                            initialState={{pagination: { paginationModel: { pageSize: 20 } },}}
                                            rows={juizesComPlantoesCalculados}
                                            columns={[
                                                { field: "rf", headerName: "RF", width: 70, editable: true },
                                                { field: "nome", headerName: "Nome", flex: 1, minWidth: 150 },

                                                { field: "email", headerName: "Email", flex: 2, minWidth: 220 },

                                                {
                                                    field: "plantoesEscolhidos",
                                                    headerName: "N°",
                                                    width: 50,
                                                    renderCell: (params) => {
                                                        return (
                                                            <div style={{ fontWeight: "bold",}}>
                                                                {params.value}
                                                            </div>
                                                        );
                                                    },
                                                },
                                            ]}
                                            onRowSelectionModelChange={(newRowSelectionModel) => {setRowSelectionModel(newRowSelectionModel);}}
                                            disableColumnFilter
                                            disableRowSelectionOnClick
                                            slots={{ toolbar: GridToolbar }}
                                            slotProps={{ toolbar: { showQuickFilter: true } }}
                                        />

                                            <MDBox mt={2} mr={1} display="flex" justifyContent="flex-end">
                                                <MDButton color="dark" type='text' size="small" onClick={redirectToParticipantes}>
                                                    Editar Participantes
                                                </MDButton>

                                            </MDBox>
                                    </AccordionDetails>
                                </Accordion>
                            )}

                        </Grid>
                        <Grid item xs={12} xl={5}>
                            {escalaSelecionada && (
                                <Accordion style={{ boxShadow: "none" }}>
                                    <AccordionSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <h5 style={{ color: "#344767" }}>Calendário</h5>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {plantoes.length <= 0 &&(
                                            <MDBox pb={1.5}>
                                                <MDTypography variant="h6" sx={{fontWeight: 'regular'}} >Não há plantões vinculados a esta escala.</MDTypography>
                                            </MDBox>
                                        )}

                                        <Grid  xs={12} xl={12}>
                                            <Calendario plantoes={plantoes} inicio={escalaSelecionada.inicio}/>
                                            <MDBox mt={2} mr={1} display="flex" justifyContent="flex-end">
                                                <MDButton color="dark" size="small" onClick={redirectToParticipantes}>
                                                    Editar Plantonistas
                                                </MDButton>

                                            </MDBox>
                                        </Grid>


                                    </AccordionDetails>
                                </Accordion>
                            )}
                        </Grid>
                        <Grid item xs={12} xl={11}>
                            {escalaSelecionada && (
                                <Accordion style={{ boxShadow: "none" }}>
                                    <AccordionSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <h5 style={{ color: "#344767" }}>Minuta</h5>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {plantoes.length <= 0 &&(
                                            <MDBox pb={1.5}>
                                                <MDTypography variant="h6" sx={{fontWeight: 'regular'}} >Não há plantões vinculados a esta escala.</MDTypography>
                                            </MDBox>
                                        )}

                                        <Minuta plantoes={plantoes} />
                                    </AccordionDetails>
                                </Accordion>
                            )}
                        </Grid>

                    </Grid>
                </form>
            </Card>
        </DashboardLayout>
    );
}

export async function getServerSideProps() {
    const h = {
        "Content-Type": "application/json",
        Authorization:
            "Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b",
    };
    const res = await fetch(
        "http://127.0.0.1:1337/api/escalas?populate=plantaos.plantonista.lotacao.varas,participantes.plantoes,participantes.lotacao,preferencia.juizs",
        {
            method: "GET",
            headers: h,
        }
    );
    //const data = await res.json();
    const responseEscala = await res.json();
    const data = responseEscala.data.map((item) => ({ id: item.id, ...item.attributes }));

    return { props: { data, h } };
}

export default Escalas;
