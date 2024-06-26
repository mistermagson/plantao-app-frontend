// retorna uma lista de datas a partir de um intervalo
import {useState} from "react";
import {removePlantao} from "./plantaoUtils";
import getHolidays from "../services/holidays";
import {setCookie} from "nookies";
import {fetchJuizes} from "./juizes";

export const geraDatas = (start, end) => {
    const dateArray = [];
    let currentDate = new Date(start+ "T00:00:00.000-04:00");


    const formatDate = date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    while (currentDate <= new Date(end + "T00:00:00.000-04:00")) {
        dateArray.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
};

// retorna uma lista de datas que caem em final de semana(sábado ou domingo)
export const geraWeekends = (start, end) => {
    const dateArray = [];
    let currentDate = new Date( start + "T00:00:00.000-04:00");

    const formatDate = date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    while (currentDate <= new Date(end + "T00:00:00.000-04:00")) {
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            // Se a data for um sábado (6) ou domingo (0), adicionamos ao array
            dateArray.push(formatDate(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
};

export const geraFeriados = (start, end) => {
    const partesData = start.split("-");
    const ano = partesData[0];

    const feriados = getHolidays(ano).map((feriado) => feriado.date);

    return feriados.filter((data) => data >= start && data <= end);
};

// Vincula Datas a um escala
// dateArrays é um array dos id´s das datas
export const setDatasEscalaId = (idEscala, dateArray, ...params) => {

    const plantaos={
        plantaos:{connect: dateArray}
    }
    c
    const setEscala = async () => {
        try {
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas/${idEscala}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: plantaos }),
            })
        } catch (error) {
            return error;
        }
    };

    setEscala();

    return response;
};

export const setDatasEscala = (idEscala, dateArray, headers) => {

    const setEscala = async (idEscala, item,headers) => {
        try {
            const plantaos={
                data: item,
                escala: idEscala
            }
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/plantoes`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ data: plantaos }),
            })
        } catch (error) {
            return error;
        }
    };

    dateArray.forEach(item => setEscala(idEscala, item,headers));

};

export const setParticipantesEscala = (idEscala, juizesArray,headers) => {


    const participantes={
        participantes:{connect: juizesArray}
    }
    const setEscala = async () => {
        try {
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas/${idEscala}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: participantes }),
            })
                .then(checkStatus)
                .then(parseJSON);
        } catch (error) {
            return error;
        }
    };

    setEscala();

};

export const setVarasEscala = (idEscala, varasArray,headers) => {


    const varas={
        varas:{connect: varasArray}
    }
    const setEscala = async () => {
        try {
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas/${idEscala}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: varas }),
            })
                .then(checkStatus)
                .then(parseJSON);
        } catch (error) {
            return error;
        }
    };

    setEscala();

};

export const removeParticipantesEscala = (idJuiz, idEscala,headers ) => {

    const juiz={
        participantes:{disconnect: idJuiz}
    }

    const urlEscala =`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas/${idEscala}`
    const setEscalaData = async () => {
        try {

            const response = await fetch(urlEscala, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: juiz }),
            })
            if (response.ok) {
                console.log('Plantonista removido com sucesso:', response);
            } else {
                console.log('Erro ao atualizar plantonista:', response);
            }
        } catch (error) {
            console.error('Erro ao atualizar plantonista:', error);
        }
    };

    setEscalaData();
};

export const setPreferencia = (idEscala, idJuiz,headers) => {

    const preferencia={
        preferencia:{connect: [idJuiz]}
    }
    const urlEscala =`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas/${idEscala}`
    const setEscolha = async () => {
        try {
            const response = await fetch(urlEscala, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: preferencia }),
            })
                .then(checkStatus)
                .then(parseJSON);
        } catch (error) {
            return error;
        }
    };

    setEscolha();

};

export const removePreferencial = (idJuiz, idEscala,headers ) => {

    const juiz={
        preferencia:{disconnect: idJuiz}
    }

    const urlEscala =`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas/${idEscala}`
    const setEscalaData = async () => {
        try {

            const response = await fetch(urlEscala, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: juiz }),
            })
            if (response.ok) {
                console.log('Preferencia removida com sucesso:', response);
            } else {
                console.log('Erro ao atualizar preferencia:', response);
            }
        } catch (error) {
            console.error('Erro ao atualizar preferencia:', error);
        }
    };

    setEscalaData();
};

export const fetchEscalas = async () => {

    try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas?populate[plantaos][populate][0]=plantonista&populate[participantes][populate][0]=plantoes&populate[preferencia][populate][0]=juizs`, {
            method: 'GET',
           // headers,
        });

        if (!response.ok) {
            throw new Error('Falha ao obter os dados das escalas.');
        }

        const responseEscala = await response.json();

        if (Array.isArray(responseEscala.data)) {
            const escalasData = responseEscala.data.map((item) => ({id: item.id, ...item.attributes,}));
            console.log('Fetch Escalas realizado');
            return (escalasData);


        } else {
            console.log('Fetch Escalas NAO realizado');
            return ([]);
        }

    } catch (error) {
        return(error.message);
    }
};

export const fetchEscalasDoJuiz = async (juizEmail) =>{
    const data = await fetchEscalas();
    if(data){
        return data.filter(
            (escala) =>
                escala.fechada === false &&
                escala.participantes.data.some((participante) => participante.attributes.email === juizEmail)
        );
    }
}

export const removeEscala = (idEscala,plantaoArray, headers ) => {

    const urlEscala =`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas/${idEscala}`

    const deleteEscala = async () => {
        try {

            plantaoArray.forEach(item => removePlantao(item,headers));
            const response = await fetch(urlEscala, {
                method: 'DELETE',
                headers,
            })
            if (response.ok) {
                console.log('Plantao removido com sucesso:', response);
            } else {
                console.log('Erro ao remover plantao:', response);
            }
        } catch (error) {
            console.error('Erro ao remover plantao:', error);
        }
    };

    deleteEscala();
};

export const passaPreferencia = (escala,headers) => {


    if (!escala) {
        console.error('Escala não fornecida.');
        return;
    }

    if (!escala.preferencia) {
        console.error('Não há preferência definida.');
        return;
    }

    if (!escala.participantes.data || escala.participantes.data.length === 0) {
        console.error('A escala não tem participantes.');
        return;
    }

    const juizesOrdenados = escala.participantes.data.sort((a, b) => {
        return a.attributes.antiguidade - b.attributes.antiguidade;
    });
    //console.log('ordem', juizesOrdenados);  ORDEM ESTA CORRETA

    const indexPreferencia = juizesOrdenados.findIndex((juiz) => juiz.id === escala.preferencia.data.id);

    //console.log('posicao do preferencial', indexPreferencia); POSICAO ESTA CORRETA

    if (indexPreferencia === -1) {
        console.log('Juiz com ID de preferência não encontrado na escala.');
        return;
    }

    let proximoJuiz;

    if (indexPreferencia === juizesOrdenados.length - 1) {
        proximoJuiz = juizesOrdenados[0];
    } else {
        proximoJuiz = juizesOrdenados[indexPreferencia + 1];
    }

    setPreferencia(escala.id, proximoJuiz.id, headers);
    enviarEmail(escala.preferencia.data.attributes,proximoJuiz.attributes, escala);
};

export const setDescricao = (descricao, idEscala,headers ) => {

    const urlEscala =`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas/${idEscala}`

    const setEscalaDescricao = async () => {
        try {
            const response = await fetch(urlEscala, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: {"descricao": `${descricao}`} }),
            })
            if (response.ok) {
                console.log('Descricao atualizada com sucesso:', response);
            }
        } catch (error) {
            console.error('Erro ao atualizar descricao:', error);
        }
    };

    setEscalaDescricao();
};

export const editaPlantoesPorJuiz = (quantidade, idEscala,headers ) => {

    const urlEscala =`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas/${idEscala}`
    const setPlantoesPorJuiz = async () => {
        try {
            const response = await fetch(urlEscala, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: {"plantoesPorJuiz": `${quantidade}`} }),
            })
            if (response.ok) {
                console.log('plantoesPorJuiz atualizada com sucesso:', response);
            }
        } catch (error) {
            console.error('Erro ao atualizar plantoesPorJuiz:', error);
        }
    };

    setPlantoesPorJuiz();
};


export const editaLink = (link, idEscala,headers ) => {

    const urlEscala =`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/escalas/${idEscala}`

    const setEscalaLink = async () => {
        try {
            const response = await fetch(urlEscala, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: {"link": `${link}`} }),
            })
            if (response.ok) {
                console.log('Link atualizada com sucesso:', response);
            }
        } catch (error) {
            console.error('Erro ao atualizar link:', error);
        }
    };

    setEscalaLink();
};

export const enviarEmail = async (juizFinalizou, juizInicia, escala) =>{

    try {
        const res = await fetch("/api/notifica", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: `${juizInicia.email}`,
                message: `A escolha de data para os plantões da escala "${escala.descricao}" já está dispoível! Acesse ${window.location.href} para realizar suas escolhas.`
            })
        });

        if (res.ok) {
            console.log("Email enviado para o próximo juiz")

        } else {
            console.log("...Erro ao enviar email:", res.statusText);
        }
    } catch (error) {
        console.log("Erro ao enviar email:", error);
    }
}