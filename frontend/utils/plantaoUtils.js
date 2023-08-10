// Vincula Datas a um juiz
// dateArrays é um array dos id´s das datas
import {item} from "../examples/Sidenav/styles/sidenavItem";

export const setPlantonista = (idJuiz, plantaoArray,headers ) => {

    const plantoes={
        plantoes:{connect: plantaoArray}
    }

    const statusPlantoes={
        status: false
    }

    const urlJuiz =`http://localhost:1337/api/juizs/${idJuiz}`
    const setJuizData = async () => {
        try {

            console.log(urlJuiz);
            const response = await fetch(urlJuiz, {
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