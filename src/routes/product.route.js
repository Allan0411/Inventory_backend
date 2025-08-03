const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
// Import schemas:
const {
  createProductSchema,
  updateProductSchema
} = require('../middleware/validators/productValidator.middleware');


// Create Product
router.post('/', createProductSchema, awaitHandlerFactory(productController.createProduct));

// List All Products
router.get('/', awaitHandlerFactory(productController.getAllProducts));

// Get Product by id
router.get('/:product_id', awaitHandlerFactory(productController.getProductById));

// Update Product
router.put('/:product_id', updateProductSchema, awaitHandlerFactory(productController.updateProduct));

// Delete Product
router.delete('/:product_id', awaitHandlerFactory(productController.deleteProduct));

module.exports = router;

