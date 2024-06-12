import jwt from 'jsonwebtoken';
import { setCookie } from 'nookies';
import ActiveDirectory from "activedirectory2";

export default async function solicitaLogIn(request, response){
    const {email, password} = request.body;

    let config = {
        url: process.env.LDAP_SERVER, // Endereço do Servidor LDAP / AD
        baseDN: process.env.LDAP_BASEDN,
        attributes: {
            user: ['cn','sAMAccountName','sn', 'givenName', 'mail','trfCPF','displayName'],
            group: ['dn', 'cn', 'description', 'distinguishedName', 'objectCategory']
        },
        email,
        password
    }
    let ActiveDirectory = require('activedirectory2');
    let ad = new ActiveDirectory(config);

    if (request.method === 'POST'){
        await ad.authenticate(email, password, function (erro, auth) {
            if (erro){
                response.status(500);
            }
            if (auth){

                const token = generateAccessToken({email})
                response.status(200).json({ auth, token, email})

            } else {
                response.status(400).json({ message: 'crendenciais invalidas', auth: false });
            }
        })
    }
    else{
        response.status(400).send({error: 'Requisicao Invalida'});
    }
}

function generateAccessToken(email) {
    return jwt.sign({email} , process.env.TOKEN, { expiresIn: 1800 });
}

export const config = {
    api: {
        externalResolver: true,
    },
}
