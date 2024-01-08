import React, { useState } from 'react';
import Calendar from "/examples/Calendar";
import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"
import MDAlert from "../../../components/MDAlert";
import MDBadge from "../../../components/MDBadge";
import MDBadgeDot from "../../../components/MDBadgeDot";
import {es} from "date-fns/locale";
import timeGridPlugin from "@fullcalendar/timegrid";
import {adicionaPlantao, removePlantao} from "../../../utils/plantaoUtils"; // needed for dayClick


function CalendarioJuiz({ plantoes, headers }) {
    const [eventos, setEventos] = useState([]);
    const [tooltipContent, setTooltipContent] = useState(null);
    const [dotColor, setDotColor] = useState(null);

    if (plantoes?.length > 0) {

        const eventos = plantoes?.map((plantao) => {
            const escala = plantao.escala;
            const title = escala
                ? escala.data.attributes.descricao
                : "Vazio";

            const className = escala ? "info" : "secondary";

            return {
                title,
                date: plantao.data,
                className,
            };
        });


        const handleEventMouseEnter = (event) => {
            setTooltipContent("Escala: " + event.event.title);
            setDotColor(event.event.className)

        };

        const handleEventMouseLeave = () => {
            setTooltipContent(null);
            setDotColor(null)
        };
        const handleDateClick = (info) => {
            // Aqui você pode adicionar lógica para criar um novo evento ou realizar outra ação
            const novoEvento = {
                title: 'Novo Evento',
                start: info.dateStr,
                className: 'evento-novo',
            };
             handleAddPlantao(info);

            //setEventos((prevEventos) => [...prevEventos, novoEvento]);
        };
        const handleAddPlantao = (info) => {
            // Lógica para adicionar o plantão

            adicionaPlantao(17, info.dateStr, headers)

        };
        //CONTROLE DOS PLANTOES

        /*const deletePlantao = () => {
            try {
                const idPlantao = linhaSelecionada.id
                removePlantao(idPlantao, headers)
                setLinhaSelecionada([]);
                fetchEscalas();
            } catch (error) {
                setError(error.message);
            }
        }*/


        return (
            <div>

                <Calendar
                    fullHeight
                    initialView="dayGridMonth"
                    initialDate={plantoes[0]?.data}
                    events={[...eventos]}
                    selectable="true"
                    editable="true"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    eventMouseEnter={handleEventMouseEnter}
                    eventMouseLeave={handleEventMouseLeave}
                    locale="pt-br"
                    dateClick={handleDateClick}

                />
                <div style={{height: '100px'}}>
                    {tooltipContent && (
                        <MDBadgeDot badgeContent={tooltipContent} color={dotColor} size='lg' container/>

                    )}
                </div>
            </div>
        );
    }
    else{
        return <></>
    }

}

export default CalendarioJuiz;
