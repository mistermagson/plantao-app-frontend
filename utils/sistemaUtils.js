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