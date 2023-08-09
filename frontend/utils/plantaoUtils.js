// Vincula Datas a um juiz
// dateArrays é um array dos id´s das datas
import {item} from "../examples/Sidenav/styles/sidenavItem";

export const setPlantonista = (idJuiz, plantaoArray,...params ) => {

    const plantoes={
        plantoes:{connect: plantaoArray}
    }
    const setJuizData = async () => {
        try {
            const response = await fetch('http://localhost:1337/api/juizs/${idJuiz}', {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: plantoes }),
            })
        } catch (error) {
            return error;
        }
    };

    setJuizData();
    //dateArray.forEach(item=>setJuizData(idJuiz,item,headers));
};