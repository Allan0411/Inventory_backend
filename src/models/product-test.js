require('dotenv').config();
console.log("Running product-test.js");

const ProductModel = require('./product.model');

const run = async () => {
    const products = await ProductModel.find();
    console.log('Products:', products);
};

run();
