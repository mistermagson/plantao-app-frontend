import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import {DataGrid, GridToolbar,gridPageCountSelector,
    GridPagination,
    useGridApiContext,
    useGridSelector,} from '@mui/x-data-grid';
import React, {useState, useEffect, get} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDButton from "../../components/MDButton";
import {setPlantonista, removePlantonista} from "../../utils/plantaoUtils";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import {GridActionsCellItem,} from '@mui/x-data-grid';
import {fetchEscalas} from "../../utils/escalaUtils";
import Calendario from "../escalas/calendario";
import {passaPreferencia} from "../../utils/escalaUtils";
import {Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Card from "@mui/material/Card";
import MuiPagination from '@mui/material/Pagination';


function Plantoes({propescalas, cabecalho}) {

    const escalasserverside = propescalas.data.map((item) => ({id: item.id, ...item.attributes,}))

    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [juizSelecionado, setJuizSelecionado] = useState(null);
    const [plantaoSelecionado, setPlantaoSelecionado] = useState([]);
    const [headers, setHeaders] = useState(cabecalho);
    const [juizes, setJuizes] = useState([]);
    const [escalas, setEscalas] = useState(escalasserverside);
    const [plantoes, setPlantoes] = useState([]);
    const [error, setError] = useState(null);
    const [fixGet, setFixGet] = useState(0);
    const [block, setBlock] = useState(null);
    const [passar, setPassar] = useState(false);
    const [sair, setSair] = useState(false);
    const [rowData, setRowData] = useState(null);
    const [preferenciaJuizId, setPreferenciaJuizId] = useState(null);


    useEffect(() => {
        if(escalaSelecionada) {
            const escalaEncontrada = escalas.find(escala => escala.id === escalaSelecionada.id);

            if (escalaEncontrada) {
                setEscalaSelecionada(escalaEncontrada);
                setPlantoes(escalaEncontrada.plantaos.data.map(item => ({ id: item.id, ...item.attributes })));
                setPreferenciaJuizId(escalaSelecionada.preferencia.data?.id);
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

    }, [escalas, escalaSelecionada, plantoes, block]);



    const handleSubmit =  async (event) => {
        event.preventDefault();
        try {
            setPlantonista(juizSelecionado.id, plantaoSelecionado, headers)
            const atualizaEscalas = await fetchEscalas(headers)
            setEscalas(atualizaEscalas)
            setPlantaoSelecionado([])
        } catch (error) {
            console.error(error);
        }
        finally {
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
                setPreferenciaJuizId(selected.preferencia.data?.id);

                setJuizSelecionado(null);
            }

        }catch (error) {
            setError(error.message);
        }

    }

    const showJSON = () => {

        console.log('plantao',plantaoSelecionado);


    };

    const handleLimparPlantonista = async (row) => {
        try {
            const idJuiz = row.plantonista.data[0].id;
            removePlantonista(idJuiz, row.id, headers);

            const escalasAtualizadas = await fetchEscalas(headers);
            setEscalas(escalasAtualizadas);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => {
        setPassar(false);
        setSair(false);
    };

    const passaEscolha = async()=>{
        try{
            passaPreferencia(escalaSelecionada,headers);

        } catch (error) {
            console.error(error);
        }finally {
            const escalasAtualizadas = await fetchEscalas(headers)
            setEscalas(escalasAtualizadas);
        }
    }

    function Pagination({ page, onPageChange, className }) {
        const apiRef = useGridApiContext();
        const pageCount = useGridSelector(apiRef, gridPageCountSelector);

        return (
            <MuiPagination
                color="info"
                className={className}
                count={pageCount}
                page={page + 1}
                onChange={(event, newPage) => {
                    onPageChange(event, newPage - 1);
                }}
            />
        );
    }

    function CustomPagination(props) {
        return <GridPagination ActionsComponent={Pagination} {...props} />;
    }


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
                        <Button onClick={() => { handleLimparPlantonista(rowData); handleClose(); handleLimparPlantonista(rowData);}}>Sim</Button>
                        <Button onClick={handleClose}>Não</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <MDBox p={2}>
                <MDTypography variant="h2">Plantões</MDTypography>
            </MDBox>
            <Card>
                <form onSubmit={handleSubmit}>
                    <Grid container >
                        <Grid item xs={12} xl={12} >
                            <Grid container spacing={2}  pl={3} >
                                    <Grid item xs={9} xl={4}>
                                        <MDBox  my={2}>
                                            <h5>Selecione a escala:</h5>
                                        </MDBox>
                                        <Autocomplete
                                            options={escalas}
                                            getOptionLabel={escala => escala.descricao}
                                            value={escalaSelecionada}
                                            onChange={(event, newValue) =>{
                                                setEscalaSelecionada(newValue);
                                                onChangeEscala(newValue);}}
                                            renderInput={(params) => <TextField {...params} label="Escala" />}
                                        />
                                    </Grid>{/* AUTOCOMPLETE ESCALA*/}

                                    <Grid item xs={9}  xl={4}>
                                        <MDBox my={2}>
                                            <h5>Digite e selecione seu nome:</h5>
                                        </MDBox>
                                        <Autocomplete
                                            options={!juizes ?  [{label:"Carregando...", id:0}] : juizes }
                                            getOptionLabel={juiz => juiz.nome }
                                            value={juizSelecionado}
                                            onChange={(event, newValue) =>setJuizSelecionado(newValue)}
                                            renderInput={(params) => <TextField {...params} label="Nome do Juiz" required />}
                                            renderOption={(props, option, { inputValue }) => {
                                                const preferenciaJuizId = escalaSelecionada?.preferencia?.data?.id;
                                                const isPreferencial = preferenciaJuizId === option.id;
                                                return (
                                                    <li {...props}>
                                                        {option.nome}
                                                        {isPreferencial && (
                                                            <span style={{ color: 'green', marginLeft: '4px' }}> - Na escolha</span>
                                                        )}
                                                    </li>
                                                );
                                            }}
                                        />
                                    </Grid>{/* AUTOCOMPLETE JUIZ*/}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} xl={6} pt={2} >
                            <MDBox px={2}>
                                <MDBox p={2}  >
                                    {escalaSelecionada && (<>
                                        <MDTypography variant="h6" style={{ marginBottom: '-10px' }}>Plantões:</MDTypography>
                                    </>)}
                                </MDBox>
                                <MDBox p>
                                    {escalaSelecionada === null ? (
                                        <Alert severity="warning" style={{ paddingLeft: '20px', marginTop: '-20px',  marginBottom: '20px' }}>
                                            Selecione uma escala
                                        </Alert>
                                    ) : (
                                        juizSelecionado !== null ? (
                                            escalaSelecionada !== null && !escalaSelecionada.fechada && juizSelecionado?.id === preferenciaJuizId ? (
                                                <Alert severity="info" style={{ paddingLeft: '20px', marginTop: '-10px' }}>
                                                    Escolha seus plantões
                                                </Alert>
                                            ) : (
                                                <Alert severity="error" style={{ paddingLeft: '20px', marginTop: '-10px' }}>
                                                    Aguarde sua vez para escolher os plantões
                                                </Alert>
                                            )
                                        ) : (
                                            <Alert severity="warning" style={{ paddingLeft: '20px', marginTop: '-10px' }}>
                                                Selecione um magistrado
                                            </Alert>
                                        )
                                    )}

                                    {escalaSelecionada &&(
                                        <DataGrid
                                            style={{ height: '500px' }}
                                            checkboxSelection
                                            editMode="row"
                                            disableColumnMenu
                                            pageSizeOptions={[5, 10, 20]}
                                            sx={{fontSize: '18px', fontWeight:'regular'}}
                                            slots={{
                                                pagination: CustomPagination,
                                                toolbar: GridToolbar,
                                            }}
                                            initialState={{
                                                sorting: {sortModel: [{field: 'data', sort: 'asc'}],},
                                                pagination: { paginationModel: { pageSize: 50 } },
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
                                                        <Tooltip title="Abandonar Plantão">
                                                            {params.row.plantonista.data[0]
                                                                && !escalaSelecionada.fechada
                                                                && juizSelecionado
                                                                && juizSelecionado.id === params.row.plantonista.data[0].id ? (
                                                                    <GridActionsCellItem
                                                                        icon={<RemoveCircleOutlineIcon/>}
                                                                        label="Limpar Plantonista"
                                                                        onClick={(event) => {
                                                                            event.preventDefault();
                                                                            setRowData(params.row)
                                                                            setSair(true);

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
                                                    const preferenciaJuizId = escalaSelecionada.preferencia?.data?.id;
                                                    if (preferenciaJuizId === juizSelecionado.id) {
                                                        const plantonistaAtribuido = params.row.plantonista.data[0];
                                                        return !plantonistaAtribuido;
                                                    }
                                                }
                                                return false;
                                            }}
                                            onRowSelectionModelChange={(newRowSelectionModel) => {setPlantaoSelecionado(newRowSelectionModel);}}
                                            rowSelectionModel={plantaoSelecionado}
                                            hideFooterRowCount={true}
                                            hideFooterSelectedRowCount={true}
                                            slotProps={{toolbar: {showQuickFilter: true,},}}
                                            disableColumnFilter
                                            disableColumnSelector
                                            disableDensitySelector
                                        />
                                    )}
                                    {escalaSelecionada && (
                                        <MDBox my={2} display="flex" justifyContent="flex-end">
                                            {plantaoSelecionado.length > 0 && (
                                                <MDButton color="success" size="small" type="submit" sx={{ marginRight: '10px' }}>
                                                    Adicionar
                                                </MDButton>
                                            )}
                                            {juizSelecionado?.id === preferenciaJuizId &&(
                                                <MDButton size="small" onClick={()=>setPassar(true)} variant='outlined' color="dark">Passar a vez</MDButton>
                                            )}
                                        </MDBox>
                                    )}
                                </MDBox>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} xl={6} pt={4} pb={4}>
                            {escalaSelecionada && (
                                <MDBox px={4} mt={6}>
                                    <Calendario style={{height:'800px'}} plantoes={plantoes} escalaSelecionada={escalaSelecionada}/>
                                </MDBox>)}
                        </Grid>
                    </Grid>
                </form>
            </Card>
        </DashboardLayout>
    );
}

export async function getServerSideProps() {
    const h = {
        'Content-Type': 'application/json',
        //'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
    };


    const res = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas?populate[plantaos][populate][0]=plantonista&populate[participantes][populate][0]=plantoes&populate[preferencia][populate][0]=juizs`, {
        method: 'GET',
        headers: h
     })
        const data = await res.json()
        return { props: { propescalas: data , cabecalho: h} };
}
export default Plantoes;