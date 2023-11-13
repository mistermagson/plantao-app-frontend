import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import React, {useState, useEffect, get, useRef} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDButton from "../../components/MDButton";
import { setPlantonista, removePlantonista } from "../../utils/plantaoUtils";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import Tooltip from "@mui/material/Tooltip";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {fetchEscalas, removeEscala} from "../../utils/escalaUtils";
import MinutaPage from "./minuta";
import Calendario from "./calendario";
import Switch from "@mui/material/Switch";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Participantes from "./participantes";
import { useRouter } from "next/router";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import {removePlantao} from "../../utils/plantaoUtils";
import MDDatePicker from "../../components/MDDatePicker";
import {adicionaPlantao} from "../../utils/plantaoUtils";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DateField, LocalizationProvider, StaticDatePicker} from "@mui/x-date-pickers";
import ptBR from 'date-fns/locale/pt-BR';
import MDInput from "../../components/MDInput";
import Link from "next/link";
import clipboardCopy from 'clipboard-copy';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


function EscalasPage({ data, h }) {

    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [linhaSelecionada, setLinhaSelecionada] = useState([]);
    const [headers, setHeaders] = useState(h);
    const [juizes, setJuizes] = useState([]);
    const [escalas, setEscalas] = useState(data);
    const [plantoes, setPlantoes] = useState([]);
    const [error, setError] = useState(null);
    const [salvar, setSalvar] = useState(false);
    const [deletarEscala, setDeletarEscala] = useState(false);
    const [deletarPlantao, setDeletarPlantao] = useState(false);
    const [addPlantao, setAddPlantao] = useState(false);
    const [dataPlantao, setDataPlantao] = useState('');
    const [block, setBlock] = useState(null);
    const router = useRouter()
    const [redirectPlantonistas, setRedirectPlantonistas] = useState("/plantoes")
    const [redirectParticipantes, setRedirectParticipantes] = useState("/escalas/participantes")
    const [accordion1Expanded, setAccordion1Expanded] = useState(false);
    const [accordion2Expanded, setAccordion2Expanded] = useState(false);
    const [accordion3Expanded, setAccordion3Expanded] = useState(false);
    const calendarRef = useRef(null);

    const handleGoToDate = () => {
        if (calendarRef.current) {
            // Aqui você pode ajustar a data conforme necessário
            const targetDate = new Date(); // Por padrão, define para a data atual
            calendarRef.current.getApi().gotoDate(targetDate);
        }
    };

    const handleAccordion1Change = (event, isExpanded) => {
        setAccordion1Expanded(isExpanded);
    };

    const handleAccordion2Change = (event, isExpanded) => {
        setAccordion2Expanded(isExpanded);
    };

    const handleAccordion3Change = (event, isExpanded) => {
        setAccordion3Expanded(isExpanded);
    };


    const fetchEscalas = async () => {
        try {
            const response = await fetch('http://10.28.80.30:1337/api/escalas?populate=plantaos.plantonista.lotacao.varas,participantes.plantoes,participantes.lotacao,preferencia.juizs', {
                method: 'GET',
                headers,
            }, {revalidate: 0});

            if (!response.ok) {
                throw new Error('Falha ao obter os dados das escalas.');
            }

            const responseEscala = await response.json();

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
        if (escalaSelecionada) {
            const escalaEncontrada = escalas.find(
                (escala) => escala.id === escalaSelecionada.id
            );

            if (escalaEncontrada) {
                setEscalaSelecionada(escalaEncontrada);
                setPlantoes(escalaEncontrada.plantaos.data.map((item) => ({
                    id: item.id,
                    ...item.attributes,
                })));

                setRedirectParticipantes(`/escalas/participantes?escala=${encodeURIComponent(escalaSelecionada.id)}`)
                setRedirectPlantonistas(`/plantoes?escala=${encodeURIComponent(escalaSelecionada.id)}`)
            }
        }
        if(block === null){

            const params = new URLSearchParams(window.location.search);
            const escalaUrl = params.get('escala');

            if(escalaUrl!==null) {
                const escalaObj = escalas.find((escala) => escala.id == escalaUrl);

                if (escalaObj) {
                    setEscalaSelecionada(escalaObj);
                    onChangeEscala(escalaObj);
                    setBlock('bloqueado');
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [escalas, escalaSelecionada, block, linhaSelecionada, plantoes]);

    useEffect(() => {
        fetchEscalas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [linhaSelecionada,escalaSelecionada]);


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
                handleGoToDate();
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
    const showJSON = () => {
        console.log("plantao data", plantoes[0].data);
    };
    const statusEscala = () => {
        const fechada = {
            fechada: `${!escalaSelecionada.fechada}`,
        };
        console.log("REAL", escalaSelecionada.fechada);
        console.log(fechada);

        const setStatus = async () => {
            try {
                const response = await fetch(
                    `http://10.28.80.30:1337/api/escalas/${escalaSelecionada.id}`,
                    {
                        method: "PUT",
                        headers,
                        body: JSON.stringify({ data: fechada }),
                    }
                );
            } catch (error) {
                return error;
            } finally {
                fetchEscalas();
            }
        };

        setStatus();
    };
    const handleClose = () => {
        setSalvar(false);
        setDeletarEscala(false);
        setDeletarPlantao(false);
        setAddPlantao(false);
    };
    function formatarData(data) {
        if (!data) return '';

        const partes = data.split('-');
        if (partes.length === 3) {
            const [ano, mes, dia] = partes;
            return `${dia}/${mes}/${ano}`;
        }
        return data;
    }
    const deleteEscala = () =>{
        try{
            const idEscala = escalaSelecionada.id
            const plantaoArray = escalaSelecionada.plantaos.data.map((plantao) => plantao.id);
            removeEscala(idEscala,plantaoArray, headers)
            setEscalaSelecionada(null);
            fetchEscalas()
        }
        catch (error) {
            setError(error.message);
        }
    }

    const juizesComPlantoesCalculados = calcularNumeroPlantoesPorJuiz(juizes,plantoes);

    const deletePlantao = () =>{
        try{
            const idPlantao = linhaSelecionada.id
            removePlantao(idPlantao,headers)
            setLinhaSelecionada([]);
            fetchEscalas();
        }
        catch (error) {
            setError(error.message);
        }
    }

    const handleAddPlantao = () => {
        // Lógica para adicionar o plantão
        console.log('Plantão escolhido:', dataPlantao);
        adicionaPlantao(escalaSelecionada.id,dataPlantao,headers)
        setAddPlantao(false);
        setDataPlantao("")
        fetchEscalas()
    };

    return (
        <DashboardLayout>
            <MDButton size="small" onClick={showJSON} lcolor="info">Exibir</MDButton>

            <DashboardNavbar />
            <div>
                <Dialog open={salvar} onClose={handleClose} maxWidth="md" // Define a largura máxima do diálogo
                        fullWidth >
                    <DialogContent>
                        <Participantes></Participantes>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Fechar</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div>
                <Dialog open={deletarEscala} onClose={handleClose}>
                    <DialogTitle>Excluir Escala</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {escalaSelecionada ? (
                                <>Deseja excluir a escala{' '}
                                    <MDTypography component="span" variant="H5" style={{ fontWeight: 'bold' }}>
                                        {escalaSelecionada.descricao}                                    </MDTypography>{' '}
                                    e seus respectivos plantões?</>
                            ) : (
                                'A escala selecionada não está disponível.'
                            )}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <MDButton onClick={() => { deleteEscala();handleClose();}}>Sim</MDButton>
                        <MDButton onClick={handleClose} >Não</MDButton>
                    </DialogActions>
                </Dialog>
            </div>
            <div>
                <Dialog open={deletarPlantao} onClose={handleClose}>
                    <DialogTitle>Excluir Plantao</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {escalaSelecionada ? (
                                <>Deseja excluir o plantão do dia {' '}
                                    <MDTypography component="span" variant="H5" style={{ fontWeight: 'bold' }}>
                                        {formatarData(linhaSelecionada.data)}
                                    </MDTypography>{' ?'}
                                </>
                            ) : (
                                'O plantao selecionada não está disponível.'
                            )}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <MDButton onClick={() => { deletePlantao();handleClose();fetchEscalas()}}>Sim</MDButton>
                        <MDButton onClick={handleClose} >Não</MDButton>
                    </DialogActions>
                </Dialog>
            </div>
            <MDBox p={2}>
                <MDTypography variant="h2">Dados da Escala</MDTypography>
            </MDBox>
            <Card>
                    {/*SELECIONA ESCALA E BOTOES*/}
                    <Grid container spacing={3} pb={3} px={3}>
                        <Grid item xs={10} sm={7} xl={7} >
                            <MDBox pl={1} my={2}>
                                <h5 >Selecione a escala:</h5>
                            </MDBox>
                            <MDBox>
                                <Grid container spacing={2} xl={10}>
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
                        <Grid item xs={2} sm={5}  sx={{ height: "max-content" }}>
                            <MDBox mt={2} mr={1} display="flex" justifyContent="flex-end" >
                                {escalaSelecionada && (<MDButton color="error" size="small"  onClick={() => setDeletarEscala(true)}>deletar</MDButton>)}

                                    <MDButton color="dark" size="small" sx={{marginLeft:"7px"}} onClick={ () => {
                                        router.push("/escalas/adicionaescalas"); setEscalaSelecionada(null)
                                    }}>voltar</MDButton>

                            </MDBox>
                        </Grid>
                    </Grid>

                    {/*RENDERIZA INFORMAÇÕES DA ESCALA*/}
                    {escalaSelecionada && (
                        <Grid container spacing={3} pb={1} px={3}>
                            <Grid item ml={2} xs={12} xl={10}>
                                <Grid container spacing={2} mb={-2}>
                                    <Grid item xs={12} xl={5}>
                                        <h5 style={{ color: "#344767" }}>Descrição da escala:</h5>
                                        <TextField
                                            fullWidth
                                            id="outlined-descricao-input"
                                            value={escalaSelecionada ? escalaSelecionada.descricao : ""}
                                            InputProps={{readOnly: true,}}
                                            variant="standard"
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
                                            variant="standard"
                                            style={{ flex: 1, marginRight: "8px" }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container mt={2} spacing={2}>
                                    <Grid item xs={6} xl={4}>
                                        <h5 style={{ color: "#344767" }}>Data de início</h5>
                                        <TextField
                                            fullWidth
                                            id="outlined-inicio-input"
                                            value={escalaSelecionada ? formatarData(escalaSelecionada.inicio) : ""}
                                            InputProps={{readOnly: true,}}
                                            variant="standard"
                                            style={{ flex: 1, marginRight: "8px" }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} xl={4}>
                                        <h5 style={{ color: "#344767" }}>Data de término</h5>
                                        <TextField
                                            fullWidth
                                            id="outlined-fim-input"
                                            value={escalaSelecionada ? formatarData(escalaSelecionada.fim) : ""}
                                            InputProps={{readOnly: true,}}
                                            variant="standard"
                                            style={{ flex: 1, marginRight: "8px" }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} xl={4}>
                                        <h5 style={{ color: "#344767" }}>Status</h5>
                                        <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
                                            <h5 style={{color: escalaSelecionada ? escalaSelecionada.fechada ? "#f44335" : "#4caf50" : "inherit", marginLeft: "8px"}}>
                                                {escalaSelecionada ? escalaSelecionada.fechada ? "Fechada" : "Aberta" : ""}
                                            </h5>
                                            <Switch
                                                checked={escalaSelecionada ? escalaSelecionada.fechada : false}
                                                inputProps={{ "aria-label": "toggle escala" }}
                                                onChange={() => statusEscala()}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                    {/*RENDERIZA COMPONENTES JUIZES E PLANTOES*/}
                    {escalaSelecionada && (
                        <Grid container spacing={1} py={5} px={3}>

                            {/*RENDERIZA CALENDARIO*/}
                            <Grid item xs={12} xl={12}>
                                <Accordion style={{ boxShadow: 'none' }} expanded={accordion1Expanded} onChange={handleAccordion1Change}>
                                    <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                                        {accordion1Expanded ? (<ExpandLessIcon />) : (<ExpandMoreIcon />)}
                                        <h5 style={{ color: '#344767' }}>Calendário</h5>
                                    </AccordionSummary>
                                    <AccordionDetails>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} xl={7}>
                                                <Calendario plantoes={plantoes} ref={calendarRef}/>
                                            </Grid>
                                            <Grid item xs={12} xl={5}>
                                                <DataGrid
                                                    density="compact"
                                                    style={{ height: '500px' }}
                                                    editMode="row"
                                                    disableColumnMenu
                                                    sx={{ fontSize: '16px', fontWeight: 'regular', color: 'dark',border:0 }}
                                                    pageSizeOptions={[5, 10, 20]}
                                                    initialState={{pagination: { paginationModel: { pageSize: 100 } },}}
                                                    rows={plantoes}
                                                    columns={[
                                                        {field:'data', headerName:'Plantão',width: 120, sortable:false, renderCell: (params) => {
                                                                const dateParts = params.value.split('-');
                                                                const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                                                                return <span>{formattedDate}</span>;
                                                            },},
                                                        {field: 'plantonista', headerName: 'Plantonista', flex:2, minWidth:200, renderCell: (params) => (
                                                                <span style={{color: params.value.data[0] ? 'red' : 'gray',}}>
                                                                    {params.value.data[0] ?  `${params.value.data[0].attributes.nome}`:'- Vazio -' }
                                                                </span>
                                                            ),
                                                        },
                                                        {
                                                            field: 'id', headerName: 'Opções', width: 110, align:"center", renderCell: (params) => (
                                                                <GridActionsCellItem
                                                                    icon={<DeleteIcon color="filled" />}
                                                                    label="Delete"
                                                                    onClick={()=> {setLinhaSelecionada(params.row);setDeletarPlantao(true)}}
                                                                />
                                                            ),
                                                        },]}
                                                    onRowSelectionModelChange={(newRowSelectionModel) => {setRowSelectionModel(newRowSelectionModel);}}
                                                    disableColumnFilter
                                                    disableColumnSelector
                                                    disableDensitySelector
                                                    disableRowSelectionOnClick
                                                    slots={{ toolbar: GridToolbar }}
                                                    slotProps={{ toolbar: { showQuickFilter: true}}}
                                                    sortModel={[{field: 'data', sort: 'asc',}]}
                                                    hideExport={true}
                                                    hideFooterPagination={true}
                                                    hideFooterRowCount={true}
                                                    hideFooterSelectedRowCount={true}
                                                />
                                                <Grid container spacing={1} mt={-6.5} justifyContent="center" alignItems="center" sx={{ border: '1px solid rgb(224, 224, 224)', borderRadius: '5px', padding: '5px', paddingBottom: '10px' }}>
                                                    <Grid item xs={6} md={6} xl={4} mt={0.2}>
                                                        <MDTypography variant="h6">Adicionar novo Plantão:</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} xl={6} >
                                                        <MDInput type="date" value={dataPlantao} size="large" onChange={(prev)=>setDataPlantao(prev.target.value)}/>
                                                        <MDButton color="success" variant="gradient" size="medium" sx={{ marginLeft : '5px' }} onClick={() => handleAddPlantao()}>
                                                            <AddIcon sx={{ margin : '-5px' }} />
                                                        </MDButton>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>

                            {/*RENDERIZA PARTICIPANTES E MINUTA*/}
                            <Grid item xs={12} xl={6} >
                                <Accordion style={{ boxShadow: "none" }} expanded={accordion2Expanded} onChange={handleAccordion2Change}>
                                    <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                                        {accordion2Expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        <h5 style={{ color: "#344767" }}>Participantes</h5>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MDBox mb={2} mr={1} >
                                            <Link href={redirectParticipantes}>
                                                <MDButton color="dark" type='text' size="small" onClick={ () => setEscalaSelecionada(null)}>
                                                    Editar Participantes
                                                </MDButton>
                                            </Link>
                                        </MDBox>
                                        <DataGrid
                                            density="compact"
                                            style={{ height: "500px" }}
                                            editMode="row"
                                            disableColumnMenu
                                            sx={{ fontSize: "16px", fontWeight: "regular", color: "dark" }}
                                            pageSizeOptions={[5, 10, 20]}
                                            initialState={{pagination: { paginationModel: { pageSize: 100 } },}}
                                            rows={juizesComPlantoesCalculados}
                                            columns={[
                                                { field: "rf", headerName: "RF", width: 70, editable: true },
                                                { field: "nome", headerName: "Nome", flex: 2, minWidth: 150 },
                                                {
                                                    field: "plantoesEscolhidos",
                                                    headerName: "Plantoes",
                                                    width: 120,
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

                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid item xs={12} xl={6} >
                                    <Accordion style={{ boxShadow: "none" }} expanded={accordion3Expanded} onChange={handleAccordion3Change}>
                                        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                                            {accordion3Expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            <h5 style={{ color: "#344767" }}>Minuta</h5>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {plantoes?.length <= 0 &&(
                                                <MDBox pb={1.5}>
                                                    <MDTypography variant="h6" sx={{fontWeight: 'regular'}} >Não há plantões vinculados a esta escala.</MDTypography>
                                                </MDBox>
                                            )}
                                            {plantoes.length > 0 &&(
                                            <Grid item xs={12} xl={12} pt={2}>
                                                <MDBox mb={2} mr={1}>
                                                    <Link href={redirectPlantonistas}>
                                                        <MDButton color="dark" size="small"  onClick={ () => setEscalaSelecionada(null)}>
                                                            Editar Plantonistas
                                                        </MDButton>
                                                    </Link>
                                                </MDBox>
                                                <MinutaPage plantoes={plantoes}/>

                                            </Grid>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                            </Grid>
                        </Grid>
                    )}
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
        "http://10.28.80.30:1337/api/escalas?populate=plantaos.plantonista.lotacao.varas,participantes.plantoes,participantes.lotacao,preferencia.juizs",
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

export default EscalasPage;
