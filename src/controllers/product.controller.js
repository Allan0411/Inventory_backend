const ProductModel = require('../models/product.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');

class ProductController {
    getAllProducts = async (req, res, next) => {
        const productList = await ProductModel.find();
        if (!productList.length) {
            throw new HttpException(404, 'Products not found');
        }
        res.json(productList);
    };

    getProductById = async (req, res, next) => {
        const product = await ProductModel.findOne({ product_id: req.params.product_id });
        if (!product) {
            throw new HttpException(404, 'Product not found');
        }
        res.json(product);
    };

    createProduct = async (req, res, next) => {
        this.checkValidation(req);
        // Destructure only relevant fields if you want stricter field control:
        // const { name, category_id, description, price, life_time, additional_details, is_clearance } = req.body;
        // const result = await ProductModel.create({ name, category_id, ... });
        const result = await ProductModel.create(req.body);
        if (!result) {
            throw new HttpException(500, 'Failed to create product');
        }
        res.status(201).json({ message: 'Product was created!' });
    };

    updateProduct = async (req, res, next) => {
        this.checkValidation(req);
        const result = await ProductModel.update(req.body, req.params.product_id);
        if (!result) {
            throw new HttpException(404, 'Product not found');
        }
        // result should have affectedRows/changingRows/info if using some SQL libs; if not, just send status
        res.json({ message: 'Product updated successfully' });
    };

    deleteProduct = async (req, res, next) => {
        const result = await ProductModel.delete(req.params.product_id);
        if (!result) {
            throw new HttpException(404, 'Product not found');
        }
        res.json({ message: 'Product has been deleted' });
    };

    checkValidation = (req) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    }
}
module.exports = new ProductController();
