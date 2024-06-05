import React, {useEffect, useState} from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import MDBox from "/components/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "/components/MDTypography";
import MDDatePicker from "/components/MDDatePicker";
import FormField from "/pagesComponents/pages/account/components/FormField";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import MDButton from "../../../components/MDButton";
import {geraDatas, geraFeriados, geraWeekends, removeEscala, setDatasEscala} from "../../../utils/escalaUtils";
import {DataGrid, GridActionsCellItem, GridToolbar} from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import FileOpenIcon from '@mui/icons-material/FileOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import {useRouter} from "next/router";
import Link from "next/link";
import {validateAdmin, validateAuthToken} from "../../../utils/sistemaUtils";
import {parseCookies} from "nookies";

const parseJSON = resp => (resp.json ? resp.json() : resp);

const checkStatus = resp => {
    if (resp.status >= 200 && resp.status < 300) {
        return resp;

    }
    return parseJSON(resp).then(resp => {
        throw resp;
    });
};

const url = `http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas`;
const token = process.env.PRIVATE_API_TOKEN
const headers = {
    'Content-Type': 'application/json',
   // Authorization: `Bearer ${token}`,
};

const valorInicial = {
    descricao: '',
    tipo: '',
    inicio: '',
    fim: '',
    fechada: false,
}

function AdicionaEscala(tipo) {

    //------- CONSTANTES PARA O DATAGRID----------------------------------------
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    //--------------------------------------------------------------------------

    const opEscala = ["juiz-regional", "juiz-local", "juiz-distribuidor", "juiz-recesso", "vara-recesso", "vara-anual"];
    const [modifiedData, setModifiedData] = useState(valorInicial);
    const [escalas, setEscalas] = useState([]);
    const [error, setError] = useState(null);
    const [errorEscalas, setErrorEscalas] = useState(null);
    const [salvar, setSalvar] = useState(false);
    const [deletar, setDeletar] = useState(false);
    const [linhaSelecionada, setLinhaSelecionada] = useState([]);
    const [redirectEscala, setRedirectEscala] = useState("/escalas")
    const [deleteID, setDeleteID] = useState(null);

    const router = useRouter()

    const areCamposPreenchidos = () => {
        return (
            modifiedData.descricao !== '' &&
            modifiedData.tipo !== '' &&
            modifiedData.tipo !== null &&
            modifiedData.inicio !== '' &&
            modifiedData.fim !== ''
        );
    };
    const fetchEscalas = async () => {
        try {
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas?populate[plantaos][populate][0]=plantonista&populate[participantes][populate][0]=plantoes&populate[preferencia][populate][0]=juizs`, {
                method: 'GET',
                //headers,
            }, {revalidate: 0});

            if (!response.ok) {
                throw new Error('Falha ao obter os dados das escalas.');
            }

            const responseEscala = await response.json();

            if (Array.isArray(responseEscala.data)) {
                const escalasData = responseEscala.data.map((item) => ({id: item.id, ...item.attributes,}));
                setEscalas(escalasData, () => {
                    console.log('Escalas atualizadas:', escalasData);
                })

            } else {
                setError('Formato de dados inválido.');
            }

        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchEscalas();
    }, [linhaSelecionada]);

    const geraPlantoes = (atributosEscala) =>{

        const feriados = geraFeriados(atributosEscala.inicio,atributosEscala.fim);
        const finaisDeSemanas = geraWeekends(atributosEscala.inicio,atributosEscala.fim);
        const diasGerais = geraDatas(atributosEscala.inicio, atributosEscala.fim);
        let filtraFeriados;

        switch (atributosEscala.tipo) {
            case "juiz-recesso":
                return diasGerais;
            case "juiz-local":
                filtraFeriados = diasGerais.filter((data) => !feriados.includes(data));
                return filtraFeriados.filter((data) => !finaisDeSemanas.includes(data));
            case "juiz-regional":
                const uniao = new Set([...feriados, ...finaisDeSemanas]);
                return Array.from(uniao).sort();
            case "juiz-distribuidor":
                filtraFeriados = diasGerais.filter((data) => !feriados.includes(data));
                return filtraFeriados.filter((data) => !finaisDeSemanas.includes(data));
            default:
                throw new Error("Tipo de operação inválido. Use 'recesso', 'local' ou 'regional'.");
        }
    }

    const handleSubmit = async e =>  {
        e.preventDefault();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({data: modifiedData}),

            })
                .then(checkStatus)
                .then(parseJSON)
                .then(escala => {
                    console.log("RESPONSE POST ESCALAS: ->", escala)
                    const atributos = escala.data.attributes
                    const datasEscala = geraPlantoes(atributos);

                    setDatasEscala(escala.data.id, datasEscala, headers);
                    setSalvar(true);
                    setModifiedData(valorInicial);
                    fetchEscalas();

                })

        } catch (error) {
            setErrorEscalas(error);
        }
    };

    const handleChange = e => {
        const {name, value} = e.target
        setModifiedData({
            ...modifiedData,
            [name]: value
        })
    }

    const handleChangeCheck = e => {
        const {name, value, checked} = e.target;
        setModifiedData({
            ...modifiedData,
            [name]: name === 'fechada' ? checked : value
        });
    }

    const showJSON = () => {
        console.log('datas:',modifiedData);
    };
    const handleClose = () => {
        setSalvar(false);
        setDeletar(false);
    };

    const deleteEscala = (linhaSelecionada) =>{
        try{
            const idEscala = linhaSelecionada.id
            const plantaoArray = linhaSelecionada.plantaos.data.map((plantao) => plantao.id);
            removeEscala(idEscala,plantaoArray, headers)
            setLinhaSelecionada([]);
            fetchEscalas();
        }
        catch (error) {
            setError(error.message);
        }
    }


    return (
        <DashboardLayout userTipo={tipo?.tipo}>
            {/*caixa dialogo escala adicionada*/}
            <div>
                <Dialog open={salvar} onClose={handleClose}>
                    <DialogTitle>Adição Realizada</DialogTitle>
                    <DialogContent>
                        <DialogContentText>A Escala {modifiedData.descricao} foi criada com
                            sucesso! </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Fechar</Button>
                    </DialogActions>
                </Dialog>
            </div>
            {/*caixa dialogo escala deletada*/}
            <div>
                <Dialog open={deletar} onClose={handleClose}>
                    <DialogTitle>Excluir Escala</DialogTitle>
                    <DialogContent>
                        Deseja excluir a escala{' '}
                        <span style={{fontWeight: 'bold', color: '#344767', maxWidth: '100px',}}>
                            {deleteID?.descricao}
                        </span>{' '}
                        e seus respectivos plantões?
                    </DialogContent>
                    <DialogActions>
                        <MDButton onClick={() => { deleteEscala(deleteID);handleClose();}}>Sim</MDButton>
                        <MDButton onClick={handleClose} >Não</MDButton>
                    </DialogActions>
                </Dialog>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8} xl={8}>
                    <MDBox p={2}>
                        <MDTypography variant="h2">Escalas Criadas</MDTypography>
                    </MDBox>
                    <Card id="escalas" sx={{overflow: "visible"}}>
                        <MDBox mb={3}>
                            <MDBox p={2}>
                                <DataGrid
                                    editMode="row"
                                    disableColumnMenu
                                    sx={{  fontSize: '16px', fontWeight: 'regular',color:'dark'}}
                                    pageSizeOptions={[20, 50, 100]}
                                    style={{height: '500px'}}
                                    initialState={{pagination: {paginationModel: {pageSize: 20}},}}
                                    rows={escalas}
                                    columns={[
                                        {field: 'id', headerName: 'ID', width: 50},
                                        {field: 'descricao', headerName: 'Descrição', flex:1, minWidth:280},
                                        {field: 'tipo', headerName: 'Tipo', width: 130},
                                        {field: 'fechada', headerName: 'Status', width: 100, editable:true,
                                            renderCell: (params) => (
                                                <span style={{
                                                    color: params.value ? 'red' : 'green',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}>
                                                    {params.value ? 'Fechada' : 'Aberta'}
                                                </span>),
                                        },
                                        {
                                            field: 'actions',
                                            headerName: 'Ações',
                                            width:120,
                                            renderCell: (params) => (
                                                <div >
                                                    <Link href={`/escalas?escala=${encodeURIComponent(params.row?.id)}`}>
                                                        <GridActionsCellItem
                                                            icon={<FileOpenIcon />}
                                                            label="Abrir minuta"
                                                            className="textPrimary"
                                                            onClick={()=> {console.log('trsrtesada', params.row);}}
                                                            color="dark"
                                                        />
                                                    </Link>
                                                    <GridActionsCellItem
                                                        icon={<DeleteIcon color="filled" />}
                                                        label="Delete"
                                                        onClick={()=> {setDeleteID(params.row);setDeletar(true)}}
                                                        color="error"
                                                    />
                                                </div>
                                            )
                                        },]}
                                    onRowSelectionModelChange={(newRowSelectionModel) => {setRowSelectionModel(newRowSelectionModel);}}
                                    rowSelectionModel={rowSelectionModel}
                                    disableColumnFilter
                                    disableColumnSelector
                                    disableDensitySelector
                                    slots={{toolbar: GridToolbar}}
                                    slotProps={{toolbar: {showQuickFilter: true,},}}/>
                            </MDBox>
                        </MDBox>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4} xl={4} sx={{height: "max-content"}}>
                    <MDBox p={2}>
                        <MDTypography variant="h2">Adicionar Escala</MDTypography>
                    </MDBox>
                    <Card id="escalas" sx={{overflow: "visible"}}>
                        <form onSubmit={handleSubmit}>
                            <Grid py={3} px={4}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} xl={12}>
                                        <MDTypography variant="h6" mb={1}>Insira uma descrição:</MDTypography>
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
                                    <Grid item xs={12} xl={12}>
                                        <MDTypography variant="h6" mb={1}>Selecione o tipo de escala:</MDTypography>
                                        <Autocomplete
                                            required
                                            name="tipoEscala"
                                            options={opEscala}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            value={modifiedData.tipo} // Define o valor selecionado
                                            onChange={(event, newValue) =>
                                                setModifiedData({...modifiedData, tipo: newValue})
                                            }
                                            renderInput={(params) => <TextField {...params} label="Tipo"/>}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} mt={2}>
                                    <Grid item xs={5} xl={6}>
                                        <MDTypography variant="h6">Data de Inicio:</MDTypography>
                                        <MDDatePicker
                                            required
                                            input={{placeholder: "Escolha uma data", format: "dd/MM/yy"}}
                                            value={modifiedData.inicio}
                                            onChange={(event, value) => setModifiedData({...modifiedData, inicio: value})}
                                        />
                                    </Grid>
                                    <Grid item xs={5} xl={6}>
                                        <MDTypography variant="h6">Data de Fim: </MDTypography>
                                        <MDDatePicker
                                            required
                                            name="dataFim"
                                            value={modifiedData.fim}
                                            input={{placeholder: "Escolha uma data", format: "dd/MM/yy"}}
                                            onChange={(event, value) =>
                                                setModifiedData({...modifiedData, fim: value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12} xl={8}>

                                        <Grid ml={1}>
                                            <MDTypography variant="h6">Status da Escala:</MDTypography>
                                            <FormControlLabel
                                                control={<Checkbox
                                                        checked={modifiedData.fechada}
                                                        onChange={handleChangeCheck}/>
                                                }
                                                label="Fechada"
                                                name="fechada"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid mt={4}>
                                    <MDButton size="small" onClick={showJSON} lcolor="info">Exibir</MDButton>
                                    <MDButton onClick={handleSubmit} size="small" color={`${areCamposPreenchidos() ? 'success' : 'light'}`} >Salvar</MDButton>
                                </Grid>
                            </Grid>
                        </form>
                    </Card>
                </Grid>
            </Grid>

        </DashboardLayout>
    );
}
export async function getServerSideProps(ctx) {
    const validation = validateAuthToken(ctx);

    if (validation) {
        return validation;
    }

    const cookies = parseCookies(ctx);
    /*if (cookies.user_tipo !== 'admin') {
        return {
            redirect: {
                permanent: false,
                destination: '/plantoes',
            },
        };
    }*/

    const admin = validateAdmin(ctx);
    if (admin) {return admin;}

    return { props: { validation: 'ok', tipo: cookies.user_tipo} }
}
export default AdicionaEscala;