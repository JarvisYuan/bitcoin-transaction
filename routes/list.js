var express = require('express');
var orders = require('./reset.js').orders;
var router = express.Router();

/* GET orders listing. */
router.get('/', function(req, res, next) {
    var start = req.query.start,
        end = start + req.query.size,
        currList = req.db.orders.slice(start, end);
    res.send(currList);
});

module.exports = router;
