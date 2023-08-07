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
import ParticipantesList from "../../participanteslist";
import {setParticipantesEscala} from "../../../utils/escalaUtils";
import MDButton from "../../../components/MDButton";


const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
};
const parseJSON = resp => (resp.json ? resp.json() : resp);

const checkStatus = resp => {
    if (resp.status >= 200 && resp.status < 300) {
        return resp;
    }
    return parseJSON(resp).then(resp => {
        throw resp;
    });
};
function Participantes() {

    //------- CONSTANTES PARA O DATAGRID----------------------------------------
    const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    //--------------------------------------------------------------------------
    const [escalas, setEscalas] = useState([]);
    const [juizes, setJuizes] = useState([]);
    const [error, setError] = useState(null);
    const [jsonData, setJsonData]= useState([]);

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

        fetchEscalas();
        fetchJuizes();
    }, []);


    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:1337/api/escalas/{', {
                method: 'POST',
                headers,
                body: JSON.stringify({ data: modifiedData }),
            })
                .then(checkStatus)
                .then(parseJSON);
        } catch (error) {
            setErrorEscalas(error);
        }
    };


    // Se jsonData estiver disponível, você pode renderizar o componente ParticipantesList
    return (
        <DashboardLayout>
            <h1>Lista de Participantes</h1>
            <Card sx={{ height: "100%" }}>

                <MDBox pt={2} px={2}>
                    <MDTypography variant="h6" >
                        Selecionar juizes participantes
                    </MDTypography>
                </MDBox>
                <MDBox p={2}>
                    <Grid item xs={12} xl={12} >
                        <Autocomplete
                            options={escalas}
                            getOptionLabel={escala => escala.descricao}
                            value={opcaoSelecionada}
                            onChange={(event, newValue) => setOpcaoSelecionada(newValue)}
                            renderInput={(params) => <TextField {...params} label="Escala" />}
                        />
                    </Grid>{opcaoSelecionada && (
                    <DataGrid

                        checkboxSelection
                        disableColumnMenu
                        sx={{ fontSize: '17px' }}
                        rowsPerPageOptions={[5]}
                        initialState={{pagination:{paginationModel:{pageSize:5}},}}
                        rows={juizes}
                        columns={[{field:'Nome',headerName:'Juiz', flex:'1'},]}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                        rowSelectionModel={rowSelectionModel}

                    />)}
                    {opcaoSelecionada && (<MDButton color="info" onClick={() => console.log(opcaoSelecionada.id,rowSelectionModel)}>Imprimir Selecionados</MDButton>)}
                    {!opcaoSelecionada && (
                        <MDTypography variant="h6" fontWeight="light" ml={2} mt={2}>
                            Escala não selecionada
                        </MDTypography>
                    )}
                    <MDBox  p={1}>
                        <MDButton color="success" size="normal" onClick={() => setParticipantesEscala(opcaoSelecionada.id,rowSelectionModel,headers)}>Salvar</MDButton>
                    </MDBox>
                </MDBox>
            </Card>
        </DashboardLayout>
    );
}

export default Participantes;
