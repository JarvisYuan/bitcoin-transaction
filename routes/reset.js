var express = require('express');
var router = express.Router();

/* GET data reset. */
router.get('/', function(req, res, next) {
    router.orderList = [];
    router.listLength = 0;
    res.send('respond with a resource');
});

module.exports = router;
