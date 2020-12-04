var router = require('express').Router();
var movieRepo = require('../repo/movie-repo');
const { authRole } = require('../security/security');

router.use(function timeLog(req, res, next) {
    console.log("timeLog");
    next();
});

router.get(getUrl(), (req, res) => {
    if(!req.admin) req.query.available = 1
    movieRepo.findAll(req.query, (err, movies) => {
        
        if(err) return res.status(400).send(err);
        res.send(movies);
    })
});

router.get(getUrl(':id'), (req, res) => {
    const id = req.params.id;
    movieRepo.findOne(id, (err, movie) => {
        if(err) return res.status(400).send(err);
        if(!movie.available && !req.admin) return res.status(409).send({message: "The movie is not available"});
        res.send(movie);
    });
});

router.get(getUrl(), (req, res) => {
    
});

router.post(getUrl(), authRole(true), (req, res) => {
    movieRepo.save(req.body, (err, movie) => {
        if(err) return res.status(400).send(err);
        res.send(movie);
    });
});

router.put(getUrl(':id'), authRole(true), (req, res) => {
    // if(!req.admin) return res.status(403).send();
    console.log("movie routes put")
    movieRepo.update(req.params.id, req.body, (err, movie) => {
        if(err) return res.status(400).send(err);
        res.send(movie);
    });
})

router.delete(getUrl(':id'), authRole(true), (req, res) => {
    const id = req.params.id;
    movieRepo.delete(id, (err, movie) => {
        if(err) return res.status(400).send(err.message);
        res.send(204);
    });
});

module.exports = router;

function getUrl(url) {
    return url ? "/"+url : '';
}
