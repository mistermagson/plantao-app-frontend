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

const headers= {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
};

function Plantoes() {

    //------- CONSTANTES PARA O DATAGRID----------------------------------------
    const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
    const [select, setSelection] = React.useState([]);
    //--------------------------------------------------------------------------

    //const [modifiedData, setModifiedData] = useState(valorInicial);//-------do it
    const [juizes, setJuizes] = useState([]);
    const [escalas, setEscalas] = useState([]);
    const [plantoes, setPlantoes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJuizes = async () => {
            try {

                const response1 = await fetch('http://localhost:1337/api/juizs', {
                    method: 'GET',
                    headers,
                });

                if (!response1.ok) {
                    throw new Error('Falha ao obter os dados dos juizes.');
                }

                const responseJuiz = await response1.json();
                console.log('')
                console.log('------------------------------------------------')
                console.log('-------| Constante responseJuiz:', responseJuiz);

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

                const response2 = await fetch('http://localhost:1337/api/escalas?populate=*', {
                    method: 'GET',
                    headers,
                });

                if (!response2.ok) {
                    throw new Error('Falha ao obter os dados dos juizes.');
                }

                const responseEscala = await response2.json();
                console.log('')
                console.log('------------------------------------------------')
                console.log('-------| Constante responseEscala:', responseEscala);

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

        /*const fetchPlantoes = async () => {
            try {

                const response3 = await fetch('http://localhost:1337/api/plantoes', {
                    method: 'GET',
                    headers,
                });

                if (!response3.ok) {
                    throw new Error('Falha ao obter os dados dos juizes.');
                }

                const responsePlantoes = await response3.json();
                console.log('')
                console.log('------------------------------------------------')
                console.log('-------| Constante responsePlantoes:', responsePlantoes);

                if (Array.isArray(responsePlantoes.data)) {
                    const plantoesData = responsePlantoes.data.map((item) => ({id: item.id, ...item.attributes,}));
                    setPlantoes(plantoesData);

                } else {
                    setError('Formato de dados inválido.');
                }

            } catch (error) {
                setError(error.message);
            }
        };*/

        fetchJuizes();
        fetchEscalas();
        //fetchPlantoes();
    }, []);

    /*const filterEscalas = (escalas, { inputValue }) => {
        const inputValueLowerCase = inputValue.toLowerCase();
        return escalas.filter(escala =>
            escala.fechada.toLowerCase() === false
        );
    };*///Constante para filtrar as escalas

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log('Opção selecionada:', opcaoSelecionada);

    };
    const handleChange = e =>{
        const {name,value} = e.target
        setModifiedData({
            ...modifiedData,
            [name]: value
        })
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card id="basic-info" sx={{ overflow: "visible" }}>
                <MDBox p={3}>
                    <MDTypography variant="h2">Plantões</MDTypography>
                </MDBox>
                <MDBox p={1} ml={2}>
                    <h5>Selecione o nome do juiz e a escala:</h5>
                    <h2>
                        {console.log('-------| PÓS MAP |--------')}
                        {console.log('-------| Constante Juizes:', juizes)}
                        {console.log('-------| Constante Escalas:', escalas)}
                        {console.log('-------| Constante Plantoes:', escalas[0].plantoes)}
                        {console.log('')}
                    </h2>
                </MDBox>
                <form onSubmit={handleSubmit}>
                    <MDBox pb={3} px={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Autocomplete
                                    options={juizes}
                                    getOptionLabel={juiz => juiz.Nome }
                                    onChange={(event, value) => console.log(value)}
                                    renderInput={(params) => <TextField {...params} label="Nome do Juiz" required />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} >
                                <Autocomplete
                                    options={escalas}
                                    getOptionLabel={escala => escala.descricao}

                                    value={opcaoSelecionada}
                                    onChange={(event, newValue) => setOpcaoSelecionada(newValue)}
                                    renderInput={(params) => <TextField {...params} label="Escala" />}
                                />
                            </Grid>
                        </Grid>
                        <MDBox my={2} >
                            <h5>Plantões Disponiveis:</h5>
                        </MDBox>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={5}>
                                <Grid style={{ flex: '1' }}>

                                    {opcaoSelecionada && (
                                        <DataGrid
                                            checkboxSelection
                                            disableColumnMenu
                                            sx={{ fontSize: '17px' }}
                                            pageSizeOptions={[5,10,20]}
                                            initialState={{pagination: { paginationModel: { pageSize: 5 } },}}
                                            isRowSelectable={(params) => params.row.status === true}
                                            onSelectionChange={(newSelection) => {setSelection(newSelection.rows);}}
                                            rows={plantoes}
                                            columns={[{field:'data', headerName:'Datas',width: 120, sortable:false},{field:'escala', headerName:'Escala',width: 120, sortable:false},{field:'juiz', headerName:'Juiz',width: 120, sortable:false},{field: 'status', headerName: 'Status', width: 120,
                                                renderCell: (params) => (
                                                    <span style={{ color: params.value ? 'green' : 'red' }}>
                                                        {params.value ? 'Disponível' : 'Ocupado'}
                                                    </span>
                                                ),
                                            },]}
                                        />)}
                                </Grid>
                                <Grid item xs={12} sm={6} >

                                </Grid>
                            </Grid>
                        </Grid>
                        <Button color="error" size="large" type="submit">Salvar</Button>
                    </MDBox>
                </form>
            </Card>
        </DashboardLayout>
    );
}
export default Plantoes;