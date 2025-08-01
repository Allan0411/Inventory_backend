const ProductModel = require('../models/product.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');

class ProductController {
    getAllProducts = async (req, res, next) => {
        const productList = await ProductModel.find();
        if (!productList.length) {
            throw new HttpException(404, 'Products not found');
        }
        res.send(productList);
    };

    getProductById = async (req, res, next) => {
        
        const product = await ProductModel.findOne({ product_id: req.params.product_id });
        if (!product) {
            throw new HttpException(404, 'Product not found');
        }
        res.send(product);
    };

    createProduct = async (req, res, next) => {
        this.checkValidation(req);
        const result = await ProductModel.create(req.body);
        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }
        res.status(201).send('Product was created!');
    };

    updateProduct = async (req, res, next) => {
        this.checkValidation(req);
        const result = await ProductModel.update(req.body, req.params.product_id);
        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;
        const message = !affectedRows ? 'Product not found' :
            changedRows ? 'Product updated successfully' : 'Update failed';

        res.send({ message, info });
    };

    deleteProduct = async (req, res, next) => {
        const result = await ProductModel.delete(req.params.product_id);
        if (!result) {
            throw new HttpException(404, 'Product not found');
        }
        res.send('Product has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    }
}

module.exports = new ProductController;
