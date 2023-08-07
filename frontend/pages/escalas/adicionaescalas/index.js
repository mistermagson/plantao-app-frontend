import React, {useEffect} from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import DataTable from "/examples/Tables/DataTable";
import {keys} from "regenerator-runtime";
import MDBox from "/components/MDBox";
import { useState } from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "/components/MDTypography";
import MDDatePicker from "/components/MDDatePicker";
import FormField from "/pagesComponents/pages/account/components/FormField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {FormControlLabel, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import {DataGrid} from "@mui/x-data-grid";
import MDButton from "../../../components/MDButton";


const parseJSON = resp => (resp.json ? resp.json() : resp);

const checkStatus = resp => {
    if (resp.status >= 200 && resp.status < 300) {
        return resp;
    }
    return parseJSON(resp).then(resp => {
        throw resp;
    });
};
const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
};

const valorInicial={
    descricao:'',
    tipo:'',
    inicio:'',
    fim:'',
    fechada:false,

}
function AdicionaEscala({escalas}) {

    //------- CONSTANTES PARA O DATAGRID----------------------------------------
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    //--------------------------------------------------------------------------

    const opEscala = ["local","regional","distribuidor"];
    const [modifiedData, setModifiedData] = useState(valorInicial);
    const [errorEscalas, setErrorEscalas] = useState(null);
    const [juizes, setJuizes] = useState([]);


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
        fetchJuizes();
    }, []);
    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:1337/api/escalas', {
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
    const handleChange = e =>{
        const {name,value} = e.target
        setModifiedData({
            ...modifiedData,
            [name]: value
        })
    }
    const showJSON = () => {
        console.log('JSON:', juizes);
    };
    // Função para ser chamada quando a seleção mudar


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox p={3}>
                <MDTypography variant="h2">Adicionar Escala</MDTypography>
            </MDBox>
            <Grid container spacing={2}>
                <Grid item xs={12} xl={8} sx={{ height: "max-content" }}>
                    <Card id="escalas" sx={{ overflow: "visible" }}>

                        <MDBox p={1} ml={2} my={2}>
                            <h5 >Insira uma descrição e selecione o tipo de escala:</h5>
                        </MDBox>
                        <form onSubmit={handleSubmit}>
                            <Grid pb={3} px={3}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} xl={6} >

                                        <FormField
                                            label="Descrição"
                                            placeholder="Insira uma descrição"
                                            name="descricao"
                                            variant="outlined"
                                            value={modifiedData.descricao}
                                            onChange={handleChange}
                                            rows={3}
                                            multiline
                                        />
                                    </Grid>
                                    <Grid item xs={12}  xl={6}>

                                        <Autocomplete
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
                                    <Grid item xs={6} xl={4}>
                                        <MDTypography variant="h6">Data de Inicio:</MDTypography>
                                        <MDDatePicker
                                            input={{ placeholder: "Escolha uma data", format: "dd/MM/yy" }}
                                            value={modifiedData.inicio}
                                            onChange={(event, value) =>
                                                setModifiedData({ ...modifiedData, inicio: value })}/>

                                    </Grid>
                                    <Grid item xs={6} xl={4}>
                                        <MDTypography variant="h6">Data de Fim:</MDTypography>
                                        <MDDatePicker
                                            name="dataFim"
                                            value={modifiedData.fim}
                                            input={{ placeholder: "Escolha uma data", format: "dd/MM/yy" }}
                                            onChange={(event, value) =>
                                                setModifiedData({ ...modifiedData, fim: value })}/>
                                    </Grid>
                                    <Grid item xs={6} xl={4} >
                                        <MDTypography variant="h6">Status da Escala:</MDTypography>
                                        <FormControlLabel
                                            control={<Checkbox defaultChecked />}
                                            label="Fechada"
                                            name="fechada"
                                            value={modifiedData.fechada}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid p={1}>
                                    <MDButton size="small" onClick={showJSON} color="info">Exibir</MDButton>
                                    <MDButton onClick={handleSubmit} size="small" color="success" >Salvar</MDButton>
                                </Grid>
                            </Grid>
                        </form>
                    </Card>
                </Grid>
                <Grid item xs={12} xl={4}>
                    <MDBox mb={3}>

                    </MDBox>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}
export default AdicionaEscala;