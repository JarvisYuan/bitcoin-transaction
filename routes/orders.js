var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/bitcoin-transaction');
var orders = db.get('orders');

orders.currNum = 0;

(function createOrder() {
    var newOrder = {},
        interval = Math.floor(Math.random()*2000);

    if (Math.random() > 0.5) {
        newOrder.side = "ask";
    } else {
        newOrder.side = "bid";
    }

    newOrder.number = orders.currNum++;
    newOrder.quantity = Math.floor(Math.random()*20 + 1);
    newOrder.price = Math.floor(Math.random()*120 + 80);

    orders.insert(newOrder);

    setTimeout(arguments.callee, interval);
})();

module.exports = orders;
