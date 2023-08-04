// Vincula Datas a um juiz
// dateArrays é um array dos id´s das datas
import {item} from "../examples/Sidenav/styles/sidenavItem";

export const setPlantonista = (idJuiz, dateArray ) => {

    const juiz={
        connect: idJuiz
    }
    const setJuizData = async (idPlantao) => {
        try {
            const response = await fetch('http://localhost:1337/api/plantoes/{idPlantao}', {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: juiz }),
            })
                .then(checkStatus)
                .then(parseJSON);
        } catch (error) {
            return error;
        }
    };

    dateArray.forEach(
        setJuizData(item)
    )

    return response;
};