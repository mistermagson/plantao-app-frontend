import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MuiPagination from '@mui/material/Pagination';
import TextField from "@mui/material/TextField";
import {GridPagination, gridPageCountSelector, useGridApiContext, useGridSelector} from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import MDButton from "../../components/MDButton";
import {fetchEscalas, passaPreferencia} from "../../utils/escalaUtils";
import { removePlantonista, setPlantonista } from "../../utils/plantaoUtils";
import CalendarioPlantao from "./calendarioPlantao";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import Calendar from "/examples/Calendar";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {useRouter} from "next/router";
import {useCookies} from "react-cookie";


function Plantoes({propescalas, cabecalho}) {

    const [headers, setHeaders] = useState(cabecalho);
    const serverSide = propescalas.data.map((item) => ({id: item.id, ...item.attributes,}))

    const escalasArray = Object.entries(serverSide).map(([id, escala]) => ({ id, ...escala }));
    const [juizes, setJuizes] = useState([]);
    const [escalas, setEscalas] = useState(serverSide);
    const [plantoes, setPlantoes] = useState([]);

    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [juizSelecionado, setJuizSelecionado] = useState(null);
    const [plantaoSelecionado, setPlantaoSelecionado] = useState([]);
    const [preferenciaJuizId, setPreferenciaJuizId] = useState(null);

    const [qtdPlantoes, setQtdPlantoes] = useState("")
    const [error, setError] = useState(null);
    const [block, setBlock] = useState(null);


    const [rowData, setRowData] = useState(null);
    const [attPlantao, setAttPlantao] = useState(true);

    const router = useRouter();
    const [cookies, setCookies] = useCookies(["user_email"]);

    useEffect(() => {
        if (!cookies.user_email) {
            router.push("/authentication/login");
        } else {
            console.log(juizes.find(juiz => juiz.email === cookies.user_email));
        }

    }, [cookies]);

    /*
    useEffect(() => {
        if(Array.isArray(escalas) && escalaSelecionada) {
            const escalaEncontrada = escalas.find(escala => escala.id == escalaSelecionada.id);

            if (escalaEncontrada) {
                setEscalaSelecionada(escalaEncontrada);
                setPlantoes(escalaEncontrada.plantaos.data.map(item => ({ id: item.id, ...item.attributes })));
                setPreferenciaJuizId(escalaSelecionada.preferencia.data?.id);

                const participantesArray = escalaEncontrada.participantes.data.map((item) => ({id: item.id, ...item.attributes,}));
                setJuizes(participantesArray);

                if(juizSelecionado) {
                    const juizEncontrado = juizes.find(juiz => juiz.id === juizSelecionado.id);

                    if(juizEncontrado){
                        setJuizSelecionado(juizEncontrado);
                    }
                }
            }
        }

        if(escalaSelecionada) {

            const escalaEncontrada = escalas.find(escala => escala.id === escalaSelecionada.id);

            if (escalaEncontrada) {
                setEscalaSelecionada(escalaEncontrada);
                setPlantoes(escalaEncontrada.plantaos.data.map(item => ({ id: item.id, ...item.attributes })));
                if(escalaSelecionada.preferencia.data){
                    setPreferenciaJuizId(escalaSelecionada.preferencia.data.id);
                }
                setJuizSelecionado(juizes.find((juiz) => juiz.email == cookies.user_email));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
*/


    useEffect(() => {
        //IRA RODAR UMA UNICA VEZ BUSCANDO NOME DA ESCALA NA URL
        if(block === null){

            const params = new URLSearchParams(window.location.search);
            const escalaUrl = params.get('escala');

            if(escalaUrl!==null) {
                const escalaObj = escalas.find((escala) => escala.descricao === escalaUrl);
                console.log('OBJETO', escalaObj);

                if (escalaObj) {
                    setEscalaSelecionada(escalaObj);
                    onChangeEscala(escalaObj);
                    setBlock('bloqueado');
                }
            }

            const escalasDoJuiz = filtrarEscalasPorJuiz(cookies.user_email, escalas);
            setEscalas(escalasDoJuiz);
        }

        if(escalaSelecionada) {

            const escalaEncontrada = escalas.find(escala => escala.id === escalaSelecionada.id);

            if (escalaEncontrada) {
                setEscalaSelecionada(escalaEncontrada);
                setPlantoes(escalaEncontrada.plantaos.data.map(item => ({ id: item.id, ...item.attributes })));
                if(escalaSelecionada.preferencia.data){
                    setPreferenciaJuizId(escalaSelecionada.preferencia.data.id);
                }
                setJuizSelecionado(juizes.find((juiz) => juiz.email == cookies.user_email));
                console.count("useeffect 2")
            }
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function filtrarEscalasPorJuiz(juizEmail, escalas) {
        //---- EXIBE APENAS AS ESCALAS QUE O JUIZ FAZ PARTE
        const escalasFiltradas = escalas.filter((escala) =>
            escala.participantes.data.some((participante) => participante.attributes.email == cookies.user_email)
        );
        return escalasFiltradas;
    }


    const addPlantao =  async (idPlantoes) => {
        try {
            console.log('handle submit param',juizSelecionado.id, idPlantoes, headers)
            await setPlantonista(juizSelecionado.id, idPlantoes, headers)

        } catch (error) {
            console.error(error);
        }

        const atualizaEscalas = await fetchEscalas(headers)
        await setEscalas(atualizaEscalas)
        setAttPlantao((prev) => !prev);
    };

    const onChangeEscala = (selected)=>{
        try{
            if(selected === null){
               setJuizes([]);
            }else{
                setJuizSelecionado(null);

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

    const showJSON = async () => {
        console.log("find escalas",escalas);
        console.log("some juiz", juizSelecionado)
        console.log("cookies",cookies.user_email);
    };

    const handleLimparPlantonista = async (row) => {
        try {
            const idJuiz = juizSelecionado?.id;
            await removePlantonista(idJuiz, row, headers);
            setPlantaoSelecionado([]);
            const escalasAtualizadas = await fetchEscalas(headers);
            await setEscalas(escalasAtualizadas);
        } catch (error) {
            console.error(error);
        }
    };

    const passaEscolha = async()=>{
        const antigo =  escalaSelecionada?.preferencia?.data;
        try{
            passaPreferencia(escalaSelecionada,headers);
            await setEscalas(fetchEscalas(headers))
        } catch (error) {
            console.error(error);
        }finally {
            const escalasAtualizadas = await fetchEscalas(headers)
            setEscalas(escalasAtualizadas);
        }
    }

    return (
        <DashboardLayout>
            <DashboardNavbar/>
           <MDButton size="small" onClick={showJSON} lcolor="info">Exibir</MDButton>
            <MDBox p={2}>
                <MDTypography variant="h2">Plantões</MDTypography>
            </MDBox>
            <Card>
                <Grid container>
                    <Grid item xs={12} xl={12}>
                        <Grid container spacing={2} pl={3}>
                            <Grid item xs={11} xl={3.5}>
                                <MDBox my={2}>
                                    <h5>Selecione a escala:</h5>
                                </MDBox>
                                <Autocomplete
                                    options={escalas}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={escala => escala.descricao}
                                    value={escalaSelecionada}
                                    onChange={(event, newValue) => {
                                        setEscalaSelecionada(newValue);
                                        onChangeEscala(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Escala"/>}
                                />
                            </Grid>
                            {/*<Grid item xs={11} xl={3.5}>
                                <MDBox my={2}>
                                    <h5>Digite e selecione seu nome:</h5>
                                </MDBox>
                                <Autocomplete
                                    options={!juizes ? [{label: "Carregando...", id: 0}] : juizes}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={juiz => juiz.nome}
                                    value={juizSelecionado}
                                    onChange={(event, newValue) => setJuizSelecionado(newValue)}
                                    renderInput={(params) => <TextField {...params} label="Nome do Juiz" required/>}
                                    renderOption={(props, option, {inputValue}) => {
                                        const preferenciaJuizId = escalaSelecionada?.preferencia?.data?.id;
                                        const isPreferencial = preferenciaJuizId === option.id;
                                        return (
                                            <li {...props}>
                                                {option.nome}
                                                {isPreferencial && (
                                                    <span style={{color: 'green', marginLeft: '4px'}}>
                                                        - Na escolha
                                                    </span>
                                                )}
                                            </li>
                                        );
                                    }}
                                />
                            </Grid>*/}
                            <Grid item xs={11} xl={4} style={{display: 'flex', alignItems: 'flex-end'}}>
                                {escalaSelecionada === null ? // IF
                                    <Alert severity="warning">Selecione uma escala</Alert>
                                    : // ELSE
                                    (escalaSelecionada.fechada ? // IF
                                            <Alert severity="error">Essa escala já foi fechada</Alert>
                                            : // ELSE
                                            (juizSelecionado !== null && juizSelecionado.id === preferenciaJuizId && juizSelecionado !== "" ?  // IF
                                                    <Alert severity="info">Escolha seus plantões</Alert>
                                                    : // ELSE
                                                    (juizSelecionado !== null && juizSelecionado.id !== preferenciaJuizId ?  // IF
                                                            <Alert severity="error">Aguarde sua vez para escolher os
                                                                plantões</Alert>
                                                            : // ELSE
                                                            <Alert severity="warning">Selecione um magistrado</Alert>
                                                    )
                                            )
                                    )
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} xl={12} pb={4}>
                        {escalaSelecionada && (
                            <MDBox px={4} mt={5}>
                                <MDTypography variant="h6"> Calendário de Plantões:</MDTypography>
                                <MDTypography variant="body2">
                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                    Clique no botão "Escolher Plantões" e selecione no calendário as datas desejadas, salve as escolhas e quando houver finalizado passe a vez.
                                </MDTypography>

                                {plantoes?.length > 0 ? (
                                    <CalendarioPlantao
                                        plantoes={plantoes}
                                        escala={escalaSelecionada}
                                        juiz={juizSelecionado}
                                        setPlantao={setPlantaoSelecionado}
                                        limpaPlantao={handleLimparPlantonista}
                                        passarEscolha={passaEscolha}
                                        addPlantao={addPlantao}
                                        nPlantoes={juizes}
                                        fetchData={showJSON}
                                    />
                                ) : (
                                    <Calendar
                                        selectable="true"
                                        initialView="dayGridMonth"
                                        editable="true"
                                        fixedWeekCount="false"
                                        showNonCurrentDates={"false"}
                                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                        locale="pt-br"
                                        events={[]}
                                    />
                                )
                                }
                                <MDBox marginBottom={2} display="flex" justifyContent="flex-end">
                                    {plantaoSelecionado.length > 0 && (
                                        <MDButton
                                            color="success"
                                            size="small"
                                            onClick={() => addPlantao()}
                                            sx={{marginRight: '10px'}}>
                                            Adicionar
                                        </MDButton>
                                    )}
                                </MDBox>
                            </MDBox>
                        )}
                    </Grid>
                </Grid>
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