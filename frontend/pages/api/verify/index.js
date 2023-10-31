import jwt from 'jsonwebtoken';

export default function action(request, response) {

    const {authorization} = request.headers
    const token = authorization && authorization.split(' ')[1]
    console.log(token)
    if (token) {
        try{
           let decoded = jwt.verify(token, process.env.TOKEN)
           let username = decoded.username.username

            if (decoded.exp <= parseInt(moment().format("X"))) {
                return response.status(400).send({ error: 'Access token has expired'});
            } else {
                response.json(username);
            }

        }catch(err){
            console.error(err)
        }


    }
}


export const config = {
    api: {
        externalResolver: true,
    },
}
