import {useState} from "react";

export const cargaJuizes = (juizArray, headers) => {

    const setJuizes = async (item,headers) => {
        try {
            console.log(item)
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/juizs`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ data: item }),
            })
        } catch (error) {
            return error;
        }
    };

    juizArray.forEach(juiz => setJuizes(juiz,headers));


    return response;
};


export const fetchJuizes = async (headers) => {
    const [data, setData] = [];

    try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_STRAPI_HOST}:1337/api/juizs?populate[plantoes][populate][0]=escala`, {
            method: 'GET',
            headers,
        });
        if (!response.ok) {
            throw new Error('Falha ao obter os dados dos juizes.');
        }

        const responseJuiz = await response.json();

        if (Array.isArray(responseJuiz.data)) {
            const juizesData = responseJuiz.data.map((item) => ({id: item.id, ...item.attributes,}));
            return(juizesData);

        } else {
            return('Formato de dados inválido.');
        }

    } catch (error) {
        return(error.message);
    }
};