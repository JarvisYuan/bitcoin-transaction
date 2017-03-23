var express = require('express');
var router = express.Router();

var orders = {
    list: [],
    length: 0
};

(function createOrder() {

    var newOrder = {},
        interval = Math.floor(Math.random()*2000);

    if (Math.random() > 0.5) {
        newOrder.side = "ask";
    } else {
        newOrder.side = "bid";
    }

    newOrder.number = orders.length++;
    newOrder.quantity = Math.floor(Math.random()*20 + 1);
    newOrder.price = Math.floor(Math.random()*120 + 80);

    orders.list.push(newOrder);

    setTimeout(arguments.callee, interval);
})();

/* GET users listing. */
router.get('/', function(req, res, next) {

    var start = req.query.start,
        end = start + req.query.size,
        currList = orders.list.slice(start, end);
    res.send(currList);
});

module.exports = router;
module.exports.orders = orders;
