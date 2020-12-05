const userRepo = require('../repo/user-repo');
const bcrypt = require('bcrypt');
const jwtutils = require('../utils/jwtutils');

var router = require('express').Router();


router.post(getUrl(), (req, res) => {
    let creds = req.body;
    userRepo.getPasswordHash(creds.username, (err, user) => {
        if(err) {
            console.log(err);
            return res.status(400).send(err.message);
        }
        if(!user) return res.status(401).send({message: "Invalid username or password"});
        bcrypt.compare(creds.password, user.password, (err, same) => {
            if(err) {
                console.log("user", user)
                console.log("creds", creds)
                console.log(err);
                return res.status(400).send({message: err.message});
            }
            if(!same) return res.status(401).send({message: "Invalid username or password"});
            jwtutils.generateJwt(user, (err, token) => {
                if(err) {
                    console.log(err);
                    return res.status(400).send({message: err.message});
                }
                res.send({jwt: token, user: {
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    admin: user.admin,
                    picture: user.picture,
                }});
            });
        });
    });
});

module.exports = router;


function getUrl(url) {
    return url ? "/"+url : '';
}