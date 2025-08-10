const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const auth = require('../middleware/auth.middleware');
// Import schemas:
const {
  createProductSchema,
  updateProductSchema
} = require('../middleware/validators/productValidator.middleware');

// Create Product
router.post('/', auth('Admin'), createProductSchema, awaitHandlerFactory(productController.createProduct));

// List All Products
router.get('/', auth(), awaitHandlerFactory(productController.getAllProducts));

// Get Product by id
router.get('/:product_id', auth(), awaitHandlerFactory(productController.getProductById));

// Update Product
router.put('/:product_id', auth('Admin'), updateProductSchema, awaitHandlerFactory(productController.updateProduct));

// Delete Product
router.delete('/:product_id', auth('Admin'), awaitHandlerFactory(productController.deleteProduct));

module.exports = router;
