const userRepo = require('../repo/user-repo')
var router = require('express').Router();


router.get(getUrl(), (req, res) => {
    if(!req.admin) return res.status(403).send();
    userRepo.findAll((err, users) => {
        if(err) return res.status(400).send(err);
        res.send(users);
    });
});

router.post(getUrl(), (req, res) => {
    if(!req.admin) return res.status(403).send();
    userRepo.save(req.body, (err, movie) => {
        if(err) return res.status(400).send(err);
        res.send(movie);
    });
});

router.put(getUrl(':id'), (req, res) => {
    if(!req.admin) return res.status(403).send();
    userRepo.update(req.params.id, req.body, (err, user) => {
        if(err) return res.status(400).send(err.message);
        res.send(user);
    })
})

module.exports = router;


function getUrl(url) {
    return url ? "/"+url : '';
}
