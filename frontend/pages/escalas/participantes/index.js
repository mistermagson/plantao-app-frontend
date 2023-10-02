import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import {DataGrid, GridActionsCellItem, GridToolbar} from '@mui/x-data-grid';
import React, {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import {removeParticipantesEscala, removePreferencial, setParticipantesEscala, setPreferencia} from "../../../utils/escalaUtils";
import MDButton from "../../../components/MDButton";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import {removePlantonista} from "../../../utils/plantaoUtils";
import { useLocation } from 'react-router-dom';
import {useRouter} from "next/router";
//------------------------------------------
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Collapse,
    Box,
    Typography,
} from '@mui/material';
import { KeyboardArrowDown as ExpandMoreIcon, KeyboardArrowUp as ExpandLessIcon } from '@mui/icons-material';
import CollapsibleTable from "../participantesTable";
//------------------------------------

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
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
    const [jsonData, setJsonData] = useState([]);
    const [adicionados, setAdicionados] = useState([]);
    const [juizPreferencialId, setJuizPreferencialId] = useState(null);
    const [block, setBlock] = useState(null);

    const fetchJuizes = async () => {
        try {
            const response1 = await fetch('http://localhost:1337/api/juizs?populate[plantoes][populate][0]=escala&populate[lotacao]=*', {
                method: 'GET',
                headers,
            });
            if (!response1.ok) {
                throw new Error('Falha ao obter os dados dos juizes.');
            }

            const responseJuiz = await response1.json();

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
            const response2 = await fetch('http://localhost:1337/api/escalas?populate[participantes][populate][]=plantoes&populate[preferencia][populate][]=juizs&populate[participantes][populate][]=lotacao', {
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

    useEffect( () => {
        fetchEscalas()
        fetchJuizes()
    }, []);

    useEffect(() => {

        if (opcaoSelecionada) {
            const opcaoSelecionadaAtt = escalas.find(escala => escala.id === opcaoSelecionada.id);
            const juizPreferencial = opcaoSelecionada.preferencia?.data?.id;
            setJuizPreferencialId(juizPreferencial);

            if (opcaoSelecionadaAtt) {
                setOpcaoSelecionada(opcaoSelecionadaAtt)
            }
        }

        if(block === null){

            const params = new URLSearchParams(window.location.search);
            const escalaUrl = params.get('escala');
            if(escalaUrl!==null) {
                const escalaObj = escalas.find((escala) => escala.descricao === escalaUrl);
                console.log('OBJETO', escalaObj);

                if (escalaObj) {
                    setOpcaoSelecionada(escalaObj);
                    onChangeEscala(escalaObj);
                    setBlock('bloqueado');
                }
            }
        }

    }, [escalas, opcaoSelecionada]);

    const onChangeEscala = (selecionada) => {
        try {
            const participantes = selecionada.participantes.data.map((item) => ({id: item.id, ...item.attributes,}));
            setAdicionados(participantes)

            if (participantes) {
                const naoParticipantes = juizes.filter(item1 => {
                    return !participantes.some(item2 => item2.id === item1.id);
                });
                setJuizesRestantes(naoParticipantes);
                const juizPreferencial = selecionada.preferencia?.data?.id;
                setJuizPreferencialId(juizPreferencial);
            }
        } catch (error) {
            setError(error.message);
        }

    }

    const extrairPlantoes = (juizId) => {
        const escalaId = opcaoSelecionada.id;

        const juizSelecionado = juizes.find((juiz) => juiz.id === juizId);

        if (juizSelecionado) {
            // Acesse a lista de plantões do juiz
            const plantoesJuiz = juizSelecionado.plantoes.data;

            // Filtre os plantões que pertencem à mesma escala selecionada
            const plantoesEscala = plantoesJuiz.filter((plantao) => plantao.attributes.escala.data.id === escalaId);

            // Extrair os IDs dos plantões em um array
            const idPlantoes = plantoesEscala.map((plantao) => plantao.id);

            // Retornar o array de IDs dos plantões
            return idPlantoes;
        } else {
            console.log('Juiz selecionado não encontrado no array de juízes.');
            return []; // Retorna um array vazio em caso de juiz não encontrado
        }
    };

    const handleLimparParticipante = async (idJuiz) => {
        try {
            const plantaoArray = extrairPlantoes(idJuiz);
            await removePlantonista(idJuiz, plantaoArray,headers )
            await removeParticipantesEscala(idJuiz, opcaoSelecionada.id, headers);

            const novosAdicionados = adicionados.filter(participante => participante.id !== idJuiz);
            setAdicionados(novosAdicionados);

            const juizRestante = juizes.find(juiz => juiz.id === idJuiz);

            if (juizRestante) {
                setJuizesRestantes([...juizesRestantes, juizRestante]);
            }

            if (idJuiz === juizPreferencialId) {
                removePreferencial(idJuiz, opcaoSelecionada.id, headers);
                setJuizPreferencialId(null);
            }
            setRowSelectionModel([]);
            fetchEscalas();
            fetchJuizes();

        } catch (error) {
            console.error(error);
        }
    };

    const handleAlterarPreferencia = async (row) => {
        try {
            const idJuiz = row.id;
            await setPreferencia(opcaoSelecionada.id, idJuiz, headers);
            setJuizPreferencialId(null);

            await fetchEscalas();

        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = () => {
        try {
            setParticipantesEscala(opcaoSelecionada.id, rowSelectionModel, headers)

            const novosAdicionados = adicionados.concat(rowSelectionModel.map(id => juizes.find(juiz => juiz.id === id)));
            setAdicionados(novosAdicionados);

            const novosJuizesRestantes = juizesRestantes.filter(juiz => !rowSelectionModel.includes(juiz.id));
            setJuizesRestantes(novosJuizesRestantes);
            setRowSelectionModel([]);
        } catch (error) {
            console.error(error);
        } finally {
            fetchEscalas();
            fetchJuizes();
        }
    };

    const isJuizPreferencial = (juizId) => {
        return juizId === juizPreferencialId;
    };
    const showJSON = () => {
        console.log('ARRAY PLANTOES',juizes);
    };


    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <MDBox p={2}>
                <h1>Lista de Participantes</h1>
                <MDButton size="small" onClick={showJSON} lcolor="info">Exibir</MDButton>
            </MDBox>
            <Grid container>
                <Grid item xs={12} md={6} xl={12}>
                    <Card sx={{height: "100%"}}>
                        <MDBox pt={2} px={4}>
                            <MDTypography variant="h6">
                                Selecionar escala
                            </MDTypography>
                        </MDBox>
                        <MDBox p={2} pt={0}>
                            <Grid container spacing={4} p={2}>
                                <Grid item xs={12} md={12} xl={6}>
                                    <Autocomplete
                                        options={escalas}
                                        getOptionLabel={escala => escala.descricao}
                                        value={opcaoSelecionada}
                                        onChange={(event, newValue) => {
                                            setOpcaoSelecionada(newValue);
                                            onChangeEscala(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Escala"/>}
                                    />
                                </Grid>

                            </Grid>
                            <Grid container spacing={6} p={2}>
                                <Grid item xs={12} md={12} xl={6}>
                                    {opcaoSelecionada && (<h5>Juizes Adicionados:</h5>)}
                                    {opcaoSelecionada && (
                                        <DataGrid
                                            disableRowSelectionOnClick
                                            disableColumnMenu
                                            sx={{fontSize: '16px', fontWeight: 'regular', padding: '10px'}}
                                            style={{height: '500px'}}
                                            pageSizeOptions={[5, 10, 20,50,100]}
                                            initialState={{
                                                pagination: {paginationModel: {pageSize: 20}},
                                                sorting: {
                                                    sortModel: [{field: 'antiguidade', sort: 'asc'}],
                                                },
                                            }}
                                            rows={adicionados}
                                            columns={[
                                                {field: 'nome', headerName: 'Nomes', flex: 1,minWidth: 150},
                                                {
                                                    field: 'lotacaoDescricao', // Nome da nova coluna
                                                    headerName: 'Descrição da Vara',
                                                    flex: 1,minWidth: 150,
                                                    valueGetter: (params) => {
                                                        return params.row.lotacao.data.attributes.descricao;
                                                    },
                                                },
                                                {field: 'antiguidade', headerName: 'Antiguidade', minWidth: 30},
                                                {
                                                    field: 'id',
                                                    headerName: 'Opções',
                                                    minWidth: 80,
                                                    renderCell: (params) => (
                                                        <div>
                                                            <Tooltip
                                                                title={isJuizPreferencial(params.row.id) ? 'Escolhendo...' : 'Definir como Preferencial'}>
                                                                <GridActionsCellItem
                                                                    icon={<HowToRegIcon style={{fontSize: 'large'}}/>}
                                                                    label={isJuizPreferencial(params.row.id) ? 'Escolhendo...' : 'Definir como Preferencial'}
                                                                    onClick={() => {
                                                                        if (!isJuizPreferencial(params.row.id)) {
                                                                            handleAlterarPreferencia(params.row)
                                                                        }
                                                                    }}
                                                                    color={isJuizPreferencial(params.row.id) ? 'primary' : 'default'}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="Remover Juiz">
                                                                <GridActionsCellItem
                                                                    icon={<RemoveCircleOutlineIcon/>}
                                                                    label="Remover Juiz"
                                                                    onClick={() => handleLimparParticipante(params.row.id)}
                                                                    color="inherit"
                                                                />
                                                            </Tooltip>
                                                        </div>
                                                    ),
                                                },]}
                                            disableColumnFilter
                                            disableColumnSelector
                                            disableDensitySelector
                                            slots={{toolbar: GridToolbar}}
                                            slotProps={{
                                                toolbar: {
                                                    showQuickFilter: true,
                                                },
                                            }}
                                        />)}

                                </Grid>
                                <Grid item xs={12} md={12} xl={6}>
                                    {opcaoSelecionada && (<h5>Juizes Restantes:</h5>)}
                                    {opcaoSelecionada && (
                                        <DataGrid
                                            editMode="row"
                                            checkboxSelection
                                            disableColumnMenu
                                            sx={{fontSize: '16px', fontWeight: 'regular', padding: '10px'}}
                                            style={{height: '500px'}}
                                            pageSizeOptions={[5, 10, 20,50,100]}
                                            initialState={{
                                                pagination: {paginationModel: {pageSize: 20}},
                                                sorting: {sortModel: [{field: 'antiguidade', sort: 'asc'}],},
                                            }}
                                            rows={juizesRestantes}
                                            columns={[{field: 'nome', headerName: 'Nome', flex: 1}, {field: 'antiguidade', headerName: 'Antiguidade', minWidth: 150},]}
                                            onRowSelectionModelChange={(newRowSelectionModel) => {setRowSelectionModel(newRowSelectionModel);}}
                                            rowSelectionModel={rowSelectionModel}
                                            disableColumnFilter
                                            disableColumnSelector
                                            disableDensitySelector
                                            slots={{toolbar: GridToolbar}}
                                            slotProps={{toolbar: {showQuickFilter: true,},}}

                                        />)}

                                    {opcaoSelecionada && (
                                        <MDBox mt={2} mr={1} display="flex" justifyContent="flex-end">
                                            <MDButton color="success" size="small" onClick={() => handleSubmit()}>Adicionar</MDButton>
                                        </MDBox>)}
                                </Grid>
                                {/*<Grid item xs={12} md={12} xl={10}>
                                    {opcaoSelecionada && (<h5>Juizes Restantes:</h5>)//TODO MONTAR TABELA CORRETAMENTE}
                                    }{ opcaoSelecionada && (
                                        <CollapsibleTable data={juizes} /> )}
                                </Grid>*/}
                                <Grid>
                                    {!opcaoSelecionada && (
                                        <MDTypography variant="h6" mx={5} ml={7} mt={-1} mb={-2} fontWeight="light">
                                            Escala não selecionada
                                        </MDTypography>
                                    )}
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Card>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}

export default Participantes;