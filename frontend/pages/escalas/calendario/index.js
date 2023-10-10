import React, { useState } from 'react';
import Calendar from "/examples/Calendar";
import MDBadgeDot from "../../../components/MDBadgeDot"; // needed for dayClick


function Calendario({ plantoes }) {
    const [tooltipContent, setTooltipContent] = useState(null);
    const [dotColor, setDotColor] = useState(null);

    if (plantoes?.length > 0){

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
     else {
        return <></>;

    }
}

export default Calendario;
