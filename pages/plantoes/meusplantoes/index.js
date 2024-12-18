import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "../../../components/MDBox";

import {DataGrid} from '@mui/x-data-grid';
import React, {useState, useEffect, get} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDButton from "../../../components/MDButton";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import {GridActionsCellItem,} from '@mui/x-data-grid';
import {fetchEscalas} from "../../../utils/escalaUtils";
import Calendario from "../../escalas/calendario";
import {passaPreferencia} from "../../../utils/escalaUtils";
import {setPlantonista, removePlantonista} from "../../../utils/plantaoUtils";
import MDTypography from "../../../components/MDTypography";
import DashboardLayout from "../../../components/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../components/examples/Navbars/DashboardNavbar";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {es} from "date-fns/locale";
import {validateAuthToken} from "../../../utils/sistemaUtils";

function Plantoes({data, h}) {

    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [escalasJuiz, setEscalaJuiz] = useState(null);
    const [juizSelecionado, setJuizSelecionado] = useState(null);
    const [plantaoSelecionado, setPlantaoSelecionado] = useState([]);
    const [headers, setHeaders] = useState(h);
    const [juizes, setJuizes] = useState([]);
    const [escalas, setEscalas] = useState(data);
    const [plantoes, setPlantoes] = useState([]);
    const [error, setError] = useState(null);
    const [block, setBlock] = useState(null);
    const [preferenciaJuizId, setPreferenciaJuizId] = useState(null);
    const [juizUrlId, setJuizUrlId] = useState(84);
    const [passar, setPassar] = useState(false);
    const [sair, setSair] = useState(false);
    const [rowData, setRowData] = useState(null);


    useEffect(() => {
        //IRA RODAR UMA UNICA VEZ BUSCANDO NOME DA ESCALA NA URL
        if(block === null){

            const params = new URLSearchParams(window.location.search);
            const escalaUrl = params.get('escala');

            if(escalaUrl!==null) {
                const escalaObj = escalas.find((escala) => escala.descricao === escalaUrl);
                console.log('OBJETO', escalaObj);

                if (escalaObj) {
                    setEscalaSelecionada(escalaObj);
                    onChangeEscala(escalaObj);
                    setBlock('bloqueado');
                }
            }

            const juizId = juizUrlId; // Substitua pelo ID do juiz que você deseja filtrar
            const escalasDoJuiz = filtrarEscalasPorJuiz(juizId, escalas);
            setEscalas(escalasDoJuiz);
            setBlock('bloqueado');
        }

        if(escalaSelecionada) {

            const escalaEncontrada = escalas.find(escala => escala.id === escalaSelecionada.id);

            if (escalaEncontrada) {
                setEscalaSelecionada(escalaEncontrada);
                setPlantoes(escalaEncontrada.plantaos.data.map(item => ({ id: item.id, ...item.attributes })));
                if(escalaSelecionada.preferencia.data){
                    setPreferenciaJuizId(escalaSelecionada.preferencia.data.id);
                }
                setJuizSelecionado(juizes.find((juiz) => juiz.id === juizUrlId));
            }
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [escalas, plantoes]);


    const handleSubmit =  async (event) => {
        event.preventDefault();
        try {
            setPlantonista(juizSelecionado.id, plantaoSelecionado, headers)
            console.log('1- ',plantaoSelecionado)
            setPlantaoSelecionado([])
            console.log('2- ',plantaoSelecionado)
        } catch (error) {
            console.error(error);
        }
        finally {
            const escalasAtualizadas = await fetchEscalas(headers)
            setEscalaJuiz(filtrarEscalasPorJuiz(juizUrlId, escalasAtualizadas));
            setEscalas(escalasDoJuiz);
            console.log('TUDO CERTO')

        }
    };

    const onChangeEscala = (selected)=>{
        setEscalaSelecionada(selected);
        try{
            if(!selected){
                setJuizSelecionado('AAAAAAAAAAAAAA');
            }else{
                const participantesArray = selected.participantes.data.map((item) => ({id: item.id, ...item.attributes,}));
                setJuizes(participantesArray);

                const plantaosArray = selected.plantaos.data.map((item) => ({id: item.id, ...item.attributes,}));
                setPlantoes(plantaosArray);
            }

        }catch (error) {
            setError(error.message);
        }

    }
    const showJSON = () => {

        console.log("plantoes",plantoes);
        //console.log('juizes',juizes);
        //onsole.log("J SELECIONADOs",juizSelecionado);
        //console.log("prefrencial",preferenciaJuizId);


    };
    const handleLimparPlantonista = async(row) => {
        try {
            const idJuiz = row.plantonista.data[0].id;
            console.log(idJuiz, row.id, headers)
            await removePlantonista(idJuiz, row.id, headers);
            setPlantaoSelecionado([]);

        } catch (error) {
            console.error(error);
        }finally {
            const escalasAtualizadas = await fetchEscalas(headers)
            const escalasDoJuiz = filtrarEscalasPorJuiz(juizUrlId, escalasAtualizadas);
            setEscalas(escalasDoJuiz);
            console.log('TUDO CERTO')

        }
    };

    const passaEscolha = async()=>{
        try{
            passaPreferencia(escalaSelecionada,headers);

        } catch (error) {
            console.error(error);
        }finally {
            const escalasAtualizadas = await fetchEscalas(headers)
            const escalasDoJuiz = filtrarEscalasPorJuiz(juizUrlId, escalasAtualizadas);
            setEscalas(escalasDoJuiz);
        }
    }

    function filtrarEscalasPorJuiz(juizId, escalas) {
        //---- EXIBE APENAS AS ESCALAS QUE O JUIZ FAZ PARTE
        const escalasFiltradas = escalas.filter((escala) =>
            escala.participantes.data.some((participante) => participante.id === juizId)
        );
        console.log("ESCALAS", escalas);
        return escalasFiltradas;
    }

    const handleClose = () => {
        setPassar(false);
        setSair(false);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <div>
                <Dialog open={passar} onClose={handleClose}>
                    <DialogTitle>Passar a Vez</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Você tem certeza que deseja encerrar sua escolha?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {passaEscolha();handleClose();}}>Sim</Button>
                        <Button onClick={handleClose}>Não</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div>
                <Dialog open={sair} onClose={handleClose}>
                <DialogTitle>Sair do Plantão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Você tem certeza que deseja sair do plantão? Só poderá escolhê-lo novamente quando chegar a sua vez.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { handleLimparPlantonista(rowData); handleClose(); }}>Sim</Button>
                    <Button onClick={handleClose}>Não</Button>
                </DialogActions>
            </Dialog>
            </div>
            <MDBox p={2}>
                <MDTypography variant="h2">Meus Plantões</MDTypography>
            </MDBox>
            <Card>
                <form onSubmit={handleSubmit}>
                    <Grid container >
                        <Grid item xs={12} xl={12} >
                            <Grid container spacing={7}  pl={3} >
                                <Grid item xs={9} xl={5}>
                                    <MDBox  my={2}>
                                        <h5>Selecione a escala:</h5>
                                    </MDBox>
                                    <Autocomplete
                                        options={escalas}
                                        getOptionLabel={escala => escala.descricao}
                                        value={escalaSelecionada}
                                        onChange={(event, newValue) =>{
                                            onChangeEscala(newValue);}}
                                        renderInput={(params) => <TextField {...params} label="Escala" />}
                                    />
                                </Grid>{/* AUTOCOMPLETE ESCALA*/}
                                <Grid item xs={9} xl={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    {juizSelecionado?.id !== preferenciaJuizId && escalaSelecionada &&(
                                        <h6 style={{ color: '#f44335' }}>Ainda não é sua vez de escolher os plantões.</h6>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} xl={6} pt={2} >
                            <MDBox px={2}>
                                <MDBox p={2}  >
                                    {escalaSelecionada && (<>
                                        <MDTypography variant="h6" style={{ marginBottom: '-10px' }}>Plantões:</MDTypography>
                                        {escalaSelecionada.fechada && (
                                            <span style={{ color: 'red', fontSize: '14px'}}>
                                              Escala fechada, não é possível modificar os plantões
                                            </span>)}
                                    </>)}
                                </MDBox>
                                <MDBox p>
                                    {escalaSelecionada &&(
                                        <DataGrid
                                            checkboxSelection
                                            disableColumnMenu
                                            sx={{fontSize: '18px', fontWeight:'regular', height:'80%'}}
                                            pageSizeOptions={[5,10,20]}
                                            initialState={{
                                                pagination: { paginationModel: { pageSize: 5 } },
                                                sorting: {sortModel: [{field: 'data', sort: 'asc'}],},
                                            }}
                                            rows={plantoes}
                                            columns={[
                                                {field:'data', headerName:'Datas',width: 120, sortable:false, renderCell: (params) => {
                                                        const dateParts = params.value.split('-');
                                                        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                                                        return <span>{formattedDate}</span>;
                                                    },},
                                                {field: 'plantonista', headerName: 'Plantonista', flex:2, minWidth:220,
                                                    renderCell: (params) => (
                                                        <span style={{color: params.value.data[0] ? 'red' : 'green',}}>
                                                        {params.value.data[0] ?  `${params.value.data[0].attributes.nome}`:'Disponível' }
                                                    </span>
                                                    ),
                                                },
                                                {
                                                    field: 'id',
                                                    headerName: 'Opções',
                                                    width: 120, align:"center",
                                                    renderCell: (params) => (
                                                        <Tooltip title="Limpar o plantonista">
                                                            {params.row.plantonista.data[0] && !escalaSelecionada.fechada && juizSelecionado && juizSelecionado.id === params.row.plantonista.data[0].id ?(
                                                                <GridActionsCellItem
                                                                    icon={<RemoveCircleOutlineIcon/>}
                                                                    label="Limpar Plantonista"
                                                                    onClick={() => {
                                                                        setRowData(params.row); // Armazena os detalhes do params.row no estado rowData
                                                                        setSair(true); // Abre o Dialog
                                                                    }}
                                                                    color="inherit"
                                                                />
                                                                ) : (
                                                                    <div></div>
                                                            )}
                                                        </Tooltip>
                                                    ),
                                                },]}
                                            disableSelectionOnClick={true}
                                            isRowSelectable={(params) => {
                                                if (juizSelecionado && escalaSelecionada && !escalaSelecionada.fechada) {
                                                    if (preferenciaJuizId === juizSelecionado.id) {
                                                    const plantonistaAtribuido = params.row.plantonista.data[0];
                                                    return !plantonistaAtribuido;
                                                    }
                                                }
                                                return false;
                                            }}
                                            onRowSelectionModelChange={(newRowSelectionModel) => {setPlantaoSelecionado(newRowSelectionModel);}}
                                            rowSelectionModel={plantaoSelecionado}
                                        />
                                    )}
                                    {escalaSelecionada && (
                                        <MDBox mt={2} display="flex" justifyContent="flex-end">
                                            {plantaoSelecionado.length > 0 && (
                                                <MDButton color="success" size="small" type="submit" sx={{ marginRight: '10px' }}>
                                                    Adicionar
                                                </MDButton>
                                            )}
                                            {juizSelecionado?.id === preferenciaJuizId &&(
                                            <MDButton size="small" onClick={()=>setPassar(true)} variant='outlined' color="dark">Passar a vez</MDButton>)}
                                        </MDBox>
                                    )}
                                </MDBox>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} xl={6} pt={1} pb={4}>
                            {escalaSelecionada && (
                                <MDBox px={4} pt={5} mb={4}>
                                    <Calendario plantoes={plantoes} escalaSelecionada={escalaSelecionada}/>
                                </MDBox>)}
                        </Grid>
                        {!escalaSelecionada && (
                            <MDTypography variant="h6" mx={5} ml={7} mt={-4} mb={4} fontWeight="light">
                                Escala não selecionada
                            </MDTypography>
                        )}
                    </Grid>
                </form>
            </Card>
        </DashboardLayout>
    );
}

export async function getServerSideProps(ctx) {
    const validate = await validateAuthToken(ctx,'todos');

    if(validate){
        return validate;
    }

    const h = {
        'Content-Type': 'application/json',
       // 'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
    };
    const res = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas?populate[plantaos][populate][0]=plantonista&populate[participantes][populate][0]=plantoes&populate[preferencia][populate][0]=juizs`, {
        method: 'GET',
        headers: h,
    });
    const responseEscala = await res.json();
    const data = responseEscala.data.map((item) => ({id: item.id, ...item.attributes,}));

    return { props: {data, h} };
}


export default Plantoes;