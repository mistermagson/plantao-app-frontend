import jwt from "jsonwebtoken";

const url = `http://10.28.80.30:3001/auth`;
const headers = {
    'Content-Type': 'application/json'
};

export async function autenticaAD (username, password) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({username, password}),
        }).then( response =>{
            console.log(response)

        }

        )
    }
    catch (error) {

        return response.json(error)
    }
}


function generateAccessToken(username) {
    return jwt.sign({username} , process.env.TOKEN, { expiresIn: 1800 });
}
