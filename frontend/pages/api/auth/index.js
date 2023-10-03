import jwt from 'jsonwebtoken';
import ActiveDirectory from "activedirectory2";

export default function action(request, response) {
    const {username, password} = request.body;

    const config = {
        url: process.env.LDAP_SERVER, // Endereço do Servidor LDAP / AD
        baseDN: process.env.LDAP_BASEDN,
        attributes: {
            user: ['cn','sAMAccountName','sn', 'givenName', 'mail','trfCPF','displayName']
        }
    }

    let ad = new ActiveDirectory(config);



    if(username && password) {

        ad.authenticate(username, password, function (err, auth) {

            if (err) {
                response.status(500).json({err});
                console.log(err)
            }
            if (auth) {

                const token = generateAccessToken({username});

                response.json({ auth, token });

            } else {
                response.status(500).json({message: 'Login inválido!'});
            }
        });


    }
    response.status(400).send({error: 'Nenhum usuario ou senha informado'});



}

function generateAccessToken(username) {
    return jwt.sign({username} , process.env.TOKEN, { expiresIn: 1800 });
}
