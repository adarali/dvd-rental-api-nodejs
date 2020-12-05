var router = require('express').Router();
var rentRepo = require('../repo/rent-repo');
var { authRole } = require('../security/security');

router.get('/api/v1/rents', (req, res) => {
    
});