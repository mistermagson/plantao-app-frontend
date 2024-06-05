import React, {useEffect, useState} from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {useRouter} from "next/router";
import {useCookies} from "react-cookie";
import {parseCookies} from "nookies";
import DashboardLayout from "../../../components/examples/LayoutContainers/DashboardLayout";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import {Alert} from "@mui/material";
import TextField from "@mui/material/TextField";
import {fetchEscalas, fetchEscalasDoJuiz} from "../../../utils/escalaUtils";
import {tipoUsuario, validateAdmin, validateAuthToken} from "../../../utils/sistemaUtils";
import Autocomplete from "@mui/material/Autocomplete";
import CalendarioAdm from "../calendarioPlantaoAdm";
import {removePlantonista, setPlantonista} from "../../../utils/plantaoUtils";
import MDButton from "../../../components/MDButton";
import Calendar from "../../../components/examples/Calendar";

//TODO DISPARO DE EMAIL PELO REGIONAL (ideia de que o juiz escolha os plantoes de todas as escalas de uma só vez)

function Plantoes({cabecalho, format_escalas, tipo}) {

    const [headers, setHeaders] = useState(cabecalho);

    const [escalas, setEscalas] = useState(format_escalas);
    const [juizes, setJuizes] = useState([]);
    const [plantoes, setPlantoes] = useState([]);

    const [escalaSelecionada, setEscalaSelecionada] = useState(null);
    const [juizSelecionado, setJuizSelecionado] = useState(null);

    const [preferenciaJuizId, setPreferenciaJuizId] = useState(null);

    const [error, setError] = useState(null);

    const router = useRouter();
    const [cookies, setCookies] = useCookies(["user_email"]);

    useEffect(() => {
        if (!cookies.user_email) {
            router.push("/");
        }
    }, [cookies, juizes, router]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const escalaUrl = params.get('escala');

        if(escalaUrl!==null) {
            const escalaObj = escalas.find((escala) => escala.id == escalaUrl);

            if (escalaObj) {
                setEscalaSelecionada(escalaObj);
                onChangeEscala(escalaObj);
            }
        }
    }, [cookies.user_email, escalas]);

    useEffect(() => {
        if(escalaSelecionada) {

            const escalaEncontrada = escalas.find(escala => escala.id === escalaSelecionada.id);

            if (escalaEncontrada) {
                setEscalaSelecionada(escalaEncontrada);
                setPlantoes(escalaEncontrada.plantaos.data.map(item => ({ id: item.id, ...item.attributes })));

                const participantesArray = escalaEncontrada.participantes.data.map((item) => ({id: item.id, ...item.attributes,}));
                setJuizes(participantesArray);

                if(juizSelecionado) {
                    const juizEncontrado = juizes.find(juiz => juiz.id === juizSelecionado.id);

                    if(juizEncontrado){
                        setJuizSelecionado(juizEncontrado);
                    }
                }
                if(escalaSelecionada.preferencia.data){
                    setPreferenciaJuizId(escalaSelecionada.preferencia.data.id);
                }
            }
        }
    }, [plantoes, cookies.user_email, escalaSelecionada, escalas, juizes, juizSelecionado]);

    const addPlantao =  async (idPlantoes) => {

        try {
            await setPlantonista(juizSelecionado.id, idPlantoes, headers)
        } catch (error) {
            console.error(error);
        }

        const atualizaEscalas = await fetchEscalasDoJuiz(cookies.user_email)
        await setEscalas(atualizaEscalas)
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

                setJuizSelecionado(null)
            }

        }catch (error) {
            setError(error.message);
        }

    }

    const handleLimparPlantonista = async (row) => {
        try {
            const idJuiz = juizSelecionado?.id;
            await removePlantonista(idJuiz, row, headers);
            const escalasAtualizadas = await fetchEscalasDoJuiz(cookies.user_email);
            await setEscalas(escalasAtualizadas);
        } catch (error) {
            console.error(error);
        }
    };


    const showJSON = async () => {
        console.log("juiz selecionado",format_escalas )
        console.log("cookies",cookies.user_email)
        console.log("setJuiz",juizes.find((juiz) => juiz.email === cookies.user_email))
    };

    return (
        <DashboardLayout userTipo={tipo}>
            {/*<MDButton size="small" onClick={showJSON} lcolor="info">Exibir</MDButton>*/}
            <MDBox p={2}>
                <MDTypography variant="h2">Gerenciar Plantões</MDTypography>
            </MDBox>
            <Card >
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
                            <Grid item xs={11} xl={3.5}>
                                <MDBox my={2}>
                                    <h5>Digite ou selecione o nome do juiz:</h5>
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
                            </Grid>
                            <Grid item xs={11} xl={4} style={{display: 'flex', alignItems: 'flex-end'}}>
                                {escalaSelecionada === null ? <Alert severity="warning">Escolha uma escala</Alert> : <></>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} xl={12} pb={4}>
                        {escalaSelecionada && (
                            <Grid px={4} mt={5}>
                                <MDTypography variant="h6"> Calendário de Plantões:</MDTypography>
                                <MDTypography variant="body2">
                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                    Clique no botão "Escolher Plantões" e selecione no calendário as datas desejadas, salve as escolhas e quando houver finalizado passe a vez.
                                </MDTypography>
                                <Grid mb={7.3} mt={1}>
                                    {plantoes?.length > 0 ? (
                                        <CalendarioAdm
                                            plantoes={plantoes}
                                            escala={escalaSelecionada}
                                            juiz={juizSelecionado}
                                            limpaPlantao={handleLimparPlantonista}
                                            addPlantao={addPlantao}
                                            nPlantoes={juizes}
                                            fetchData={fetchEscalasDoJuiz}
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
                                </Grid>
                            </Grid>

                        )}
                    </Grid>
                </Grid>
            </Card>
        </DashboardLayout>
    );
}

export async function getServerSideProps(ctx) {
    const validation = validateAuthToken(ctx);
    const cookies = parseCookies(ctx);

    if (validation) {
        return validation;
    }

    const admin = validateAdmin(ctx);
    if (admin) {return admin;}

    const h = {
        'Content-Type': 'application/json',
        //'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
    };

    const dados = await fetchEscalas();
    return { props: { cabecalho: h, format_escalas: dados, tipo: cookies.user_tipo } };
}
export default Plantoes;