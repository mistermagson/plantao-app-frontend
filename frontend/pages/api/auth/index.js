import jwt from 'jsonwebtoken';

export default async function action(request, response) {

    const {username, password} = request.body;

    let config = {
        url: process.env.LDAP_SERVER, // Endereço do Servidor LDAP / AD
        baseDN: process.env.LDAP_BASEDN,
        attributes: {
            user: ['cn','sAMAccountName','sn', 'givenName', 'mail','trfCPF','displayName'],
            group: [
                'dn', 'cn', 'description', 'distinguishedName', 'objectCategory'
            ]
        },
        username,
        password
    }
    let ActiveDirectory = require('activedirectory2');
    let ad = new ActiveDirectory(config);

    if (request.method === 'POST'){
         await ad.authenticate(username, password, function (err, auth) {
            if (err){
                response.status(500);
            }
            if (auth){
                const token = generateAccessToken({username})
                response.status(200).json({ auth, token})
            } else {
                response.status(400).json({ message: 'crendenciais invalidas', auth: false });
            }
        })
    }
    else{
        response.status(400).send({error: 'Requisicao Invalida'});
    }
}

function generateAccessToken(username) {
    return jwt.sign({username} , process.env.TOKEN, { expiresIn: 1800 });
}

export const config = {
    api: {
        externalResolver: true,
    },
}
