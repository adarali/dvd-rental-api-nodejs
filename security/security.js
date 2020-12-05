const { equal } = require('assert');
var jwtutils = require('../utils/jwtutils')

addMiddleware = (app) => {
    app.use('/api/*/movies*', (req, res, next) => {
        console.log('/api/*/movies*')
        req.skip = req.method === 'GET'
        if(req.skip) {
            jwtutils.extractAndValidateToken(req, (err, decoded) => {
                if(err) req.admin = false;
                else req.admin = decoded.admin;
                next();
            })
        } else {
            next();
        }
        
        
    });

    app.use('/api*', function(req, res, next) {
        //skip this middleware if req.skip is true
        if(req.skip) return next();
        console.log("/api*")
        jwtutils.extractAndValidateToken(req, (err, decoded) => {
            if(err) return res.status(401).send(err);
            console.log("decoded", decoded)
            req.user = {username: decoded.subject, admin: decoded.admin};
            req.admin = decoded.admin
            next();
        });
    });
}

authRole = (admin = true) => {
    return (req, res, next) => {
        if(!req.admin) return res.status(403).send('Forbidden');
        next();
    }
    
}

module.exports = {
    addMiddleware,
    authRole,
}

