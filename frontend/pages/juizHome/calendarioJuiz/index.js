import React, { useState } from 'react';
import Calendar from "/examples/Calendar";
import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"
import MDAlert from "../../../components/MDAlert";
import MDBadge from "../../../components/MDBadge";
import MDBadgeDot from "../../../components/MDBadgeDot";
import {es} from "date-fns/locale"; // needed for dayClick


function CalendarioJuiz({ plantoes }) {
    if (plantoes.length <= 0) {
        return <div></div>;
    } else {
        const [tooltipContent, setTooltipContent] = useState(null);
        const [dotColor, setDotColor] = useState(null);



        const eventos = plantoes.map((plantao) => {
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
            setTooltipContent("Escala: "+event.event.title);
            setDotColor(event.event.className)

        };

        const handleEventMouseLeave = () => {
            setTooltipContent(null);
            setDotColor(null)
        };

        return (
            <div>

                <Calendar
                    fullHeight
                    initialView="dayGridMonth"
                    initialDate={plantoes[0].data}
                    events={eventos}
                    selectable
                    editable
                    eventMouseEnter={handleEventMouseEnter}
                    eventMouseLeave={handleEventMouseLeave}
                    locale="pt-br"

                />
                <div style={{height: '100px'}}>
                {tooltipContent && (
                    <MDBadgeDot badgeContent={tooltipContent} color={dotColor} size='lg' container />

                )}
                </div>
                </div>
        );
    }
}

export default CalendarioJuiz;
