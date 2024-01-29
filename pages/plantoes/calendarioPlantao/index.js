import React, {useEffect, useRef, useState} from 'react';
import Calendar from "/examples/Calendar";
import MDBadgeDot from "../../../components/MDBadgeDot"; // needed for dayClick
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDButton from "../../../components/MDButton";
import SaveIcon from "@mui/icons-material/Save";
import calendar from "../../../examples/Calendar";


function Calendario({ plantoes, escala, juizId, setPlantao, limpaPlantao, addPlantao}) {
    const [clickHabilitado, setClickHabilitado] = useState(true);

    const classNames = ['1jefCG', '2jefCG', '1civilCG', '2civilCG', '3crimeCG', '4civilCG', '5crimeCG', '6fiscalCG'];

    const classColors = {
        '1jefCG': '#73e8e8',    // Amarelo mais transparente
        '2jefCG': '#f31c0d',    // Verde mais transparente
        '1civilCG': '#0e4cc2',  // Vermelho mais transparente
        '2civilCG': '#f74201',  // Laranja mais transparente
        '3crimeCG': '#7f05ad', // Roxo mais transparente
        '4civilCG': '#13bb0f',   // Azul mais transparente
        '5crimeCG': '#fff304',  // Rosa mais transparente
        '6fiscalCG': '#721808', // Amarelo mais transparente
    };

    const classLegend = {
        '1jefCG': '1ª vara gabinete do JEF',
        '2jefCG': '2ª vara gabinete do JEF',
        '1civilCG': '1ª vara cível de Campo Grande',
        '2civilCG': '2ª vara cível de Campo Grande',
        '3crimeCG': '3ª vara criminal de Campo Grande',
        '4civilCG': '4ª vara cível de Campo Grande',
        '5crimeCG': '5ª vara criminal de Campo Grande',
        '6fiscalCG': '6ª vara fiscal de Campo Grande',
    };

    const dateArrays = [];

    // CRIA BACKGROUND EVENTS de cada vara
    function createBgEvents(dateArrays){
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
    if (plantoes?.length > 0){

        const attEvent = plantoes.map((plantao) => {
            const plantonista = plantao.plantonista;

            const title = plantonista && plantonista.data.length > 0 && plantonista.data[0].attributes.nome
                ? plantonista.data[0].attributes.nome
                : "Vazio";

            const color = plantonista && plantonista.data.length > 0 ? "#1A73E8" : "#7B809A";

            return {
                title,
                date: plantao.data,
                color,
                id: plantao.id,
            };

        })
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [eventos, setEventos] = useState( plantoes.map((plantao) => {
            const plantonista = plantao.plantonista;

            const title = plantonista && plantonista.data.length > 0 && plantonista.data[0].attributes.nome
                ? plantonista.data[0].attributes.nome
                : "Vazio";

            const color = plantonista && plantonista.data.length > 0 ? "#1A73E8" : "#7B809A";

            return {
                title,
                date: plantao.data,
                color,
                id: plantao.id,
            };

        }));
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [addEvent, setAddEvent] = useState([]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [remEvent, setRemEvent] = useState([]);

        const handleEventClick = (info) => {

            if (!clickHabilitado) {
                return; // Retorna se o clique não estiver habilitado
            }
            const clickedEvent = info.event;

            if (clickedEvent.backgroundColor === '#7B809A' && !addEvent.find((event) => event.id == clickedEvent.id)) {
                const customEvent = {
                    title: clickedEvent.title,
                    date: clickedEvent.start.toISOString().split('T')[0],
                    color: "#4CAF50",
                    id: parseInt(clickedEvent.id),
                };

                setAddEvent((prevAddEvent) => [...prevAddEvent, customEvent]);
                setEventos((prevEventos) => prevEventos.filter((evento) => evento.id != clickedEvent.id));
            }

            else if (clickedEvent.backgroundColor === '#1A73E8' && !remEvent.find((event) => event.id === clickedEvent.id)) {
                const customEvent = {
                    title: clickedEvent.title,
                    date: clickedEvent.start.toISOString().split('T')[0],
                    color: "#F44335",
                    id: parseInt(clickedEvent.id),
                };

                setRemEvent((prevRemEvent) => [...prevRemEvent, customEvent]);
                setEventos((prevEventos) => prevEventos.filter((evento) => evento.id != clickedEvent.id));
                //limpaPlantao(clickedEvent.id);
            }

            else if (!eventos.find((event) => event.id == clickedEvent.id)) {

                const colorMapping = {
                    '#4CAF50': '#7B809A',
                    '#F44335': '#1A73E8',
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
                    };

                    setEventos((prevEventos) => [...prevEventos, customEvent]);
                }

                const novosRem = remEvent.filter((evento) => evento.id != clickedEvent.id);
                setRemEvent(novosRem);

                const novosAdd = addEvent.filter((evento) => evento.id != clickedEvent.id);
                setAddEvent(novosAdd);
            }
        };

        const toggleClick = () => {
            setClickHabilitado((prev) => !prev); // Inverte o estado atual
        };

        const showJSON = () => {
            setEventos(attEvent)
            setAddEvent([])
            setRemEvent([])

            /*console.log("add", addEvent)
            console.log("delete", remEvent)
            console.log("eventos", eventos)
            console.log("eventos atualizados", eventos)*/
            setEventos(attEvent)


        };
        const salvarAlteracoes = async () => {

            const extractDates = (events) => {
                console.log(events)
                return events.map(event => event.id);
            };

            if(addEvent.length>0){
                const datesArray = extractDates(addEvent);
                addPlantao(datesArray);
                setAddEvent([])

            }

            if(remEvent.length>0){
                const remArray = extractDates(remEvent);
                limpaPlantao(remArray)
                console.warn('removendo...',);
                console.log(remArray)
                setRemEvent([]);


            }


            setEventos(attEvent)
            setAddEvent([])
            setRemEvent([])
            setTimeout(() => {
                showJSON()
            }, 5000);


        };


        if (!clickHabilitado) {
            return(
                <Grid container spacing={1}>
                <Grid item xs={12} xl={8}>
                <Calendar
                    selectable="true"
                    initialView="dayGridMonth"
                    initialDate={plantoes[0]?.data}
                    events={[...dateArrays, ...dateArrays, ...attEvent]}
                    editable="true"
                    duration={{days: 4}}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    eventClick={handleEventClick} // Use a função criada para lidar com o clique no evento
                    locale="pt-br"
                />
                </Grid>
            <Grid item xs={12} xl={4}>
                <Card>
                    <MDButton onClick={showJSON}>Exibir</MDButton>
                    <MDButton onClick={salvarAlteracoes}>Salvar
                        <SaveIcon style={{marginLeft: '8px'}}/>
                    </MDButton>
                    <MDButton onClick={toggleClick}>
                        {clickHabilitado ? 'Desabilitar Clique' : 'Habilitar Clique'}
                    </MDButton>
                </Card>
            </Grid>
            <Grid container spacing={0} ml={7} mt={2}>
                <Grid item xs={12} sm={6} lg={6} md={6} xl={6}>
                    {Object.keys(classColors).slice(0, Math.ceil(Object.keys(classColors).length / 2)).map((className) => (
                        <div key={className} style={{display: 'flex', alignItems: 'center', margin: ' 0'}}>
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
                </Grid>
                <Grid item xs={12} sm={6} lg={6} md={6} xl={6}>
                    {Object.keys(classColors).slice(Math.ceil(Object.keys(classColors).length / 2)).map((className) => (
                        <div key={className} style={{display: 'flex', alignItems: 'center', margin: ' 0'}}>
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
                </Grid>
            </Grid>
        </Grid>
            ); // Retorna se o clique não estiver habilitado
        }
        else{return (
            <Grid container spacing={1}>
                <Grid item xs={12} xl={8}>
                    <Calendar
                        selectable="true"
                        initialView="dayGridMonth"
                        initialDate={plantoes[0]?.data}
                        events={[...dateArrays, ...dateArrays, ...eventos, ...addEvent, ...remEvent]}
                        editable="true"
                        duration={{days: 4}}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        eventClick={handleEventClick} // Use a função criada para lidar com o clique no evento
                        locale="pt-br"

                    />
                </Grid>
                <Grid item xs={12} xl={4}>
                    <Card>
                        <MDButton onClick={showJSON}>Exibir</MDButton>
                        <MDButton onClick={salvarAlteracoes}>
                            Salvar
                            <SaveIcon style={{marginLeft: '8px'}}/>
                        </MDButton>
                        <MDButton onClick={toggleClick}>
                            {clickHabilitado ? 'Desabilitar Clique' : 'Habilitar Clique'}
                        </MDButton>
                    </Card>
                </Grid>
                <Grid container spacing={0} ml={7} mt={2}>
                    <Grid item xs={12} sm={6} lg={6} md={6} xl={6}>
                        {Object.keys(classColors).slice(0, Math.ceil(Object.keys(classColors).length / 2)).map((className) => (
                            <div key={className} style={{display: 'flex', alignItems: 'center', margin: ' 0'}}>
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
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6} md={6} xl={6}>
                        {Object.keys(classColors).slice(Math.ceil(Object.keys(classColors).length / 2)).map((className) => (
                            <div key={className} style={{display: 'flex', alignItems: 'center', margin: ' 0'}}>
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
                    </Grid>
                </Grid>
            </Grid>
        );}
    } else {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} xl={12}>
                    <Calendar
                        fullHeight
                        selectable="true"
                        initialView="dayGridMonth"
                        editable="true"
                        fixedWeekCount="false"
                        showNonCurrentDates={"false"}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        locale="pt-br"
                        events={[...dateArrays]}
                    />
                </Grid>
            </Grid>
        );

    }
}

export default Calendario;
