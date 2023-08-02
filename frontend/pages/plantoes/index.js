import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import {DataGrid, GridFooter, useGridApiContext, useGridApiEventHandler, useGridApiRef} from '@mui/x-data-grid';
import React, {useState, useEffect} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDButton from "../../components/MDButton";

const headers= {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
};

function Plantoes() {

    //------- CONSTANTES PARA O DATAGRID----------------------------------------
    const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
    //--------------------------------------------------------------------------

    const [juizes, setJuizes] = useState([]);
    const [escalas, setEscalas] = useState([]);
    const [plantoes, setPlantoes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEscalas = async () => {
            try {

                const response2 = await fetch('http://localhost:1337/api/escalas?populate=*', {
                    method: 'GET',
                    headers,
                });

                if (!response2.ok) {
                    throw new Error('Falha ao obter os dados dos juizes.');
                }

                const responseEscala = await response2.json();

                if (Array.isArray(responseEscala.data)) {
                    const escalasData = responseEscala.data.map((item) => ({id: item.id, ...item.attributes,}));
                    setEscalas(escalasData);
                } else {
                    setError('Formato de dados inválido.');
                }

                if (Array.isArray(responseEscala.data)) {
                    const escalasData = responseEscala.data.map((item) => {
                        // Mapeia os participantes de cada escala
                        const participantesData = item.participantes?.data?.map((participante) => ({
                            id: participante.id,
                            ...participante.attributes,
                        })) || [];

                        // Retorna um objeto contendo o 'id' da escala, a 'descricao' e o array de participantes
                        return {
                            id: item.id,
                            descricao: item.descricao,
                            participantes: participantesData,
                        };
                    });

                    // Mapeia todos os participantes de todas as escalas
                    const allJuizes = escalas.reduce((acc, escala) => {
                        return [...acc, ...escala.participantes];
                    }, []);

                    // Armazena todos os participantes no estado 'juizes'
                    setJuizes(allJuizes);
                } else {
                    setError('Formato de dados inválido.');
                }

            } catch (error) {
                setError(error.message);
            }
        };

        fetchEscalas();
        ///NECESSITA DOS PLANTOES FILTRADOS PELA ESCALA SELECIONADA PARA O DATAGRID
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        //AQUI VAI O PUT PARA ADICIONAR O PLANTAO NAS ESCALAS
        console.log('Opção selecionada:', opcaoSelecionada);

    };
    const showJSON = () => {
        console.log('JSON:', juizes);
    };
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card id="basic-info" sx={{ overflow: "visible" }}>

                <MDBox p={3}>
                    <MDTypography variant="h2">Plantões</MDTypography>
                </MDBox>
                <form onSubmit={handleSubmit}>
                    <MDBox p={1} ml={2}>
                        <h5>Selecione o nome do juiz e a escala:</h5>
                    </MDBox>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} >
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} >
                                    <Autocomplete
                                        options={escalas}
                                        getOptionLabel={escala => escala.descricao}
                                        value={opcaoSelecionada}
                                        onChange={(event, newValue) => setOpcaoSelecionada(newValue)}
                                        renderInput={(params) => <TextField {...params} label="Escala" />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Autocomplete
                                        options={escalas}
                                        getOptionLabel={juiz => juiz.Nome }
                                        onChange={(event, value) => console.log(value)}
                                        renderInput={(params) => <TextField {...params} label="Nome do Juiz" required />}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Grid container spacing={3}>
                                <MDBox my={2} >
                                    <h5>Plantões Disponiveis:</h5>
                                </MDBox>
                                <Grid item xs={12} sm={5}>
                                    <Grid style={{ flex: '1' }}>{opcaoSelecionada && (
                                        <DataGrid
                                            checkboxSelection
                                            disableColumnMenu
                                            sx={{ fontSize: '17px' }}
                                            pageSizeOptions={[5,10,20]}
                                            initialState={{pagination: { paginationModel: { pageSize: 5 } },}}
                                            rows={plantoes}
                                            columns={[
                                                {field:'data', headerName:'Datas',width: 120, sortable:false},
                                                {field: 'status', headerName: 'Status', width: 120,
                                                renderCell: (params) => (
                                                    <span style={{ color: params.value ? 'green' : 'red' }}>
                                                        {params.value ? 'Disponível' : 'Ocupado'}
                                                    </span>
                                                ),
                                            },]}
                                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                                setRowSelectionModel(newRowSelectionModel);}}
                                            rowSelectionModel={rowSelectionModel}

                                        />)}
                                        <Button onClick={() => console.log('Opções selecionadas:', rowSelectionModel)}>Imprimir Selecionados</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Button color="error" size="large" type="submit">Salvar</Button>
                            <MDButton size="small" onClick={showJSON} color="info">Exibir</MDButton>
                        </Grid>
                    </Grid>
                </form>
            </Card>
        </DashboardLayout>
    );
}
export default Plantoes;