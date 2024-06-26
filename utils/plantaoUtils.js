// Vincula Datas a um juiz
// dateArrays é um array dos id´s das datas
import {item} from "../components/examples/Sidenav/styles/sidenavItem";

export const setPlantonista = (idJuiz, plantaoArray,headers ) => {

    const plantoes={
        plantoes:{connect: plantaoArray}
    }

    const urlJuiz =`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/juizs/${idJuiz}`
    const setJuizData = async () => {
        try {

            const response = await fetch(urlJuiz, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: plantoes }),
            })
            if (response.ok) {
                console.log('Plantonista adicionado com sucesso');
            } else {
                console.log('Erro ao adicionado plantonista:', response);
            }
        } catch (error) {
            console.error('Erro ao adicionar plantonista:', error);
            console.error('erro parametros',idJuiz,plantaoArray,headers)
        }
    };

    setJuizData();
};

export const removePlantonista = (idJuiz, plantaoArray,headers ) => {

    const plantoes={
        plantoes:{disconnect: plantaoArray}
    }
    const urlJuiz =`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/juizs/${idJuiz}`
    const setJuizData = async () => {
        try {
            const response = await fetch(urlJuiz, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: plantoes }),
            })
            if (response.ok) {
                console.log('Plantonista removido com sucesso');
                console.warn(plantaoArray,'SUCESSO',idJuiz,headers)

            } else {
                console.log('Erro ao atualizar plantonista:', response);
                console.error(plantaoArray,'ERRO parametros',idJuiz,headers)
            }
        } catch (error) {
            console.error('Erro ao atualizar plantonista:', error);
            console.error(plantaoArray,'ERRO parametros',idJuiz,headers)
        }
    };

    setJuizData();
};

export const removePlantao = (idPlantao, headers ) => {


    const urlPlantao =`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/plantoes/${idPlantao}`
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

export const adicionaPlantao = (idEscala,dia, headers ) => {

    const plantao ={
        data: dia,
        escala: idEscala
    }

    const removePlantao = async () => {
        try {
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/plantoes`, {
                method: 'POST',
                headers,
                body: JSON.stringify({data: plantao}),
            })
            if (response.ok) {
                console.log('Plantao adicionado com sucesso:', response);
            } else {
                console.log('Erro ao adicionar plantao:', response);
            }
        } catch (error) {
            console.error('Erro ao adicionar plantao:', error);
        }
    };

    removePlantao();
};