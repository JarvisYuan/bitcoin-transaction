var express = require('express');
var router = express.Router();

router.orderList = [];
router.listLength = 0;

(function createOrder() {

    var obj = {},
        repeat = Math.floor(Math.random()*2000);

    if (Math.random() > 0.5) {
        obj.side = "ask";
    } else {
        obj.side = "bid";
    }

    obj.number = router.listLength++;
    obj.quantity = Math.floor(Math.random()*20 + 1);
    obj.price = Math.floor(Math.random()*120 + 80);

    router.orderList.push(obj);

    setTimeout(arguments.callee, repeat);
})();

/* GET users listing. */
router.get('/', function(req, res, next) {

    var start = req.query.start,
        end = start + req.query.size,
        currList = router.orderList.slice(start, end);
    res.send(currList);
});

module.exports = router;
