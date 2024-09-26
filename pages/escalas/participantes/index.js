import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/components/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/components/examples/Navbars/DashboardNavbar";
import {DataGrid, GridActionsCellItem, GridToolbar} from '@mui/x-data-grid';
import React, {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import {
    removeParticipantesEscala,
    removePreferencial,
    setParticipantesEscala,
    setPreferencia
} from "../../../utils/escalaUtils";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import {removePlantonista} from "../../../utils/plantaoUtils";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {validateAdmin, validateAuthToken} from "../../../utils/sistemaUtils";
import {parseCookies} from "nookies";
import MDButton from "../../../components/MDButton";
import NovoJuizForm from "../novoJuizForm";

const headers = {
    'Content-Type': 'application/json',
   // 'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
};
function Participantes() {

    //------- CONSTANTES PARA O DATAGRID----------------------------------------
    const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    //--------------------------------------------------------------------------
    const [escalas, setEscalas] = useState([]);
    const [varas, setVaras] = useState([]);
    const [juizes, setJuizes] = useState([]);
    const [juizesFiltro, setJuizesFiltro] = useState([]);
    const [adicionados, setAdicionados] = useState([]);
    const [adicionadosFiltro, setAdicionadosFiltro] = useState([]);
    const [error, setError] = useState(null);
    const [jsonData, setJsonData] = useState([]);
    const [juizPreferencialId, setJuizPreferencialId] = useState(null);
    const [block, setBlock] = useState(null);
    const [mostrarApenasAdicionados, setMostrarApenasAdicionados] = useState(false);

    const juizesFiltrados = mostrarApenasAdicionados
        ? adicionados // Se o checkbox estiver marcado, mostre apenas os juízes adicionados
        : juizesFiltro; // Caso contrário, mostre todos os juízes

    const fetchJuizes = async () => {
        try {
            const response1 = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/juizs?populate[plantoes][populate][0]=escala&populate[lotacao]=*&pagination[pageSize]=100&sort=antiguidade:asc`, {
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
                console.log('fetch juizes realizado')

            } else {
                setError('Formato de dados inválido.');
            }

        } catch (error) {
            setError(error.message);
        }
    };

    const fetchEscalas = async () => {
        try {
            const response2 = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas?populate[participantes][populate][]=plantoes&populate[preferencia][populate][]=juizs&populate[participantes][populate][]=lotacao`, {
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
                console.log('fetch escalas realizado')

            } else {
                setError('Formato de dados inválido.');
            }

        } catch (error) {
            setError(error.message);
        }
    };

    const fetchVaras = async () => {
        try {
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/varas\\`);
            const data = await response.json();

            // Mapeia os dados recebidos e extrai apenas o id e descrição
            const varasExtraidas = data.data.map((vara) => ({
                id: vara.id,
                descricao: vara.attributes.descricao,
            }));

            // Atualiza o estado com o array contendo id e descrição
            setVaras(varasExtraidas);
        } catch (error) {
            console.error('Erro ao buscar as varas:', error);
        }
    };

    useEffect( () => {
        fetchEscalas()
        fetchJuizes()
        fetchVaras()
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

            if(escalaUrl!==null && juizes.length > 0) {
                const escalaObj = escalas.find((escala) => escala.id == escalaUrl);
                console.log('OBJETO', escalaObj);

                if (escalaObj !== undefined && escalaObj != null) {
                    console.log('BLOQUEADO');
                    setOpcaoSelecionada(escalaObj);
                    onChangeEscala(escalaObj);
                    setBlock('bloqueado');
                }
            }
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ escalas, opcaoSelecionada, juizes]);


    const onChangeEscala = (selecionada) => {
        try {
            const participantes = selecionada.participantes.data.map((item) => ({id: item.id, ...item.attributes,}));
            setAdicionados(participantes)
            setAdicionadosFiltro(participantes)
            setJuizesFiltro(juizes)
            setJuizes(juizes)

            if (participantes) {
                const juizPreferencial = selecionada.preferencia?.data?.id;
                setJuizPreferencialId(juizPreferencial);
            }
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
        }
        finally {
            console.log('Troca de escalas realizada!');
        }

    }

    const extrairPlantoes = (juizId) => {
        const escalaId = opcaoSelecionada.id;

        const juizSelecionado = juizes.find((juiz) => juiz.id === juizId);

        if (juizSelecionado) {
            const plantoesJuiz = juizSelecionado.plantoes.data;
            const plantoesEscala = plantoesJuiz.filter((plantao) => plantao.attributes.escala.data.id === escalaId);
            return plantoesEscala.map((plantao) => plantao.id);

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
            console.log('teste remover',idJuiz, juizPreferencialId)


            if (idJuiz == juizPreferencialId) {
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

    const handleSubmit = (idSelecao) => {
        try {
            const idJuiz = [idSelecao]
            setParticipantesEscala(opcaoSelecionada.id, idJuiz, headers)

            const novosAdicionados = adicionados.concat(idJuiz.map(id => juizes.find(juiz => juiz.id === id)));
            setAdicionados(novosAdicionados);


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
        console.log('juizes',rowSelectionModel);

    };

    function isJuizAdicionado(juizId) {
        return adicionados.some((juiz) => juiz.id === juizId);
    }

    const checkboxStyle = {
        marginRight: '8px', // Espaçamento à direita do checkbox
        verticalAlign: 'middle', // Alinhar verticalmente com o texto
    };

    const labelStyle = {
        display: 'flex', // Exibir o checkbox e o texto em linha reta
        alignItems: 'center', // Alinhar verticalmente no centro
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pl={2} pb={1}>
                <h1>Lista de Participantes</h1>
                {/*<MDButton size="small" onClick={()=>showJSON()} lcolor="info">Exibir</MDButton>*/}
            </MDBox>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8} xl={8}>
                    <Card>
                <Grid container spacing={2} p={4}>
                    <Grid item xs={12} md={5} xl={5}>
                        <MDBox py={2}>
                            <MDTypography variant="h6">
                                Selecionar escala
                            </MDTypography>
                        </MDBox>
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
                <Grid container spacing={6} p={4}>
                    <Grid>
                        {!opcaoSelecionada && (
                            <MDTypography variant="h6" mx={5} ml={7} mt={5} mb={-5} fontWeight="light">
                                Escala não selecionada
                            </MDTypography>
                        )}
                    </Grid>
                    <Grid item xs={12} md={12} xl={12}>
                        {opcaoSelecionada && (<h5>Listas de Juizes:</h5>)}
                        {opcaoSelecionada && (
                            <div>
                                <Grid item xs={5} md={4} xl={3}>
                                <label style={{...labelStyle, cursor: 'pointer'}}>
                                    <input
                                        type="checkbox"
                                        checked={mostrarApenasAdicionados}
                                        onChange={() => setMostrarApenasAdicionados(!mostrarApenasAdicionados)}
                                        style={{
                                            ...checkboxStyle,
                                            width: '16px', // Largura personalizada
                                            height: '16px', // Altura personalizada
                                        }}
                                    />
                                    <MDTypography variant="h6" sx={{ fontWeight: 'regular'}}>Apenas adicionados</MDTypography >
                                </label>
                                </Grid>
                                <DataGrid
                                    density="compact"
                                    editMode="row"
                                    disableColumnMenu
                                    sx={{fontSize: '16px', fontWeight: 'regular', padding: '10px', }}
                                    style={{height: '500px'}}
                                    pageSizeOptions={[5, 10, 20,50,100]}
                                    initialState={{
                                        pagination: {paginationModel: {pageSize: 100}},
                                        sorting: {sortModel: [{field: 'antiguidade', sort: 'asc'}],},
                                    }}
                                    rows={juizesFiltrados}
                                    columns={[
                                        {
                                            field: 'opcoes',
                                            headerName: 'Opções',
                                            minWidth: 80,
                                            renderCell: (params) => (
                                                <div>
                                                    <Tooltip title={isJuizPreferencial(params.row.id) ? 'Escolhendo...' : 'Definir como Preferencial'}>
                                                        <GridActionsCellItem
                                                            icon={<span className="material-icons-outlined">ads_click</span>}
                                                            label={isJuizPreferencial(params.row.id) ? 'Escolhendo...' : 'Definir como Preferencial'}
                                                            onClick={() => {
                                                                if (!isJuizPreferencial(params.row.id)) {
                                                                    handleAlterarPreferencia(params.row)
                                                                }
                                                            }}
                                                            color={isJuizPreferencial(params.row.id) ? 'error' : 'default'}
                                                        />
                                                    </Tooltip>
                                                    {isJuizAdicionado(params.row.id) ? (
                                                        <Tooltip title="">
                                                            <GridActionsCellItem
                                                                icon={<RemoveCircleOutlineIcon />}
                                                                label="Remover Juiz"
                                                                onClick={() => handleLimparParticipante(params.row.id)}
                                                                color="inherit"
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title="Adicionar Juiz">
                                                            <GridActionsCellItem
                                                                icon={<AddCircleOutlineIcon />}
                                                                label="Adicionar Juiz"
                                                                onClick={() => {
                                                                    console.log('ADD',params.row)
                                                                    handleSubmit(params.row.id)
                                                                }} // Chame a função para adicionar juiz aqui
                                                                color="inherit" // Use 'primary' para destacar a opção de adicionar
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            ),
                                        },
                                        {
                                            field: 'antiguidade',
                                            headerName: 'RF',
                                            flex: 0.05,
                                            renderCell: (params) => (
                                                <div style={{ color: isJuizAdicionado(params.row.id) ? 'green' : 'black' }}>
                                                    {params.row.antiguidade}
                                                </div>
                                            ),
                                        },
                                        {
                                            field: 'nome',
                                            headerName: 'Nome',
                                            flex: 0.7,
                                            minWidth: 150,
                                            renderCell: (params) => (
                                                <div style={{ color: isJuizAdicionado(params.row.id) ? 'green' : 'black' }}>
                                                    {params.row.nome}
                                                </div>
                                            ),
                                        },
                                        {
                                            field: 'lotacao.data.attributes.descricao',
                                            headerName: 'Vara',
                                            flex: 1,
                                            minWidth: 150,
                                            valueGetter: (params) => {
                                                return params.row.lotacao?.data?.attributes?.descricao;
                                            },
                                            renderCell: (params) => (
                                                <div style={{ color: isJuizAdicionado(params.row.id) ? 'green' : 'black' }}>
                                                    {params.row.lotacao?.data?.attributes?.descricao}
                                                </div>
                                            ),
                                        },

                                    ]}
                                    onRowSelectionModelChange={(newRowSelectionModel) => {setRowSelectionModel(newRowSelectionModel);}}
                                    rowSelectionModel={rowSelectionModel}
                                    disableColumnSelector
                                    disableDensitySelector
                                    slots={{toolbar: GridToolbar}}
                                    slotProps={{toolbar: {showQuickFilter: true,},}}

                                />
                            </div>)}


                    </Grid>
                </Grid>
            </Card>
                </Grid>
                <Grid item xs={12} md={4} xl={4} >
                    <Card sx={{overflow: "visible"}}>
                        <NovoJuizForm varas={varas}/>
                    </Card>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}
export async function getServerSideProps(ctx) {
    const validation = validateAuthToken(ctx);

    if (validation) {
        return validation;
    }

    const cookies = parseCookies(ctx);

    /*if (cookies.user_tipo !== 'admin') {
        return {
            redirect: {
                permanent: false,
                destination: '/plantoes',
            },
        };
    }*/

    const admin = validateAdmin(ctx)
    if (admin) {return admin;}

    const escalas = "teste"

    return { props: { data:escalas, validation: 'ok', tipo: ''} }
}
export default Participantes;