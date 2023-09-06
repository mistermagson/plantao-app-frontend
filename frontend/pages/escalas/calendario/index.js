import React, {useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'

function Calendario({ plantoes }) {
    // Use um estado para rastrear as datas dos plantões
    const [datesWithPlantonista, setDatesWithPlantonista] = useState(
        plantoes
            .filter((plantao) => plantao.plantonista.data.length > 0)
            .map((plantao) => new Date(plantao.data))
    );

    // Função para determinar se uma data possui um plantonista
    const hasPlantonista = (date) => {
        return datesWithPlantonista.some(
            (dateWithPlantonista) =>
                dateWithPlantonista.getDate() === date.getDate() &&
                dateWithPlantonista.getMonth() === date.getMonth() &&
                dateWithPlantonista.getFullYear() === date.getFullYear()
        );
    };
    return (
        <div>
            <h2>Calendário de Plantões</h2>
            <Calendar
                tileContent={({ date }) => {
                    if (hasPlantonista(date)) {
                        return <div className="calendar-marker"></div>;
                    }
                    return null;
                }}
            />

        </div>
    );
}

export default Calendario;
