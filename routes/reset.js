var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/bitcoin-transaction');
var orders = db.get('orders');

var length = 0;

(function createOrder() {
    var newOrder = {},
        interval = Math.floor(Math.random()*2000);

    if (Math.random() > 0.5) {
        newOrder.side = "ask";
    } else {
        newOrder.side = "bid";
    }

    newOrder.number = length++;
    newOrder.quantity = Math.floor(Math.random()*20 + 1);
    newOrder.price = Math.floor(Math.random()*120 + 80);

    orders.insert(newOrder);

    setTimeout(arguments.callee, interval);
})();

/* GET data reset. */
router.get('/', function(req, res, next) {
    length = 0;
    orders.remove({});
    res.send('respond with a resource');
});

router.orders = orders;

module.exports = router;
