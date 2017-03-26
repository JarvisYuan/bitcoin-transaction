var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bitcoin');
mongoose.connection.on('error', console.error.bind(console, 'connection error: '));

var OrderSchema = new mongoose.Schema({
    number: Number,
    side: String,
    quantity: Number,
    price: Number
});

var OrderModel = mongoose.model('Orders', OrderSchema);

OrderModel.currNum = 0;

(function createOrder() {
    var OrderEntity = new OrderModel({}),
        interval = Math.floor(Math.random()*2000);

    if (Math.random() > 0.5) {
        OrderEntity.side = "ask";
    } else {
        OrderEntity.side = "bid";
    }

    OrderEntity.number = OrderModel.currNum++;
    OrderEntity.quantity = Math.floor(Math.random()*20 + 1);
    OrderEntity.price = Math.floor(Math.random()*120 + 80);

    OrderEntity.save(function(err, doc) {
        if (err) console.log(err);
    });

    setTimeout(arguments.callee, interval);
})();

module.exports = OrderModel;
