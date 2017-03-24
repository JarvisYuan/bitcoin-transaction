var express = require('express');
var orders = require('./orders');
var router = express.Router();

/* GET orders listing. */
router.get('/', function(req, res, next) {
    var start = +req.query.start,
        end = start + (+req.query.size);

    orders.find({'number': {$gte: start, $lt: end}}, {'_id': 0},
        function(err, list) {
            res.send(list);
        }
    );
});

module.exports = router;
