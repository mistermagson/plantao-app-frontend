import React from 'react';
import Calendar from "/examples/Calendar";
import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";

function Calendario({ plantoes }) {
    // Mapeie os plantões e determine o título e a classe com base no plantonista
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

    // Verifique se há pelo menos um plantão antes de acessar o primeiro e último elementos
    const inicio = plantoes.length > 0 ? plantoes[0].data : "";
    const fim = plantoes.length > 0 ? plantoes[plantoes.length - 1].data : "";

    return (
        <div>
            <MDBox pb={1}>
                <MDTypography variant="h6" >Calendário de Plantões:</MDTypography>
            </MDBox>
            <Calendar
                initialView="dayGridMonth"
                initialDate={inicio}
                events={eventos}
                selectable
                editable
            />

            {/* Exibir informações da data selecionada (se necessário) */}
        </div>
    );
}

export default Calendario;
