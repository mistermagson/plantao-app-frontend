import React, {useEffect, useRef, useState} from 'react';
import Calendar from "/components/examples/Calendar";
import MDBadgeDot from "../../../components/MDBadgeDot"; // needed for dayClick
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";


function Calendario({ plantoes, escala }) {

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
    const dateArrays2024 = [];
    const dateArrays2025 = [];
    const datasRecesso = [
        {
            start: '2024-12-20',
            end: '2024-12-22',
            display: 'background',
            className: '2civilCG',
            color: '#f77001'
        },
        {
            start: '2024-12-22',
            end: '2024-12-24',
            display: 'background',
            className: '3crimeCG',
            color: '#7f05ad'
        },
        {
            start: '2024-12-24',
            end: '2024-12-26',
            display: 'background',
            className: '4civilCG',
            color: '#13bb0f'
        },
        {
            start: '2024-12-26',
            end: '2024-12-28',
            display: 'background',
            className: '5crimeCG',
            color: '#fff304'
        },
        {
            start: '2024-12-28',
            end: '2024-12-30',
            display: 'background',
            className: '6fiscalCG',
            color: '#721808'
        },
        {
            start: '2024-12-30',
            end: '2025-01-01',
            display: 'background',
            className: '1jefCG',
            color: '#73e8e8'
        },
        {
            start: '2025-01-01',
            end: '2025-01-04',
            display: 'background',
            className: '2jefCG',
            color: '#f31c0d'
        },
        {
            start: '2025-01-04',
            end: '2025-01-07',
            display: 'background',
            className: '1civilCG',
            color: '#0e4cc2'
        },

    ]

    // CRIA BACKGROUND EVENTS de cada vara--------------|v

    function criarEvento(dataAtual, fimEscala, nomeVara, startingVara, duracaoEscala) {

        let dataFim = new Date(dataAtual);
        // Aplique o intervalo de dias apenas no primeiro array
        dataFim.setDate(dataFim.getDate() + duracaoEscala);

        // Se a data de término ultrapassar a endDate, ajuste-a para coincidir com a endDate
        if (dataFim > fimEscala) {
            dataFim = fimEscala;
        }

        return {
            start: dataAtual.toISOString().split('T')[0],
            end: dataFim.toISOString().split('T')[0],
            display: 'background',
            color: classColors[nomeVara],
            className: nomeVara,
        };
    }

    function criarArrayEventos(arrayEventos, inicioEscalaData, fimEscalaData, varaInicial, plantoesRestantes) {

        let dataAtual = inicioEscalaData;
        let indexVaraInicial = classNames.indexOf(varaInicial);
        let duracaoEscala;


        while (dataAtual < fimEscalaData) {

            //repete o loop para cada vara
            for (let i = indexVaraInicial; i < classNames.length; i++) {

                const nomeVara = classNames[i];

                if (dataAtual < fimEscalaData) {
                    // Aplique o intervalo de dias apenas no primeiro array
                    duracaoEscala = arrayEventos.length === 0 ? plantoesRestantes : 14;
                    arrayEventos.push(criarEvento(dataAtual, fimEscalaData, nomeVara, varaInicial, duracaoEscala));
                }

                // Ajuste dataAtual para o final do intervalo de dias
                dataAtual = new Date(dataAtual);
                dataAtual.setDate(dataAtual.getDate() + (duracaoEscala));
            }

            // Reinicie o loop a partir da primeira vara se necessário
            indexVaraInicial = 0;
        }
    }

    const inicioEscalaData2024 = new Date('2024-01-07'); //data de inicio da escala
    const fimEscalaData2024 = new Date('2024-12-20'); //data de inicio do recesso
    const varaInicial2024 = '2civilCG'; // vara que irá a iniciar a escala esse ano
    const plantoesRestantes2024 = 6 // quantidade de plantões restantes do ano anterior

    criarArrayEventos(dateArrays2024, inicioEscalaData2024, fimEscalaData2024, varaInicial2024, plantoesRestantes2024);

    const inicioEscalaData2025 = new Date('2025-01-07'); //data de inicio da escala
    const fimEscalaData2025 = new Date('2025-12-20'); //data de inicio do recesso
    const varaInicial2025 = '3crimeCG'; // vara que irá a iniciar a escala esse ano
    const plantoesRestantes2025 = 11 // quantidade de plantões restantes do ano anterior

    criarArrayEventos(dateArrays2025, inicioEscalaData2025, fimEscalaData2025, varaInicial2025, plantoesRestantes2025);

    const dateArrays = [...dateArrays2024, ...dateArrays2025];

    //--------------------------------------------------|^



    if (plantoes?.length > 0){
        const eventos = plantoes.map((plantao) => {
            const plantonista = plantao.plantonista;

            const title = plantonista && plantonista.data.length > 0 && plantonista.data[0].attributes.nome
                ? plantonista.data[0].attributes.nome.split(' ')[0]
                : "Vazio";

            const color = plantonista && plantonista.data.length > 0 ? "#1A73E8" : "gray";

            return {
                title,
                date: plantao.data,
                color,
                id: plantao.id
            };

        });

        return (
            <Grid container spacing={3}>
                <Grid item xs={12} xl={12}>
                <Calendar
                    selectable="true"
                    initialView="dayGridMonth"
                    initialDate={plantoes[0]?.data}
                    events={[...dateArrays,...eventos, ...datasRecesso]}
                    editable="true"
                    duration={{days: 4}}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    eventClick={ function(info) {
                        console.log('Event: ' + info.event.title);

                }}
                    locale="pt-br"

                />
                </Grid>
                <Grid container spacing={1} ml={7} mt={2} >
                    <Grid item xs={12} xl={5}>
                        {Object.keys(classColors).slice(0, Math.ceil(Object.keys(classColors).length / 2)).map((className) => (
                            <div key={className} style={{ display: 'flex', alignItems: 'center', margin: ' 0' }}>
                                <div
                                    style={{
                                        width: '15px',
                                        height: '15px',
                                        backgroundColor: classColors[className],
                                        marginRight: '8px',
                                        border: '1px solid #000',
                                    }}
                                ></div>
                                <div style={{ fontSize: '14px' }}>{classLegend[className]}</div>
                            </div>
                        ))}
                    </Grid>
                    <Grid item xs={12} xl={5}>
                        {Object.keys(classColors).slice(Math.ceil(Object.keys(classColors).length / 2)).map((className) => (
                            <div key={className} style={{ display: 'flex', alignItems: 'center', margin: ' 0' }}>
                                <div
                                    style={{
                                        width: '15px',
                                        height: '15px',
                                        backgroundColor: classColors[className],
                                        marginRight: '8px',
                                        border: '1px solid #000',
                                    }}
                                ></div>
                                <div style={{ fontSize: '14px' }}>{classLegend[className]}</div>
                            </div>
                        ))}
                    </Grid>
                </Grid>

            </Grid>
        );
    }
     else {
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
