import React, {useEffect, useState} from 'react';
import Calendar from "/components/examples/Calendar";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDButton from "../../../components/MDButton";
import SaveIcon from "@mui/icons-material/Save";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import {fetchEscalas, fetchEscalasDoJuiz} from "../../../utils/escalaUtils";
import CancelIcon from '@mui/icons-material/Cancel';
import {removePlantao} from "../../../utils/plantaoUtils";
import MDTypography from "../../../components/MDTypography";
import Divider from "@mui/material/Divider";

function CalendarioAdm({plantoes, escala, juiz, limpaPlantao, addPlantao, fetchData, passarEscolha}) {

    const formatarPlantoes = (plantao) =>{

        const plantonista = plantao.plantonista;
        const color = plantonista && plantonista.data.length > 0 ? (juiz?.id == plantao?.plantonista?.data[0]?.id ? "#4CAF50" : "#1A73E8") : "#7B809A";
        const title = plantonista && plantonista.data.length > 0 && plantonista.data[0].attributes.nome
            ? plantonista.data[0].attributes.nome : "Vazio";

        return {
            title,
            date: plantao.data,
            color,
            id: plantao.id,
            plantonistaId: plantao?.plantonista?.data[0]?.id
        };
    }

    //TODO - Impedir o que uma const de Calendar realize o Map em sua declaração --------
    //--warning maximum update depth exceeded--
    const attEvent = plantoes?.map((plantao) => formatarPlantoes(plantao)) || [];
    const [eventos, setEventos] = useState(plantoes?.map((plantao) => formatarPlantoes(plantao))) || [];
    //-----------------------------

    const [addEvent, setAddEvent] = useState([]);
    const [remEvent, setRemEvent] = useState([]);
    const [clickHabilitado, setClickHabilitado] = useState(false);

    const [passar, setPassar] = useState(false);
    const [sair, setSair] = useState(false);
    const [alerta, setAlerta] = useState(false);
    const [abrir, setAbrir] = useState(false);
    const [salvar, setSalvar] = useState(false);
    const [aguarde, setAguarde] = useState(false);
    const [cheio, setCheio] = useState(false);
    const [deletarPlantao, setDeletarPlantao] = useState(false);

    const [accordion1Expanded, setAccordion1Expanded] = useState(false);
    const [accordion2Expanded, setAccordion2Expanded] = useState(false);

    const [linhaSelecionada, setLinhaSelecionada] = useState([]);
    const[qtdEscolhida, setQtdEscolhida] = useState(0)

    useEffect(()=>{
        if(plantoes && plantoes.length > 0 && escala !== undefined && escala !== null && juiz !== null){
            setQtdEscolhida(plantoes?.filter(plantao => plantao?.plantonista?.data[0]?.id == juiz?.id).length);
        }
    },[eventos, escala, plantoes, juiz])

    if(plantoes && escala){

        const classNames = ['1jefCG', '2jefCG', '1civilCG', '2civilCG', '3crimeCG', '4civilCG', '5crimeCG', '6fiscalCG'];
        const classColors = {
            '1jefCG': '#73e8e8',    // Amarelo mais transparente
            '2jefCG': '#f31c0d',    // Verde mais transparente
            '1civilCG': '#0e4cc2',  // Vermelho mais transparente
            '2civilCG': '#f77001',  // Laranja mais transparente
            '3crimeCG': '#7f05ad', // Roxo mais transparente
            '4civilCG': '#13bb0f',   // Azul mais transparente
            '5crimeCG': '#fff304',  // Rosa mais transparente
            '6fiscalCG': '#721808', // Amarelo mais transparente
        };
        const classLegend = {
            '1jefCG': '1ª Vara Gabinete do JEF',
            '2jefCG': '2ª Vara Gabinete do JEF',
            '1civilCG': '1ª Vara Cível de Campo Grande',
            '2civilCG': '2ª Vara Cível de Campo Grande',
            '3crimeCG': '3ª Vara Criminal de Campo Grande',
            '4civilCG': '4ª Vara Cível de Campo Grande',
            '5crimeCG': '5ª Vara Criminal de Campo Grande',
            '6fiscalCG': '6ª Vara Fiscal de Campo Grande',
        };
        const dateArrays = [];

        // CRIA BACKGROUND EVENTS de cada vara--------------|v
        function createBgEvents(dateArrays) {

            const startDate = new Date('2024-01-07');
            const endDate = new Date('2024-12-20'); // Data de término em 31 de dezembro de 2023
            const startingVara = '2civilCG';

            let currentDate = startDate;
            let startingVaraIndex = classNames.indexOf(startingVara);
            let intervaloDias;  // Defina intervaloDias no escopo exterior


            function createDateArray(dataInicio, className, startingVara, intervaloDias) {

                let dataFim = new Date(dataInicio);
                // Aplique o intervalo de dias apenas no primeiro array
                if (intervaloDias && dateArrays.length === 0) {
                    dataFim.setDate(dataFim.getDate() + intervaloDias);
                } else {
                    dataFim.setDate(dataFim.getDate() + 14);
                }

                // Se a data de término ultrapassar a endDate, ajuste-a para coincidir com a endDate
                if (dataFim > endDate) {
                    dataFim = endDate;
                }

                return {
                    start: dataInicio.toISOString().split('T')[0],
                    end: dataFim.toISOString().split('T')[0],
                    display: 'background',
                    color: classColors[className],
                    className: className,
                };
            }


            while (currentDate < endDate) {
                for (let i = startingVaraIndex; i < classNames.length; i++) {
                    const className = classNames[i];
                    if (currentDate < endDate) {
                        // Aplique o intervalo de dias apenas no primeiro array
                        intervaloDias = dateArrays.length === 0 ? 6 : undefined;
                        dateArrays.push(createDateArray(currentDate, className, startingVara, intervaloDias));
                    }
                    // Ajuste currentDate para o final do intervalo de dias
                    currentDate = new Date(currentDate);
                    currentDate.setDate(currentDate.getDate() + (intervaloDias || 14));
                }

                // Reinicie o loop a partir da primeira vara se necessário
                startingVaraIndex = 0;
            }
        }

        createBgEvents(dateArrays);
        //--------------------------------------------------|^

        const handleEventClick = (info) => {

            if (!juiz) {
                setAlerta(true);
            } else {
                const clickedEvent = info.event;

                if (clickedEvent.backgroundColor === '#7B809A' && !addEvent.find((event) => event.id == clickedEvent.id)) {
                    const customEvent = {
                        title: clickedEvent.title,
                        date: clickedEvent.start.toISOString().split('T')[0],
                        color: "#fb8c00",
                        id: parseInt(clickedEvent.id),
                    };

                    setAddEvent((prevAddEvent) => [...prevAddEvent, customEvent]);
                    setEventos((prevEventos) => prevEventos.filter((evento) => evento.id != clickedEvent.id));


                } else if (clickedEvent.backgroundColor === '#4CAF50' && !remEvent.find((event) => event.id === clickedEvent.id)) {

                    if (clickedEvent.extendedProps.plantonistaId == juiz.id) {
                        const customEvent = {
                            title: clickedEvent.title,
                            date: clickedEvent.start.toISOString().split('T')[0],
                            color: "#F44335",
                            id: parseInt(clickedEvent.id),
                            plantonistaId: juiz.id
                        };

                        setRemEvent((prevRemEvent) => [...prevRemEvent, customEvent]);
                        setEventos((prevEventos) => prevEventos.filter((evento) => evento.id != clickedEvent.id));
                    }

                } else if (clickedEvent.backgroundColor === '#1A73E8') {
                    setAbrir(true);
                } else if (!eventos.find((event) => event.id == clickedEvent.id)) {

                    const controlId = clickedEvent.extendedProps.plantonistaId;

                    const colorMapping = {
                        '#fb8c00': '#7B809A',
                        '#F44335': '#4CAF50',
                        // Adicione mais cores conforme necessário
                    };

                    const backgroundColor = clickedEvent.backgroundColor;
                    const customColor = colorMapping[backgroundColor];

                    if (customColor) {
                        const customEvent = {
                            title: clickedEvent.title,
                            date: clickedEvent.start.toISOString().split('T')[0],
                            color: customColor,
                            id: parseInt(clickedEvent.id),
                            plantonistaId: controlId,
                        };

                        setEventos((prevEventos) => [...prevEventos, customEvent]);
                    }

                    const novosRem = remEvent.filter((evento) => evento.id != clickedEvent.id);
                    setRemEvent(novosRem);

                    const novosAdd = addEvent.filter((evento) => evento.id != clickedEvent.id);
                    setAddEvent(novosAdd);
                }
            }

        };

        const toggleClick = () => {
            if (!juiz) {
                setAlerta(true);
            } else {
                setClickHabilitado((prev) => !prev); // Inverte o estado atual
            }
        };

        const showJSON = () => {
            console.log("addevent", addEvent, "rem", remEvent)
            console.log("remevent", checarLimite(plantaoTabela, addEvent, remEvent, escala.plantoesPorJuiz ))

        };

        const checarLimite = (atuais, adicionar, remover, max) =>{
            const total = atuais?.filter(plantao => plantao?.plantonistaId == juiz?.id).length + adicionar.length - remover.length;
            return total <= max;
        }

        const salvarAlteracoes = async () => {
            if(checarLimite(plantaoTabela, addEvent, remEvent, escala.plantoesPorJuiz )){
                const extractDates = (events) => {
                    return events?.map(event => event.id);
                };

                if (addEvent.length > 0) {
                    const datesArray = extractDates(addEvent);
                    addPlantao(datesArray);
                    setAddEvent([])
                }

                if (remEvent.length > 0) {
                    const remArray = extractDates(remEvent);
                    limpaPlantao(remArray)
                    console.warn('removendo...', remArray);
                    setRemEvent([]);
                }
            }
            else{
                setAddEvent([])
                setRemEvent([]);
                console.log('LIMITE DE PLANTOES ATINGIDO')
                setCheio(true);
            }
            fetchData();
            setEventos(attEvent)
        };

        const handleClose = () => {
            setAbrir(false);
            setSair(false);
            setAlerta(false);
            setSalvar(false);
            setAguarde(false);
            setPassar(false);
            setDeletarPlantao(false);
            setCheio(false);

        };

        const handleAccordion1Change = (event, isExpanded) => {
            setAccordion1Expanded(isExpanded);
        };
        const handleAccordion2Change = (event, isExpanded) => {
            setAccordion2Expanded(isExpanded);
        };
        const isDateInRange = (date, start, end) => {
            return date >= start && date <= end;
        };

        const plantaoTabela = attEvent.map(item1 => {
            const date1 = new Date(item1.date);

            // Encontrando a vara para o objeto1
            const vara = dateArrays.find(item2 => {
                const start = new Date(item2.start);
                const end = new Date(item2.end);

                // Verificando se a data de objeto1 está dentro do intervalo de start e end de objeto2
                return isDateInRange(date1, start, end);
            });

            // Criando um novo objeto com os atributos originais de objeto1 e a vara encontrada
            return {
                ...item1,
                vara: vara ? vara.className : null // Adiciona a vara se encontrada, senão null
            };
        });


        const formatDate = (params) => {
            if(params){
                const dateParts = params.split('-');
                return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            }
        };

        return (
            <>
                <div>
                    <Dialog open={alerta} onClose={handleClose}>
                        <DialogTitle>
                            <ReportProblemRoundedIcon/>
                        </DialogTitle>
                        <DialogContent>
                            Selecione um magistrado
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Ok</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <Dialog open={cheio} onClose={handleClose}>
                        <DialogTitle>
                            <ReportProblemRoundedIcon/> Limite Atingido
                        </DialogTitle>
                        <DialogContent>
                            Por favor, escolha no máximo {escala.plantoesPorJuiz} plantões!
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Ok</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <Dialog open={aguarde} onClose={handleClose}>
                        <DialogTitle>
                            <ReportProblemRoundedIcon/>
                        </DialogTitle>
                        <DialogContent>
                            Aguarde sua vez para escolher os plantões
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Ok</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <Dialog open={abrir} onClose={handleClose}>
                        <DialogTitle>
                            <ReportProblemRoundedIcon/>
                        </DialogTitle>
                        <DialogContent>
                            O plantão já pertencente a outro magistrado
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Ok</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <Dialog open={salvar} onClose={handleClose}>
                        <DialogTitle>
                            <ReportProblemRoundedIcon/>
                        </DialogTitle>
                        <DialogContent>
                            O plantão já pertencente a outro magistrado
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Ok</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <Dialog open={passar} onClose={handleClose}>
                        <DialogTitle>Passar a Vez</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Você tem certeza que deseja encerrar sua escolha?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                handleClose();
                                passarEscolha();
                                fetchData();
                            }}>Sim</Button>
                            <Button onClick={handleClose}>Não</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <Dialog open={deletarPlantao} onClose={handleClose}>
                        <DialogTitle>Sair do Plantao</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {escala ? (
                                    <>Deseja sair do plantão do dia {' '}
                                        <MDTypography component="span" variant="H5" style={{fontWeight: 'bold'}}>
                                            {formatDate(linhaSelecionada.date)}
                                        </MDTypography>{' ?'}
                                    </>
                                ) : (
                                    'O plantão selecionada não está disponível.'
                                )}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <MDButton onClick={() => {
                                limpaPlantao(linhaSelecionada.id);
                                handleClose();
                                limpaPlantao(linhaSelecionada.id);
                            }}>Sim</MDButton>
                            <MDButton onClick={handleClose}>Não</MDButton>
                        </DialogActions>
                    </Dialog>
                </div>

                <Grid container spacing={2}>
                    <Grid item xs={12} xl={8} style={{height: "550px"}}>
                        {clickHabilitado ? (
                            <Calendar
                                selectable="true"
                                initialView="dayGridMonth"
                                initialDate={plantoes?.[0]?.data}
                                events={[...dateArrays, ...dateArrays, ...eventos, ...addEvent, ...remEvent]}//2x dateArrays para que a cor ficasse mais contrastada
                                editable="true"
                                duration={{days: 4}}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                eventClick={handleEventClick} // Use a função criada para lidar com o clique no evento
                                locale="pt-br"
                            />
                        ) : (
                            <Calendar
                                initialView="dayGridMonth"
                                initialDate={plantoes?.[0]?.data}
                                events={[...dateArrays, ...dateArrays, ...attEvent]} //2x dateArrays para que a cor ficasse mais contrastada
                                duration={{days: 4}}
                                plugins={[dayGridPlugin, timeGridPlugin]}
                                locale="pt-br"
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} xl={3.8}>
                        <Card>
                            {juiz !== null && (
                                <>
                                    {/*<MDButton size="large" onClick={showJSON}>Exibir</MDButton>*/}
                                    <MDButton
                                        size="medium"
                                        variant={ !clickHabilitado || addEvent.length > 0 || remEvent.length > 0 ? 'gradient' : 'text'}
                                        color={clickHabilitado ? 'success' : 'info'}
                                        onClick={() => {
                                            toggleClick();
                                            salvarAlteracoes();
                                        }}
                                    >
                                        {clickHabilitado ? 'Salvar' : 'Escolher Plantões'}
                                        {clickHabilitado ? <SaveIcon style={{marginLeft: '8px'}}/> : <EditRoundedIcon style={{marginLeft: '8px'}}/>}
                                    </MDButton>
                                    <Divider/>
                                    <Accordion style={{boxShadow: "none"}} expanded={accordion1Expanded}
                                               onChange={handleAccordion1Change}>
                                        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                                            {accordion1Expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                            <h5 style={{color: "#344767"}}>Plantões do juiz {juiz.nome}</h5>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <DataGrid
                                                density="compact"

                                                editMode="row"
                                                disableColumnMenu
                                                sx={{fontSize: "16px", fontWeight: "regular", color: "dark", border: 0}}
                                                pageSizeOptions={[5, 10, 20, 100]}
                                                initialState={{
                                                    pagination: {paginationModel: {pageSize: 100}},
                                                    sorting: {sortModel: [{field: 'data', sort: 'asc'}],},
                                                }}
                                                rows={plantaoTabela?.filter(plantao => plantao?.plantonistaId == juiz?.id)}
                                                columns=
                                                    {[{
                                                        field: 'date',
                                                        headerName: 'Data',
                                                        width: 100,
                                                        sortable: false,
                                                        renderCell: (params) => {
                                                            const dateParts = params.value.split('-');
                                                            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                                                            return <span>{formattedDate}</span>;
                                                        },
                                                    },
                                                        {
                                                            field: 'vara',
                                                            headerName: 'Vara',
                                                            flex: 1,
                                                            sortable: false,
                                                            renderCell: (params) => {
                                                                return <span>{classLegend[params.value]}</span>

                                                            },
                                                        },
                                                        {
                                                            field: 'id',
                                                            headerName: '',
                                                            width: 40,
                                                            align: "center",
                                                            renderCell: (params) => (
                                                                <GridActionsCellItem
                                                                    icon={<CancelIcon color="error"/>}
                                                                    label="Delete"
                                                                    onClick={() => {
                                                                        setLinhaSelecionada(params.row);
                                                                        setDeletarPlantao(true)
                                                                    }}
                                                                />
                                                            ),
                                                        }
                                                    ]}
                                                disableColumnFilter
                                                disableColumnSelector
                                                disableDensitySelector
                                                disableRowSelectionOnClick
                                                slotProps={{toolbar: {showQuickFilter: true}}}
                                                sortModel={[{field: 'date', sort: 'asc',}]}
                                                hideExport={true}
                                                hideFooterPagination={true}
                                                hideFooterRowCount={true}
                                                hideFooterSelectedRowCount={true}
                                            />
                                            <Alert
                                                variant="outlined"
                                                severity="info"
                                                style={{paddingLeft: '20px', marginTop: '-30px'}}>
                                               {qtdEscolhida} plantões escolhidos
                                            </Alert>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion style={{boxShadow: "none"}} expanded={accordion2Expanded}
                                               onChange={handleAccordion2Change}>
                                        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                                            {accordion2Expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                            <h5 style={{color: "#344767"}}>Legenda do Calendário</h5>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {Object.keys(classColors)?.map((className) => (
                                                <div key={className}
                                                     style={{display: 'flex', alignItems: 'center', margin: ' 0'}}>
                                                    <div
                                                        style={{
                                                            width: '15px',
                                                            height: '15px',
                                                            backgroundColor: classColors[className],
                                                            marginRight: '8px',
                                                            border: '1px solid #000',
                                                        }}
                                                    ></div>
                                                    <div style={{fontSize: '14px'}}>{classLegend[className]}</div>
                                                </div>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                </>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </>
        );
    } else {
        return <></>
    }
}

export default CalendarioAdm;
