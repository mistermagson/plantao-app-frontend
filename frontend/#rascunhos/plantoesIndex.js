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


/*const data2 = await fetch('http://localhost:1337/api/juizs',{
    method: 'GET',
    headers
})
const juizes = await data2.json()

const data3 = await fetch('http://localhost:3000/api/escala')
const escalas = await data3.json()*/

function Plantoes() {

    //------- CONSTANTES PARA O DATAGRID----------------------------------------
    /*const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
    const [select, setSelection] = React.useState([]);*/
    //--------------------------------------------------------------------------

    //const [modifiedData, setModifiedData] = useState(valorInicial);//-------do it
    const [escalas, setEscalas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEscalas = async () => {
            try {

                const response = await fetch('http://localhost:1337/api/juizs', {
                    method: 'GET',
                    headers,
                });

                if (!response.ok) {
                    throw new Error('Falha ao obter os dados das escalas.');
                }

                const responseData = await response.json();
                console.log('')
                console.log('---------------------')
                console.log('-------| Constante DATA:', responseData);

                if (Array.isArray(responseData.data)) {
                    const escalasData = responseData.data.map((item) => ({id: item.id, ...item.attributes,}));
                    setEscalas(escalasData);

                } else {
                    setError('Formato de dados inválido.');
                }

            } catch (error) {
                setError(error.message);
            }
        };

        fetchEscalas();
    }, []);

    /*const filterEscalas = (escalas, { inputValue }) => {
        const inputValueLowerCase = inputValue.toLowerCase();
        return escalas.filter(escala =>
            escala.status.toLowerCase() === '0'
        );
    };*///Constante para filtrar as escalas

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log('Opção selecionada:', opcaoSelecionada);
        console.log('datas:', select);
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
                </MDBox>
                <form onSubmit={handleSubmit}>
                    <MDBox pb={3} px={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Autocomplete
                                    options={juizes}
                                    getOptionLabel={juiz => juiz.nome }
                                    onChange={(event, value) => console.log(value)}
                                    renderInput={(params) => <TextField {...params} label="Nome do Juiz" required />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} >
                                <Autocomplete
                                    options={escalas}
                                    getOptionLabel={escala => escala.descricao}
                                    filterOptions={filterEscalas}
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

                                    {opcaoSelecionada && opcaoSelecionada.datasplantao && (
                                        <DataGrid
                                            checkboxSelection
                                            disableColumnMenu
                                            sx={{ fontSize: '17px' }}
                                            pageSizeOptions={[5,10,20]}
                                            initialState={{pagination: { paginationModel: { pageSize: 5 } },}}
                                            isRowSelectable={(params) => params.row.status === true}
                                            onSelectionChange={(newSelection) => {setSelection(newSelection.rows);}}
                                            rows={opcaoSelecionada.datasplantao}
                                            columns={[{field:'data', headerName:'Datas',width: 120, sortable:false},{
                                                field: 'status', headerName: 'Status', width: 120,
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