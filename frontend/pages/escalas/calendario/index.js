import React, { useState } from 'react';
import Calendar from "/examples/Calendar";
import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"
import MDAlert from "../../../components/MDAlert";
import MDBadge from "../../../components/MDBadge";
import MDBadgeDot from "../../../components/MDBadgeDot"; // needed for dayClick

function Calendario({ plantoes }) {
    if (plantoes.length <= 0) {
        return <div></div>;
    } else {
        const [tooltipContent, setTooltipContent] = useState(null);
        const [dotColor, setDotColor] = useState(null);

        const eventos = plantoes.map((plantao) => {
            const plantonista = plantao.plantonista;

            const title = plantonista && plantonista.data.length > 0 && plantonista.data[0].attributes.nome
                ? plantonista.data[0].attributes.nome
                : "Vazio";

            const className = plantonista && plantonista.data.length > 0 ? "info" : "secondary";

            return {
                title,
                date: plantao.data,
                className,
            };
        });

        const inicio = plantoes.length > 0 ? plantoes[0].data : "";
        const fim = plantoes.length > 0 ? plantoes[plantoes.length - 1].data : "";

        const handleEventMouseEnter = (event) => {
            setTooltipContent(event.event.title);
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
                />
                <div style={{height: '20px'}}>
                {tooltipContent && (
                    <MDBadgeDot badgeContent={tooltipContent} color={dotColor} size='lg' container />

                )}
                </div>
                </div>
        );
    }
}

export default Calendario;
