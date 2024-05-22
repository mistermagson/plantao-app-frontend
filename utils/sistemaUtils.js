import {parseCookies} from "nookies";

export function validateAuthToken(ctx) {
    const cookies = parseCookies(ctx);
    const authToken = cookies.auth_token;

    if (!authToken) {
        // Redirecionar usuário não autenticado
        return {
            redirect: {
                destination: '/authentication/login',
                permanent: false,
            },
        };
    }

    return null; // ou um objeto vazio, dependendo do seu caso de uso
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
