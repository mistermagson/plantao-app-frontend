import React, { useState } from 'react';
import Calendar from "/examples/Calendar";
import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";

function Calendario({ plantoes }) {
    if (plantoes.length <= 0) {
        return <div></div>;
    } else {
        const [tooltipContent, setTooltipContent] = useState(null);

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
        };

        const handleEventMouseLeave = () => {
            setTooltipContent(null);
        };

        return (
            <div>
                <MDBox pb={1.5}>
                    <MDTypography variant="h6">Calendário de Plantões:</MDTypography>
                </MDBox>
                <Calendar
                    initialView="dayGridMonth"
                    initialDate={plantoes[0].data}
                    events={eventos}
                    selectable
                    editable
                    eventMouseEnter={handleEventMouseEnter}
                    eventMouseLeave={handleEventMouseLeave}
                />
                {tooltipContent && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '5px', border: '1px solid #ccc' }}>
                        {tooltipContent}
                    </div>
                )}
            </div>
        );
    }
}

export default Calendario;
