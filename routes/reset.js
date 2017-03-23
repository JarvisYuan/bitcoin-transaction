var express = require('express');
var orders = require('./list.js').orders;
var router = express.Router();

/* GET data reset. */
router.get('/', function(req, res, next) {
    orders.list = [];
    orders.length = 0;
    res.send('respond with a resource');
});

module.exports = router;
