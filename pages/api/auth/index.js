import jwt from 'jsonwebtoken';
import { setCookie } from 'nookies';
import ActiveDirectory from "activedirectory2";
import { tipoUsuario } from "../../../utils/sistemaUtils";

export default async function solicitaLogIn(request, response) {
    if (request.method === 'POST') {
        const { username, password } = request.body;
        const email = `${username}@trf3.jus.br`; // Ajuste conforme seu domínio AD
        const config = {
            url: process.env.LDAP_SERVER,
            baseDN: process.env.LDAP_BASEDN,
            attributes: {
                user: ['cn', 'AMAccountName', 'n', 'givenName', 'ail', 'trfCPF', 'displayName'],
                group: ['dn', 'cn', 'description', 'distinguishedName', 'objectCategory']
            },
            email,
            password
        };

        try {
            const adAuth = new ActiveDirectory(config);
            await adAuth.authenticate(email, password, async (error, auth) => {
                if (error) {
                    response.status(500);
                } else if (auth) {

                    const token = generateAccessToken({ email });
                    response.status(200).json({ auth, token, email });

                } else {
                    response.status(400).json({ message: 'Invalid credentials', auth: false });
                }
            });
        } catch (error) {
            console.error("Error authenticating user:", error);
            response.status(500);
        }
    } else {
        response.status(400).send({ error: 'Invalid request' });
    }
}

function generateAccessToken(username) {
    return jwt.sign({ username }, process.env.TOKEN, { expiresIn: 1800 });
}