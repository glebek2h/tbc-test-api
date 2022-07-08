const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
    orderNumber: String,
    orderingTime: String,
    shopName: String,
    shopLink: String,
    sellerLink: String,
    total: Number,
    orderItems: [{ imgUrl: String, description: String, price: Number }],
});

module.exports = mongoose.model('Order', ordersSchema);