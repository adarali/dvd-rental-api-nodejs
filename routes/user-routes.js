const userRepo = require('../repo/user-repo')
var router = require('express').Router();
var { authRole } = require('../security/security')
var Router = require('express').Router;

module.exports = function(app) {
router.get(getUrl(), authRole(), (req, res) => {
    userRepo.findAll((err, users) => {
        if(err) return res.status(400).send(err);
        res.send(users);
    });
});

router.post(getUrl(), authRole(), (req, res) => {
    userRepo.save(req.body, (err, movie) => {
        if(err) return res.status(400).send(err);
        res.send(movie);
    });
});

router.put(getUrl(':id'), authRole(), (req, res) => {
    userRepo.update(req.params.id, req.body, (err, user) => {
        if(err) return res.status(400).send(err.message);
        res.send(user);
    })
})

return router;
}

function getUrl(url) {
    return url ? "/"+url : '';
}
