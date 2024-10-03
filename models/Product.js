const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    weight: Number
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
