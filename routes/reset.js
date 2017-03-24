var express = require('express');
var orders = require('./orders');
var router = express.Router();

/* GET data reset. */
router.get('/', function(req, res, next) {
    orders.currNum = 0;
    orders.remove({});
    res.end();
    // res.send('respond with a resource');
});

module.exports = router;
