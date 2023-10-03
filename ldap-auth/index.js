let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let moment = require('moment');
//let Promise  = require('promise');

const dotenv = require('dotenv');
dotenv.config();

let config = {
    url: process.env.LDAP_SERVER, // Endereço do Servidor LDAP / AD
    baseDN: process.env.LDAP_BASEDN,
    attributes: {
        user: ['cn','sAMAccountName','sn', 'givenName', 'mail','trfCPF','displayName']
    }
}

app = require('express')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cors')());

let ActiveDirectory = require('activedirectory2');


app.get('/', function (req,res){
    res.status(200).send({success:'Tudo OK'});
});

app.post('/auth', function (req, res) {
    const {username, password} = req.body;

    if(username && password) {

        config.username = username;
        config.password = password
        let ad = new ActiveDirectory(config);

        ad.authenticate(username, password, function (err, auth) {
            if (err) {
                res.json({ message: 'credenciais invalidas', auth: false });

            }
            if (auth) {
                const token = generateAccessToken({username})
                console.log("autenticou e gerou token: ", auth, token)
                res.json({ auth , token });

        };
        })
    } else {
        res.status(400).send({error: 'No username or password supplied'});
    }
});

/*
function verifyJWT(req, res, next){
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

        // se tudo estiver ok, salva no request para uso posterior
        req.username = decoded.username
        next();
    });
}
*/

//valida enviado o token no Body
//
app.post('/verify', function (req, res) {
   /* let token = req.body.token;*/
    const token = req.headers['authorization'];
    if (token){

        try {

            jwt.verify(token, process.env.SECRET, function(err, decoded) {
                if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

                // se tudo estiver ok, salva no request para uso posterior
                req.userId = decoded.id;
                next();
            });

            let decoded = jwt.verify(token, app.get(process.env.TOKEN));


            if (decoded.exp <= parseInt(moment().format("X"))) {
                return res.status(400).send({ error: 'Access token has expired'});
            } else {
                res.json(decoded.username);
            }
        } catch (err) {
            res.status(500).send({ error: 'Access token could not be decoded'});
        }
    } else {
        res.status(400).send({ error: 'Access token is missing'});
    }

});

app.get('/clientes', authenticateToken, (req, res, next) => {
    console.log("Retornou todos clientes!", req);
    res.json([req]);
});

// valida a rquisicao com BEARER Token
app.get('/user/:username', authenticateToken, (req, res) => {

    console.log(req.params.username);
    let {username} = res.params.username;
    const data = getUserDetails(username);
    res.status(200).send({data});
})
/*app.get('/user/:username',  (req, res) => {
    const {username} = req.params;
    console.log(req.params);
    const data = getUserDetails(username);
    const status = data ? 200 : 404;

    console.log(data);
    res.status(status).send({data});
})*/

function generateAccessToken(username) {
    return jwt.sign({username} , process.env.TOKEN, { expiresIn: 1800 });
}

function getUserDetails(username) {
    let ad = new ActiveDirectory(config);
    data = ad.findUser(username)
    return data;
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    //console.log(req.body.user)

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN, (err, user) => {

        //console.log(err)

        if (err) return res.sendStatus(403)

        //console.log(user)
        req.user = user
        next()
    })
}

let port = (process.env.PORT || 3000);
app.listen(port, function() {
    console.log('Listening on port: ' + port);
/*
    if (typeof settings.ldap.reconnect === 'undefined' || settings.ldap.reconnect === null || settings.ldap.reconnect === false) {
        console.warn('WARN: This service may become unresponsive when ldap reconnect is not configured.')
    }*/
});