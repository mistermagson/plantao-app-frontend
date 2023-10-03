import jwt from 'jsonwebtoken';
import {autenticaAD} from "../../../services/auth/ldap";


export default async function action(request, response) {
    const {username, password} = request.body;

    if(username && password) {

        response.json(autenticaAD(username, password))

    } else{
        response.status(400).send({error: 'Nenhum usuario ou senha informado'});
    }
}



function generateAccessToken(username) {
    return jwt.sign({username} , process.env.TOKEN, { expiresIn: 1800 });
}
