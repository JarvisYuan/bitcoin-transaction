$.get("/reset");

var orderList = new Vue({
    el: "#order-list",

    data: {
        // 价格最优排序的卖/买单数据, 成交后shift出栈
        askOrders: [],
        bidOrders: [],
        // 历史成交订单, 用于计算hash值
        totleDeals: [],
        // 历史请求数据总长度, 每次请求的start值
        length: 0
    },

    computed: {
        orders: function() {
            // 获取价格最优的买/卖单各20个
            var topAsk = this.askOrders.slice(0, 20),
                topBid = this.bidOrders.slice(0, 20),
                topOrders = topAsk.concat(topBid);

        	// 下单队列, 价格从高到低 单号从小到大排序
            return this.sortHtL(topOrders);
        }
    },

    mounted: function() {
        setTimeout(this.fetchOrders, 800);
    },

    methods: {
        fetchOrders: function() {

            var self = this;

            $.ajax({
                type: "GET",
                url: "/list",
                dataType: "json",
                data: {
                    // 从当前数据长度开始, 获取最新数据
                    "start": self.length,
                    "size": "10"
                }
            })
            .done(function(res) {
                if (!Array.isArray(res) || res.length === 0) {return;}
                self.length += res.length;

                // 更新数据, 分别推入askOrders/bidOrders
                res.forEach(function(item) {
                    if (item.side === 'ask') {
                        self.askOrders.push(item);
                        self.sortLtH(self.askOrders);

                    } else if (item.side === 'bid') {
                        self.bidOrders.push(item);
                        self.sortHtL(self.bidOrders);
                    }
                });
                setTimeout(self.makeDeals, 1000);
            })
            .fail(function(jqXHR, exception) {
                console.log("Failed to get chain height!");
            });

            // 客户端性能及内存考虑, 获取6000条订单后终止查询
            if (self.length > 6000) {
                layer.msg("请点击Reset按钮或刷新浏览器，重新获取数据");
                return;
            }
            setTimeout(arguments.callee.bind(self), 2000);
        },
        makeDeals: function() {

            var currDeals = [],
            	self = this;

            (function() {

        		if (self.askOrders.length === 0 || self.bidOrders.length === 0) {return;}

            	var deal = {},
            		// 取栈顶数据, 即当前最高价买单与最低价卖单
            		ask = self.askOrders[0],
            		bid = self.bidOrders[0],
            		diff = ask.quantity - bid.quantity;

            	// 若最高买入价小于最低卖出价, 则没有交易
            	if (bid.price < ask.price) {return;}

            	// 若卖出数量小于买入数量, 则成交量为卖出数量, 买入数量更新, 卖单出栈
            	if (diff < 0) {
            		deal.quantity = ask.quantity;
            		deal.bidOrder = JSON.parse(JSON.stringify(bid));
            		bid.quantity -= ask.quantity;
            		deal.askOrder = self.askOrders.shift();
            	} else if (diff > 0) {
            		deal.quantity = bid.quantity;
            		deal.askOrder = JSON.parse(JSON.stringify(ask));
            		ask.quantity -= bid.quantity;
            		deal.bidOrder = self.bidOrders.shift();
            	} else if (diff === 0) {
            		deal.quantity = bid.quantity;
            		deal.askOrder = self.askOrders.shift();
            		deal.bidOrder = self.bidOrders.shift();
            	}

            	deal.price = (ask.price + bid.price)/2;
            	deal.time = new Date().toUTCString();
            	deal.number = ask.number + '.' + bid.number;

            	// 获取本次交易之前所有交易信息的SHA256 hash值
            	deal.hash = CryptoJS.SHA256(JSON.stringify(self.totleDeals)).toString();
            	self.totleDeals.unshift(deal);
            	currDeals.unshift(deal);

            	// 迭代, 直到当前数据无可行交易
            	arguments.callee();
            })();

            // 触发dealList事件, 传入成交队列
            dealList.$emit("makeDeals", currDeals);
        },
        // 价格从高到低排序, 同价格按单号从小到大排序
        sortHtL: function(arr) {
            return arr.sort(function(a, b) {
                return a.price !== b.price
                    ? b.price - a.price
                    : a.number - b.number;
            });
        },
        // 价格从低到高排序, 同价格按单号从小到大排序
        sortLtH: function(arr) {
            return arr.sort(function(a, b) {
                return a.price !== b.price
                    ? a.price - b.price
                    : a.number - b.number;
            });
        }
    }
});

// 渲染弹出框的交易详情数据
var popContent = new Vue({
    el: "#pop-content",

    data: {
        info: {askOrder: {}, bidOrder: {}}
    }
});

var dealList = new Vue({
    el: "#deal-list",

    data: {
        deals: []
    },

    created: function() {
    	// 监听是否有成交事件, 获取成交数据
        this.$on("makeDeals", this.getDeals);
    },

    methods: {
        getDeals: function(data) {
            // 新生成交易置于队首, 取最近30条显示
            this.deals = data.concat(this.deals);
        	this.deals.splice(30);
        },
        popUp: function(deal) {
            // 更新交易详情数据, 弹出layer层
            popContent.info = deal;
            layer.open({
                type: 1,
                title: "Transaction Details",
                area: ['620px', '360px'],
                shadeClose: true,
                content: $("#pop-content")
            });
        }
    }
});

// 点击按钮重置数据
$("header .btn").click(function() {
    $.get("/reset");
    orderList.askOrders = [];
    orderList.bidOrders = [];
    orderList.totleDeals = [];
    orderList.length = 0;
    dealList.deals = [];
});
