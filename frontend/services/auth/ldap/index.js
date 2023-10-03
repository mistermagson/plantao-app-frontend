let ActiveDirectory = require('activedirectory2');

function auth(username, password){
    let config = {
        url: process.env.LDAP_SERVER, // Endereço do Servidor LDAP / AD
        baseDN: process.env.LDAP_BASEDN,
        attributes: {
            user: ['cn','sAMAccountName','sn', 'givenName', 'mail','trfCPF','displayName']
        }
    }

    let ad = new ActiveDirectory(config);
    let auth=false;

    ad.authenticate(username, password, function (err, auth) {
        if (err) {
            console.log(auth)
            return auth;
        }
        if (auth) {
            console.log(auth)
            return auth;
        }
    })
}

auth("mmmagal","xxx")