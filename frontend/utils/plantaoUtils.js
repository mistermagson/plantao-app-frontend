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

    const urlJuiz =`http://10.28.80.30:1337/api/juizs/${idJuiz}`
    const setJuizData = async () => {
        try {

            console.log(urlJuiz);
            const response = await fetch(urlJuiz, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: plantoes }),
            })
            if (response.ok) {
                console.log('Plantonista atualizado com sucesso:', response);
            } else {
                console.log('Erro ao atualizar plantonista:', response);
            }
        } catch (error) {
            console.error('Erro ao atualizar plantonista:', error);
        }
    };

    setJuizData();
};

export const removePlantonista = (idJuiz, plantaoArray,headers ) => {

    const plantoes={
        plantoes:{disconnect: plantaoArray}
    }

    const urlJuiz =`http://10.28.80.30:1337/api/juizs/${idJuiz}`
    const setJuizData = async () => {
        try {
            console.log(urlJuiz);
            const response = await fetch(urlJuiz, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: plantoes }),
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

    setJuizData();
};

export const removePlantao = (idPlantao, headers ) => {


    const urlPlantao =`http://10.28.80.30:1337/api/plantoes/${idPlantao}`
    const removePlantao = async () => {
        try {
            console.log(urlPlantao);
            const response = await fetch(urlPlantao, {
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

    removePlantao();
};