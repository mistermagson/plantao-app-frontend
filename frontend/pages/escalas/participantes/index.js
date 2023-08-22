import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import {DataGrid} from '@mui/x-data-grid';
import React, {useState, useEffect} from "react";
import TextField from "@mui/material/TextField";
import {
    fetchEscalas,
    removeParticipantesEscala,
    removePreferencial,
    setParticipantesEscala,
    setPreferencia
} from "../../../utils/escalaUtils";
import MDButton from "../../../components/MDButton";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import Tooltip from '@mui/material/Tooltip';
import {GridActionsCellItem,} from '@mui/x-data-grid';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import {fetchJuizes} from "../../../utils/juizes";

function Participantes({dataEscalas, dataJuizes, h}) {

    //------- CONSTANTES PARA O DATAGRID----------------------------------------
    const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    const [headers, setHeaders] = useState(h);
    //--------------------------------------------------------------------------
    const [escalas, setEscalas] = useState(dataEscalas);
    const [juizes, setJuizes] = useState(dataJuizes);
    const [juizesRestantes, setJuizesRestantes] = useState([]);
    const [error, setError] = useState(null);
    const [jsonData, setJsonData]= useState([]);
    const [adicionados, setAdicionados] = useState([]);
    const [juizPreferencialId, setJuizPreferencialId] = useState(null);

    useEffect(() => {
        if (opcaoSelecionada) {
            const juizPreferencial = opcaoSelecionada.preferencia?.data?.id;
            setJuizPreferencialId(juizPreferencial);
        }
    }, [opcaoSelecionada]);

    useEffect(() => {
        if(opcaoSelecionada) {
            const opcaoSelecionadaAtt = escalas.find(escala => escala.id === opcaoSelecionada.id);

            if (opcaoSelecionadaAtt) {
                setOpcaoSelecionada(opcaoSelecionadaAtt)
                try {
                    const juizesParticipantes = escalas.participantes.data.map((item) => ({id: item.id, ...item.attributes,}));
                    setAdicionados(juizesParticipantes)

                    if (juizesParticipantes) {
                        const juizesFiltrados = juizes.filter(item1 => {
                            return !juizesParticipantes.some(item2 => item2.id === item1.id);
                        });
                        setJuizesRestantes(juizesFiltrados);
                    }
                }catch (error) {
                    setError(error.message);
                }
            }
        }
    }, [escalas, opcaoSelecionada]);
    const onChangeEscala = (selecionada)=>{
        try{
            const participantes = selecionada.participantes.data.map((item) => ({id: item.id, ...item.attributes,}));
            setAdicionados(participantes)

            if(participantes) {
                const naoParticipantes = juizes.filter(item1 => {
                    return !participantes.some(item2 => item2.id === item1.id);
                });
                setJuizesRestantes(naoParticipantes);
                const juizPreferencial = selecionada.preferencia?.data?.id;
                setJuizPreferencialId(juizPreferencial);
            }
        }catch (error) {
            setError(error.message);
        }

    }

    const handleLimparParticipante = async(row) => {
        try {
            const idJuiz = row.id;
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
            await fetchEscalas();
            await fetchJuizes();

        } catch (error) {
            console.error(error);
        }
    };

    const handleAlterarPreferencia = async(row) => {
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
            setParticipantesEscala(opcaoSelecionada.id,rowSelectionModel,headers)

            const novosAdicionados = adicionados.concat(rowSelectionModel.map(id => juizes.find(juiz => juiz.id === id)));
            setAdicionados(novosAdicionados);

            const novosJuizesRestantes = juizesRestantes.filter(juiz => !rowSelectionModel.includes(juiz.id));
            setJuizesRestantes(novosJuizesRestantes);
            setRowSelectionModel([]);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            fetchEscalas();
            fetchJuizes();
        }
    };

    const isJuizPreferencial = (juizId) => {
        return juizId === juizPreferencialId;
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox p={2}>
                <h1>Lista de Participantes</h1>
            </MDBox>
            <Card sx={{ height: "100%" }}>
                <MDBox pt={2} px={2}>
                    <MDTypography variant="h6" >
                        Selecionar escala
                    </MDTypography>
                </MDBox>
                <MDBox p={2}>
                    <Grid item xs={12} md={6} xl={4}  sx={{ padding: '8px' }} >
                        <Autocomplete
                            options={escalas}
                            getOptionLabel={escala => escala.descricao}
                            value={opcaoSelecionada}
                            onChange={(event, newValue) =>{
                                setOpcaoSelecionada(newValue);
                                onChangeEscala(newValue);}}
                            renderInput={(params) => <TextField {...params} label="Escala" />}
                        />
                    </Grid>
                    <Grid container spacing={4} p={2} >
                        <Grid item xs={12} md={6} xl={6}  >
                            {opcaoSelecionada && (<h5>Juizes Adicionados:</h5>)}
                            {opcaoSelecionada && (
                                <DataGrid
                                    disableRowSelectionOnClick
                                    disableColumnMenu
                                    sx={{fontSize: '18px', fontWeight:'regular',padding: '10px'}}
                                    pageSizeOptions={[10,20]}
                                    initialState={{pagination:{paginationModel:{pageSize:10}},}}
                                    rows={adicionados}
                                    columns={[
                                        {field:'nome',headerName:'Nomes',  flex:1},
                                        {field:'antiguidade',headerName:'Antiguidade', minWidth: 150},
                                        {
                                            field: 'id',
                                            headerName: 'Opções',
                                            minWidth: 80,
                                            renderCell: (params) => (
                                                <div>
                                                    <Tooltip title={isJuizPreferencial(params.row.id) ? 'Escolhendo...' : 'Definir como Preferencial'}>
                                                        <GridActionsCellItem
                                                            icon={<HowToRegIcon style={{ fontSize: 'large' }}/>}
                                                            label={isJuizPreferencial(params.row.id) ? 'Escolhendo...' : 'Definir como Preferencial'}
                                                            onClick={() => {
                                                                if (!isJuizPreferencial(params.row.id)) {
                                                                    handleAlterarPreferencia(params.row)
                                                                }
                                                            }}
                                                            color={isJuizPreferencial(params.row.id) ? 'primary' : 'default'}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="Limpar o plantonista">
                                                        <GridActionsCellItem
                                                            icon={<CleaningServicesIcon />}
                                                            label="Limpar Plantonista"
                                                            onClick={() => handleLimparParticipante(params.row)}
                                                            color="inherit"
                                                        />
                                                    </Tooltip>
                                                </div>
                                            ),
                                        },]}
                                />)}

                        </Grid>
                        <Grid item xs={12} md={6} xl={6} >
                            {opcaoSelecionada && (<h5>Juizes Restantes:</h5>)}
                            {opcaoSelecionada && (
                                <DataGrid
                                    checkboxSelection
                                    disableColumnMenu
                                    sx={{fontSize: '18px', fontWeight:'regular', padding:'10px'}}
                                    pageSizeOptions={[10,20]}
                                    initialState={{pagination:{paginationModel:{pageSize:10}},}}
                                    rows={juizesRestantes}
                                    columns={[{field:'nome',headerName:'Nome', flex:1},{field:'antiguidade',headerName:'Antiguidade', minWidth: 150},]}
                                    onRowSelectionModelChange={(newRowSelectionModel) => {
                                        setRowSelectionModel(newRowSelectionModel);
                                    }}
                                    rowSelectionModel={rowSelectionModel}
                                    /*isRowSelectable={(params) => console.log('PARAMS', params)}*/

                                />)}

                        </Grid>
                        <Grid>
                            {!opcaoSelecionada && (
                                <MDTypography variant="h6" mx={6} mt={2} mb={-3} fontWeight="light">
                                    Escala não selecionada
                                </MDTypography>
                            )}
                        </Grid>
                    </Grid>
                    <Grid my={2}>
                        {opcaoSelecionada && (<MDButton size="medium" lcolor="error" onClick={() => console.log(opcaoSelecionada,escalas,adicionados, juizes)}>Imprimir Selecionados</MDButton>)}
                        {opcaoSelecionada && (<MDButton  size="small" color="success" onClick={() => handleSubmit()}>Adicionar</MDButton>)}
                    </Grid>
                </MDBox>
            </Card>
        </DashboardLayout>
    );
}


export async function getServerSideProps() {
    const h = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
    };

    var query = `query {
   escalas {   
    data{
      id
      attributes{
        descricao
        participantes {
          data {
            id
            attributes {
              nome
              antiguidade
            }
            
          }
        }
      } 
  }
  }
  juizs (sort: "antiguidade") {
    data{
      id,
      attributes{
        nome
        antiguidade        
      }
    }
  }
}`
    const res = await fetch('http://localhost:1337/graphql', {
        method: 'POST',
        headers: h,
        body: JSON.stringify({ query }),
    });

    const responseEscala = await res.json();

    const dataEscalas = responseEscala.data.escalas.data.map((item) => ({id: item.id, ...item.attributes,}));
    const dataJuizes = responseEscala.data.juizs.data.map((item) => ({id: item.id, ...item.attributes,}));

    return { props: {dataEscalas, dataJuizes,  h} };
}

export default Participantes;
