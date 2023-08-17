
export const cargaJuizes = (juizArray, headers) => {

    const setJuizes = async (item,headers) => {
        try {
            console.log(item)
            const response = await fetch('http://localhost:1337/api/juizs', {
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
