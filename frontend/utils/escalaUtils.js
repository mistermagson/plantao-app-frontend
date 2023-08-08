// retorna uma lista de datas a partir de um intervalo
export const geraDatas = (start, end) => {
    const dateArray = [];
    let currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
        dateArray.push(new Date());
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
};

// retorna uma lista de datas que caem em final de semana(sábado ou domingo)
export const geraWeekends = (start, end) => {
    const dateArray = [];
    let currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            // Se a data for um sábado (6) ou domingo (0), adicionamos ao array
            dateArray.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
};

// Vincula Datas a um escala
// dateArrays é um array dos id´s das datas
export const setDatasEscalaId = (idEscala, dateArray, ...params) => {

    const plantaos={
        plantaos:{connect: dateArray}
    }
    const setEscala = async () => {
        try {
            const response = await fetch('http://localhost:1337/api/escalas/${idEscala}', {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: plantaos }),
            })
                .then(checkStatus)
                .then(parseJSON);
        } catch (error) {
            return error;
        }
    };

    setEscala();

    return response;
};

export const setDatasEscala = (idEscala, dateArray, ...params) => {

    const setEscala = async (idEscala, item) => {
        try {
            const plantaos={
                data: item.data,
                escala: idEscala
            }
            const response = await fetch('http://localhost:1337/api/plantoes', {
                method: 'POST',
                headers,
                body: JSON.stringify({ data: plantaos }),
            })
                .then(checkStatus)
                .then(parseJSON);
        } catch (error) {
            return error;
        }
    };

    dateArray.forEach(item => setEscala(idEscala, item));


    return response;
};

export const setParticipantesEscala = (idEscala, juizesArray,headers) => {


    const participantes={
        participantes:{connect: juizesArray}
    }
    const setEscala = async () => {
        try {
            const response = await fetch(`http://localhost:1337/api/escalas/${idEscala}`, {
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

