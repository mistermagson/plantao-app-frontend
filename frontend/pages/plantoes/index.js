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


function Plantoes({data, h}) {

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

    const statusEscala =() =>{

        const fechada={
            fechada:`${!escalaSelecionada.fechada}`
        }
        console.log('REAL',escalaSelecionada.fechada)
        console.log(fechada)

        const setStatus = async () => {
            try {
                const response = await fetch(`http://localhost:1337/api/escalas/${escalaSelecionada.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({ data: fechada }),
                })
            } catch (error) {
                return error;
            }finally {
                const atualizaEscalas = await fetchEscalas(headers)
                setEscalas(atualizaEscalas)
                setPlantaoSelecionado([]);
            }
        };

        setStatus();
    }
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

        console.log('plantao',plantaoSelecionado);
        console.log('juiz',juizSelecionado);

    };
    const handleLimparPlantonista = async(row) => {
        try {
            const idJuiz = row.plantonista.data[0].id;
            console.log(idJuiz, row.id, headers)
            await removePlantonista(idJuiz, row.id, headers);
            setPlantaoSelecionado([]);
            const escalasAtaulizadas = await fetchEscalas(headers)
            setEscalas(escalasAtaulizadas);
            // await setEscalas(fetchEscalas(headers));

        } catch (error) {
            console.error(error);
        }
    };

    const theme = createTheme({});

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

                                    <Grid item xs={12}  xl={12}>
                                        <MDBox my={2}>
                                            <h5>Selecione o nome do juiz :</h5>
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
                                                            <span style={{ color: 'red', marginLeft: '4px' }}> - Na escolha</span>
                                                        )}
                                                    </li>
                                                );
                                            }}
                                        />
                                    </Grid>

                                </Grid>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} xl={6}>
                            <MDBox mb={3}>
                                <MDBox pt={2} px={2}>{escalaSelecionada &&(
                                    <MDTypography variant="h6" >
                                        Selecione os plantões:
                                    </MDTypography>)}
                                </MDBox>

                                    <MDBox p={2}>
                                        {escalaSelecionada &&(
                                            <DataGrid
                                                checkboxSelection
                                                disableColumnMenu
                                                sx={{fontSize: '18px', fontWeight:'regular', }}
                                                pageSizeOptions={[5,10,20]}
                                                initialState={{pagination: { paginationModel: { pageSize: 5 } },}}
                                                rows={plantoes}
                                                columns={[
                                                    {field:'data', headerName:'Datas',width: 120, sortable:false, renderCell: (params) => {
                                                            const dateParts = params.value.split('-');
                                                            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                                                            return <span>{formattedDate}</span>;
                                                        },},
                                                    {field: 'plantonista', headerName: 'Status', flex:1, minWidth:220,
                                                        renderCell: (params) => (
                                                            <span style={{color: params.value.data[0] ? 'red' : 'green',}}>
                                                            {params.value.data[0] ?  `Ocupado - ${params.value.data[0].attributes.nome}`:'Disponível' }
                                                        </span>
                                                        ),
                                                    },
                                                    {
                                                        field: 'id',
                                                        headerName: 'Opções',
                                                        width: 120,
                                                        renderCell: (params) => (
                                                            <Tooltip title="Limpar o plantonista">
                                                                {params.row.plantonista.data[0] && juizSelecionado && juizSelecionado.id === params.row.plantonista.data[0].id ? ( // Verifica se o plantonista está definido
                                                                    <GridActionsCellItem
                                                                        icon={<CleaningServicesIcon />}
                                                                        label="Limpar Plantonista"
                                                                        onClick={() => handleLimparPlantonista(params.row)}
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
                                            />
                                        )}
                                        {escalaSelecionada && (
                                            <MDBox mt={2} display="flex" justifyContent="flex-end">
                                                {plantaoSelecionado.length > 0 && (
                                                    <MDButton color="success" size="small" type="submit" sx={{ marginRight: '10px' }}>
                                                        Adicionar
                                                    </MDButton>
                                                )}

                                                {!escalaSelecionada.fechada &&(
                                                    <MDButton color="error" size="small" onClick={statusEscala} >
                                                        Fechar Escala
                                                    </MDButton>
                                                )}
                                                {escalaSelecionada.fechada &&(
                                                    <MDButton color="success" size="small" onClick={statusEscala}>
                                                        Abrir Escala
                                                    </MDButton>
                                                )}
                                            </MDBox>
                                        )}
                                    </MDBox>
                            </MDBox>
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
    const res = await fetch('http://127.0.0.1:1337/api/escalas?populate[plantaos][populate][0]=plantonista&populate[participantes][populate][0]=plantoes&populate[preferencia][populate][0]=juizs', {
        method: 'GET',
        headers: h,
    });
    //const data = await res.json();
    const responseEscala = await res.json();
    const data = responseEscala.data.map((item) => ({id: item.id, ...item.attributes,}));

    return { props: {data, h} };
}


export default Plantoes;