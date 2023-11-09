import React, {useEffect, useRef, useState} from 'react';
import Calendar from "/examples/Calendar";
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
        '1jefCG': 'rgba(146, 208, 80, 0.9)',    // Amarelo mais transparente
        '2jefCG': 'rgba(189, 255, 233, 0.99)',    // Verde mais transparente
        '1civilCG': 'rgba(255, 123, 123, 0.99)',  // Vermelho mais transparente
        '2civilCG': 'rgba(255, 218, 185, 0.99)',  // Laranja mais transparente
        '3crimeCG': 'rgba(200, 186, 255, 0.99)', // Roxo mais transparente
        '4civilCG': 'rgba(75, 131, 255, 0.99)',   // Azul mais transparente
        '5crimeCG': 'rgba(255, 204, 255, 0.95)',  // Rosa mais transparente
        '6fiscalCG': 'rgba(255, 253, 183, 0.99)', // Amarelo mais transparente
    };



    const startDate = new Date('2023-01-14');
    const endDate = new Date('2023-12-21'); // Data de término em 31 de dezembro de 2023

    const dateArrays = [];

    function createDateArray(dataInicio, className) {
        let dataFim = new Date(dataInicio);
        dataFim.setDate(dataFim.getDate() + 14);

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

    let currentDate = startDate;

    while (currentDate < endDate) {
        for (const className of classNames) {
            if (currentDate < endDate) {
                dateArrays.push(createDateArray(currentDate, className));
            }
            currentDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + 14);
        }
    }

    //console.log(dateArrays);
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

    if (plantoes?.length > 0){
        const eventos = plantoes.map((plantao) => {
            const plantonista = plantao.plantonista;

            const title = plantonista && plantonista.data.length > 0 && plantonista.data[0].attributes.nome
                ? plantonista.data[0].attributes.nome
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
                    fullHeight
                    selectable="true"
                    initialView="dayGridMonth"
                    initialDate={plantoes[0]?.data}
                    events={[...dateArrays,...eventos]}
                    editable="true"
                    duration={{days: 4}}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    eventClick={ function(info) {
                    alert('Event: ' + info.event.title);
                    alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
                    alert('View: ' + info.view.type);

                    // change the border color just for fun
                    info.el.style.color = 'red';
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
