var router = require('express').Router();
var rentRepo = require('../repo/rent-repo');
var purchaseRepo = require('../repo/purchase-repo');
var changeRepo = require('../repo/change-repo');
const rentSchema = require('../schemas/rent-schema');
var { authRole } = require('../security/security');

router.get('/rents', authRole(), (req, res) => {
    let params = req.query;
    params.dateFrom = new Date(params.dateFrom);
    params.dateTo = new Date(params.dateTo);
    rentRepo.getRentLogs(params, (err, rents) => {
        if(err) return res.status(400).send(err);
        res.send(rents);
    })
});

router.get('/purchases', authRole(), (req, res) => {
    let params = req.query;
    params.dateFrom = new Date(params.dateFrom);
    params.dateTo = new Date(params.dateTo);
    purchaseRepo.getPurchaseLogs(params, (err, purchases) => {
        if(err) return res.status(400).send(err);
        res.send(purchases);
    });
});

router.get('/changes', authRole(), (req, res) => {
    let params = req.query;
    params.dateFrom = new Date(params.dateFrom);
    params.dateTo = new Date(params.dateTo);
    changeRepo.getChangeLogs(params, (err, purchases) => {
        if(err) return res.status(400).send(err);
        res.send(purchases);
    });
})

module.exports = router