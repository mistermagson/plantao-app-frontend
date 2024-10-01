import {parseCookies} from "nookies";

export const validateAuthToken = async (ctx, tipo) => {
    const cookies = parseCookies(ctx);
    const { user_email, user_tipo } = cookies;

    if (!user_email) {
        return {
            redirect: {
                destination: '/authentication/login', // Redireciona para a tela de login se não houver cookies
                permanent: false,
            },
        };
    }
    console.log('|||||||||||| -------- TIPO DO USUARIO: ',tipo)

    return null; // ou um objeto vazio, dependendo do seu caso de uso
}

export const validateAdmin = async (ctx)=> {
    const cookies = parseCookies(ctx);
    const { user_email, user_tipo } = cookies;

    // const allowedEmails = ["cmsantan@trf3.jus.br", "mmmagal@trf3.jus.br", "omperei@trf3.jus.br"];
    //
    // if (email && !allowedEmails.includes(email)) {
    //     // Redirecionar usuário não autenticado
    //     return {
    //         redirect: {
    //             destination: '/plantoes',
    //             permanent: false,
    //         },
    //     };
    // }

    if (user_tipo !== 'admin') {
        return {
            redirect: {
                destination: '/plantoes',
                permanent: false,
            },
        };
    }

    return null;
}

export async function tipoUsuario(email) {

    try {
        const response = await fetch(`http://localhost:1337/api/juizs?filters[email][$eq]=${email}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const juizData = data.data;

        if (juizData.length > 0) {
            return juizData[0].attributes.tipo;
        } else {
            console.log('Juiz não encontrado');
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar tipo do juiz:', error);
        return null;
    }
}

export async function checarEmail(email) {

    try {
        const response = await fetch(`http://localhost:1337/api/juizs?filters[email][$eq]=${email}`, {
            method: 'GET',
        });

        const data = await response.json();
        const juizData = data.data;


        return juizData.length > 0;
    } catch (error) {
        console.error('Erro ao buscar Email:', error);
        return null;
    }
}

export async function checarRf(rf) {

    try {
        const response = await fetch(`http://localhost:1337/api/juizs?filters[rf][$eq]=${rf}`, {
            method: 'GET',
        });

        const data = await response.json();
        const juizData = data.data;

        return juizData.length > 0;
    } catch (error) {
        console.error('Erro ao buscar RF:', error);
        return null;
    }
}


