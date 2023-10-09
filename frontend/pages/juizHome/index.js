import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import {DataGrid, GridActionsCellItem, GridToolbar} from "@mui/x-data-grid";
import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import MDButton from "../../components/MDButton";
import {fetchEscalas} from "../../utils/escalaUtils";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import Participantes from "../escalas/participantes";
import CalendarioJuiz from "./calendarioJuiz";
import Tooltip from "@mui/material/Tooltip";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EventIcon from '@mui/icons-material/Event';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DefaultProjectCard from "../../examples/Cards/ProjectCards/DefaultProjectCard";

function Escalas({ h }) {
    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [plantaoSelecionado, setPlantaoSelecionado] = useState([]);
    const [headers, setHeaders] = useState(h);
    const [juiz, setJuiz] = useState([]);
    const [escalas, setEscalas] = useState([]);
    const [plantoes, setPlantoes] = useState([]);
    const [idJuiz, setIdJuiz] = useState(64);
    const [idJuizPreferencia, setIdJuizPreferencia] = useState(34);
    const [error, setError] = useState(null);
    const [salvar, setSalvar] = useState(false);
    const [block, setBlock] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    const [rowSelectionModel1, setRowSelectionModel1] = React.useState([]);


    useEffect(() => {

    }, [plantoes,escalas]);

    useEffect(() => {
        fetchJuizes(idJuiz).then(r => console.log('fetch juizes ok'));
        fetchEscalas(idJuiz).then(r => console.log('fetch escalas ok'));

    }, []);

    const fetchJuizes = async (idJuiz) => {
        try {
            const response = await fetch(`http://localhost:1337/api/juizs/${idJuiz}?populate=plantoes.escala`, {
                method: 'GET',
                headers,
            });
            if (!response.ok) {
                throw new Error('Falha ao obter os dados do juiz.');
            }

            const juizData = await response.json();
            const plantaosArray = juizData.data.attributes.plantoes.data.map((item) => ({id: item.id, ...item.attributes,}));
            setPlantoes(plantaosArray);
            setJuiz({id: juizData.data.id, ...juizData.data.attributes,});
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchEscalas = async (idJuiz) => {
        try {
            const response = await fetch(`http://localhost:1337/api/escalas?populate[preferencia][populate][]=juizs&populate[participantes][filters][id][$eq]=${idJuiz}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error('Falha ao obter os dados do juiz.');
            }

            const escalasData = await response.json();
            const editEscala1 = escalasData.data.filter((escala) => escala.attributes.participantes.data.length > 0);
            const editEscala2 = editEscala1.map((escala) => ({id: escala.id, ...escala.attributes, }));
            setEscalas(editEscala2)

        } catch (error) {
            setError(error.message);
        }
    };
    const redirectToMeusPlantoes = (escala) => {
        window.location.href = `/plantoes/?escala=${encodeURIComponent(escala.descricao)}`;
    };

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


/*
    const calcularNumeroPlantoesPorJuiz = (juizes, plantoes) => {
        // Mapear os juízes e calcular o número de plantões para cada um
        return juiz.map((juiz) => {
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
*/

    const isJuizPreferencial = (juizId) => {

        if(juizId.preferencia.data){
            return juizId.preferencia.data.id === idJuiz;
        }
        return false

    };

    const handleClose = () => {
        setSalvar(false);
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

    const findEscala = (idSelected) => {
        // Acessar o valor dentro do array idSelected
        const idDesejado = idSelected[0];

        const escalaEncontrada = escalas.find((escala) => escala.id === idDesejado);

        if (escalaEncontrada) {
            console.log('Escala encontrada:', escalaEncontrada);
            setEscalaSelecionada(escalaEncontrada);
        } else {
            console.log('Escala não encontrada');
        }
    }

    const showJSON = () => {
        //console.log("--------| escalas |--------", escalas);
        /*console.log("--------| juiz |----------", juiz);
        console.log("--------| plantoes |-------", plantoes);*/
        console.log("--------| SELECAO |-------", escalas);


    };

    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }

    return (
        <DashboardLayout>
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
            <MDButton size="small" onClick={()=>showJSON()} color="info">console.log</MDButton>
            <MDBox p={2}>
                <MDTypography variant="h2">Página Inicial</MDTypography>
            </MDBox>
            <Card>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}  px={3} py={1} mb={-6}>
                        <Grid item xs={12} sm={12} xl={12}  sx={{ height: "max-content" }}>
                            <MDBox pl={1} my={2}>
                                <h5 >Minhas escalas:</h5>
                            </MDBox>
                            <MDBox>
                                <Grid container spacing={3} xl={12}>
                                    <Grid item xs={12} xl={8}>
                                        {escalas && (
                                            <DataGrid
                                                editMode="row"
                                                disableColumnMenu
                                                sx={{fontSize: '16px', fontWeight: 'regular', padding: '10px',}}
                                                style={{height: 'flex'}}
                                                rows={escalas}
                                                columns={[{field: 'descricao', headerName: 'Nome', flex: 1},
                                                    {
                                                        field: 'inicio',
                                                        headerName: 'Escolha',
                                                        minWidth: 200,

                                                        renderCell: (params) => (
                                                                <span style={{color: isJuizPreferencial(params.row) ? 'green' : 'red',}}>
                                                                    {isJuizPreferencial(params.row) ?  `Escolha seus Plantões `:'Aguarde sua vez ' }
                                                                </span>)
                                                    },
                                                    {
                                                        field: 'id',
                                                        headerName: ' ',
                                                        minWidth: 50,

                                                        renderCell: (params) => (


                                                            <div>
                                                                <Tooltip
                                                                    title={isJuizPreferencial(params.row) ?'Escolher Plantões' : 'Ver Plantões'}>
                                                                    <GridActionsCellItem
                                                                        icon={isJuizPreferencial(params.row) ? <EventIcon style={{fontSize: 'large'}}/> : <VisibilityIcon style={{fontSize: 'large'}}/>}
                                                                        label={'Definir como Preferencial'}
                                                                        onClick={() => { console.log("--------| params |-------", params.row.descricao,params.row.id, params.row.preferencia.data.id);

                                                                        }}
                                                                        color={isJuizPreferencial(params.row) ? 'success' : 'default'}
                                                                    />
                                                                </Tooltip>
                                                            </div>
                                                        ),
                                                    },]}
                                                onRowSelectionModelChange={(newRowSelectionModel) => {setRowSelectionModel(newRowSelectionModel); findEscala(newRowSelectionModel)}}
                                                rowSelectionModel={rowSelectionModel}
                                                disableColumnFilter
                                                disableColumnSelector
                                                disableDensitySelector
                                                slots={{toolbar: GridToolbar}}
                                                slotProps={{toolbar: {showQuickFilter: true, disableExport: true},}}
                                                hideFooterPagination={true}
                                                disableExport
                                                sortModel={[{field: 'data', sort: 'asc',}]}
                                            />)}
                                    </Grid>
                                    <Grid item xs={12} xl={4}>
                                    {rowSelectionModel.length > 0 &&(
                                        <DefaultProjectCard
                                            title= {"Escala: "+escalaSelecionada.descricao}
                                            description={`Tipo: ${escalaSelecionada.tipo}, 
                Data de Início: ${formatDate(escalaSelecionada.inicio)}, 
                Data de Fim: ${formatDate(escalaSelecionada.fim)}, 
                Preferência: ${escalaSelecionada.preferencia ? escalaSelecionada.preferencia.attributes.nome : 'Nenhum juiz na preferência'}`}
                                            action={{
                                                type: "internal",
                                                route: "/plantoes/meusplantoes",
                                                color: "dark",
                                                label: "escolher plantoes",
                                            }}
                                        />
                                    )}
                                    {rowSelectionModel.length === 0 &&(
                                        <div>
                                            <h5>Selecione uma</h5>
                                            <h5>Escala</h5>
                                        </div>

                                    )}
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} xl={12}>
                            <MDBox pl={1} my={2}>
                                <h5 >Meus plantões:</h5>
                            </MDBox>
                            <MDBox>
                                <Grid container spacing={3} xl={12}>
                                    <Grid item xs={12} xl={5}>
                                <CalendarioJuiz  plantoes={plantoes}/>
                                    </Grid>
                                    <Grid item xs={12} xl={7}>
                                        {escalas && (
                                            <DataGrid
                                                editMode="row"
                                                disableColumnMenu
                                                sx={{fontSize: '16px', fontWeight: 'regular', padding: '10px',border:0}}
                                                rows={plantoes}
                                                columns={[{field: 'data', headerName: 'Data', flex: 1, renderCell: (params) => {
                                                        const dateParts = params.value.split('-');
                                                        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                                                        return <span>{formattedDate}</span>;
                                                    },},{
                                                    field: 'escala.data.attributes.descricao',
                                                    headerName: 'Escala',
                                                    flex: 2,
                                                    valueGetter: (params) => {
                                                        return params.row.escala.data.attributes.descricao;
                                                    },
                                                },
                                                    ]}
                                                onRowSelectionModelChange={(newRowSelectionModel) => {setRowSelectionModel1(newRowSelectionModel); findEscala(newRowSelectionModel)}}
                                                rowSelectionModel={rowSelectionModel1}
                                                disableColumnFilter
                                                disableColumnSelector
                                                disableDensitySelector
                                                hideFooterPagination={true}
                                                hideExport={true}
                                                hideFooterRowCount={true}
                                                hideFooterSelectedRowCount={true}
                                                style={{height: '460px'}}

                                            />)}
                                    </Grid>
                                </Grid>
                            </MDBox>
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
    console.log("1")
    const responseEscala = await res.json();
    const data = responseEscala.data.map((item) => ({ id: item.id, ...item.attributes }));

    return { props: {  h } };
}

export default Escalas;
