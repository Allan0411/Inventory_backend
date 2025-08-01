const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { body } = require('express-validator');

const productValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('category_id').notEmpty().withMessage('Category ID is required'),
];

// Create Product
router.post('/products', productValidationRules, productController.createProduct);

// List All Products
router.get('/products', productController.getAllProducts);

// Get Product by id
router.get('/products/:product_id', productController.getProductById);

// Update Product
router.put('/products/:product_id', productValidationRules, productController.updateProduct);

// Delete Product
router.delete('/products/:product_id', productController.deleteProduct);

module.exports = router;
