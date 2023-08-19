const { expressjwt: jwt } = require('express-jwt')


// Inicializamos el middleware que hata la validacion de los tokens JWT
const isAuthenticated = jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
    requestProperty: 'payload',
    getToken: getTokenFromHeaders
})


function getTokenFromHeaders (req) {

    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' ) {
        return req.headers.authorization.split(' ')[1]
    }

    return null
}

module.exports = {
    isAuthenticated
}