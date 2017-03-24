var express = require('express');
var orders = require('./orders');
var router = express.Router();

/* GET orders listing. */
router.get('/', function(req, res, next) {
    var start = req.query.start,
        end = start + req.query.size;
        // currList = orders.find({'number': {$gte: start, $lt: end}});
        currList = orders.find();
    console.log(currList);
    // console.log(456);
    res.send(currList);
});

module.exports = router;
