const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { body } = require('express-validator');

const productValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('category_id').notEmpty().withMessage('Category ID is required'),
  body('life_time').optional().isInt({ min: 0 }),
  body('additional_details').optional(),
  body('is_clearance').optional().isBoolean(),
];

// Create Product
router.post('/', productValidationRules, productController.createProduct);

// List All Products
router.get('/', productController.getAllProducts);

// Get Product by id
router.get('/:product_id', productController.getProductById);

// Update Product
router.put('/:product_id', productValidationRules, productController.updateProduct);

// Delete Product
router.delete('/:product_id', productController.deleteProduct);

module.exports = router;
