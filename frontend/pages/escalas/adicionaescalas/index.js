import React, {useEffect} from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import MDBox from "/components/MDBox";
import { useState } from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "/components/MDTypography";
import MDDatePicker from "/components/MDDatePicker";
import FormField from "/pagesComponents/pages/account/components/FormField";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {FormControlLabel, InputLabel, Select} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import MDButton from "../../../components/MDButton";
import {geraDatas, setDatasEscala} from "../../../utils/escalaUtils";
import {DataGrid, GridToolbar} from '@mui/x-data-grid';





const parseJSON = resp => (resp.json ? resp.json() : resp);

const checkStatus = resp => {
    if (resp.status >= 200 && resp.status < 300) {
        return resp;

    }
    return parseJSON(resp).then(resp => {
        throw resp;
    });
};

const url = `http://localhost:1337/api/escalas`;
const token = 'ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b';
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
};

const valorInicial={
    descricao:'',
    tipo:'',
    inicio:'',
    fim:'',
    fechada:false,

}

function AdicionaEscala() {

    //------- CONSTANTES PARA O DATAGRID----------------------------------------
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    //--------------------------------------------------------------------------

    const opEscala = ["local","regional","distribuidor","recesso"];
    const [modifiedData, setModifiedData] = useState(valorInicial);
    const [errorEscalas, setErrorEscalas] = useState(null);
    const [juizes, setJuizes] = useState([]);
    const [escalas, setEscalas] = useState([]);
    const [error, setError] = useState(null);

    const fetchEscalas = async () => {
        try {
            const response = await fetch('http://localhost:1337/api/escalas?populate[plantaos][populate][0]=plantonista&populate[participantes][populate][0]=plantoes&populate[preferencia][populate][0]=juizs', {
                method: 'GET',
                headers,
            },{revalidate: 0});

            if (!response.ok) {
                throw new Error('Falha ao obter os dados das escalas.');
            }

            const responseEscala = await response.json();

            if (Array.isArray(responseEscala.data)) {
                const escalasData = responseEscala.data.map((item) => ({id: item.id, ...item.attributes,}));
                setEscalas(escalasData,()=>{
                    console.log('Escalas atualizadas:', escalasData);
                })

            } else {
                setError('Formato de dados inválido.');
            }

        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {fetchEscalas();}, []);
    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({ data: modifiedData }),
            })
                .then(checkStatus)
                .then(parseJSON)
                .then(escala => {
                    //console.log(geraDatas(escala.data.attributes.inicio, escala.data.attributes.fim));
                    const datasEscala =  geraDatas(escala.data.attributes.inicio, escala.data.attributes.fim);
                    setDatasEscala(escala.data.id, datasEscala, headers);
                    setModifiedData(valorInicial);
                    fetchEscalas();

                })

        } catch (error) {
            setErrorEscalas(error);
        }
    };
    const handleChange = e =>{
        const {name,value} = e.target
        setModifiedData({
            ...modifiedData,
            [name]: value
        })
    }
    const handleChangeCheck = e =>{
        const { name, value, checked } = e.target;
        setModifiedData({
            ...modifiedData,
            [name]: name === 'fechada' ? checked : value
        });
    }
    const showJSON = () => {
        console.log('JSON:',escalas);
    };



    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid container spacing={2}>
                <Grid item xs={12} xl={8}>
                    <MDBox p={2}>
                        <MDTypography variant="h2">Escalas Criadas</MDTypography>
                    </MDBox>
                    <Card id="escalas" sx={{ overflow: "visible" }}>
                        <MDBox mb={3}>
                            <MDBox p={2}>
                                <DataGrid
                                    disableColumnMenu
                                    sx={{fontSize: '18px', fontWeight:'regular', }}
                                    pageSizeOptions={[5,10,20]}
                                    initialState={{pagination: { paginationModel: { pageSize: 20 } },}}
                                    rows={escalas}
                                    columns={[
                                        {field:'descricao', headerName:'Descrição',flex:1},
                                        {field:'tipo', headerName:'Tipo',flex:1},
                                        {field:'fechada', headerName:'Status',width:150,
                                            renderCell: (params) => (
                                                <span style={{
                                                    color: params.value ?  'red':'green',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}>

                                                    {params.value ? 'Fechada':'Aberta'}
                                                </span>),
                                        },]}
                                    onRowSelectionModelChange={(newRowSelectionModel) => {setRowSelectionModel(newRowSelectionModel);}}
                                    rowSelectionModel={rowSelectionModel}
                                    disableColumnFilter
                                    disableColumnSelector
                                    disableDensitySelector
                                    disablE
                                    slots={{ toolbar: GridToolbar }}
                                    slotProps={{
                                        toolbar: {
                                            showQuickFilter: true,
                                        },
                                    }}

                                />
                            </MDBox>
                        </MDBox>
                    </Card>

                </Grid>
                <Grid item xs={12} xl={4} sx={{ height: "max-content" }}>
                    <MDBox p={2}>
                        <MDTypography variant="h2">Adicionar Escala</MDTypography>
                    </MDBox>
                    <Card id="escalas" sx={{ overflow: "visible" }}>
                        <form onSubmit={handleSubmit}>
                            <Grid py={3} px={4} >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} xl={12} >
                                        <MDTypography variant="h6" mb={1} >Insira uma descrição:</MDTypography>
                                        <FormField
                                            label="Descrição"
                                            placeholder="Digite aqui"
                                            name="descricao"
                                            variant="outlined"
                                            value={modifiedData.descricao}
                                            onChange={handleChange}
                                            rows={3}
                                            multiline
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}  xl={12}>
                                        <MDTypography variant="h6" mb={1}>Selecione o tipo de escala:</MDTypography>
                                        <Autocomplete
                                            required
                                            name="tipoEscala"
                                            options={opEscala}
                                            value={modifiedData.tipo} // Define o valor selecionado
                                            onChange={(event, newValue) =>
                                                setModifiedData({ ...modifiedData, tipo: newValue })
                                            }
                                            renderInput={(params) => <TextField {...params} label="Tipo" />}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} mt={2}>
                                    <Grid item xs={4} xl={6}>
                                        <MDTypography variant="h6">Data de Inicio:</MDTypography>
                                        <MDDatePicker
                                            required
                                            input={{ placeholder: "Escolha uma data", format: "dd/MM/yy" }}
                                            value={modifiedData.inicio}
                                            onChange={(event, value) =>
                                                setModifiedData({ ...modifiedData, inicio: value })}/>

                                    </Grid>
                                    <Grid item xs={4} xl={6}>
                                        <MDTypography variant="h6">Data de Fim:</MDTypography>
                                        <MDDatePicker
                                            required
                                            name="dataFim"
                                            value={modifiedData.fim}
                                            input={{ placeholder: "Escolha uma data", format: "dd/MM/yy" }}
                                            onChange={(event, value) =>
                                                setModifiedData({ ...modifiedData, fim: value })}/>
                                    </Grid>
                                    <Grid item xs={12} xl={8} >

                                        <Grid ml={1}>
                                            <MDTypography variant="h6">Status da Escala:</MDTypography>
                                            <FormControlLabel

                                                control={<Checkbox defaultChecked={modifiedData.fechada} />}
                                                label="Fechada"
                                                name="fechada"
                                                checked={modifiedData.fechada}
                                                onChange={handleChangeCheck}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid mt={4}>
                                    <MDButton size="small" onClick={showJSON} lcolor="info">Exibir</MDButton>
                                    <MDButton onClick={handleSubmit} size="small" color="success" >Salvar</MDButton>
                                </Grid>
                            </Grid>
                        </form>
                    </Card>
                </Grid>

            </Grid>

        </DashboardLayout>
    );
}
export default AdicionaEscala;