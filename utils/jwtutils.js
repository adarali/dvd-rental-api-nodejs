const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET_KEY;

exports.generateJwt = function(user, callback) {
    jwt.sign({subject: user.username, admin: user.admin}, secret, {expiresIn: '1h'}, callback);
}

exports.validateJwt = function(token, callback) {
    jwt.verify(token, secret, callback)
}

exports.extractAndValidateToken = function(req, callback) {
    let token = '';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.substr(7);
    }
    console.log("Bearer token", token)
    exports.validateJwt(token, callback);
}