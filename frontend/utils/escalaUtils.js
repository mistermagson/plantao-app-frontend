// retorna uma lista de datas a partir de um intervalo
import {useState} from "react";
import {removePlantao} from "./plantaoUtils";
import getHolidays from "../services/holidays";

export const geraDatas = (start, end) => {
    const dateArray = [];
    let currentDate = new Date(start+ "T00:00:00.000-04:00");
    console.log('GERA DATAS', currentDate)


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
    console.log('INICIO', currentDate)

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
    const setEscala = async () => {
        try {
            const response = await fetch('http://10.28.80.30:1337/api/escalas/${idEscala}', {
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
            console.log(plantaos)
            const response = await fetch('http://10.28.80.30:1337/api/plantoes', {
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
    console.log('setParticipantes',idEscala, participantes,headers)
    const setEscala = async () => {
        try {
            const response = await fetch(`http://10.28.80.30:1337/api/escalas/${idEscala}`, {
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
    console.log(idEscala, varas,headers)
    const setEscala = async () => {
        try {
            const response = await fetch(`http://10.28.80.30:1337/api/escalas/${idEscala}`, {
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

    const urlEscala =`http://10.28.80.30:1337/api/escalas/${idEscala}`
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
    const urlEscala =`http://10.28.80.30:1337/api/escalas/${idEscala}`
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

    const urlEscala =`http://10.28.80.30:1337/api/escalas/${idEscala}`
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

export const fetchEscalas = async (headers) => {

    try {
        const response = await fetch('http://10.28.80.30:1337/api/escalas?populate[plantaos][populate][0]=plantonista&populate[participantes][populate][0]=plantoes&populate[preferencia][populate][0]=juizs', {
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

export const removeEscala = (idEscala,plantaoArray, headers ) => {

    const urlEscala =`http://10.28.80.30:1337/api/escalas/${idEscala}`

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

    console.log(`A preferência foi alterada do juiz  ${escala.preferencia.data.attributes.nome} para o juiz com ID ${proximoJuiz.attributes.nome}`);


    setPreferencia(escala.id, proximoJuiz.id, headers);
};

export const setDescricao = (descricao, idEscala,headers ) => {

    const urlEscala =`http://10.28.80.30:1337/api/escalas/${idEscala}`

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

export const setLink = (link, idEscala,headers ) => {

    const urlEscala =`http://10.28.80.30:1337/api/escalas/${idEscala}`

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