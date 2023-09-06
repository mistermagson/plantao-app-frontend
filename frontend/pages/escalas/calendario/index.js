import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'

function Calendario({ plantoes }) {
    if (!plantoes) {
        // Trate o caso em que 'plantoes' é undefined ou vazio, se necessário
        return null; // ou exiba uma mensagem de erro
    }

    const plantaoDates = plantoes.map((plantao) => new Date(plantao.data));
    const handlePrintDates = () => {
        console.log(plantaoDates);
    };

    return (
        <div>
            <h2>Calendário de Plantões</h2>
            <Calendar value={plantaoDates} />
            <button onClick={handlePrintDates}>Imprimir Datas</button>
        </div>
    );
}

export default Calendario;
