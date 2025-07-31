const express = require('express');
const router = express.Router();
const CurrentStockController = require('../controllers/currentStock.controller');

// a) View all current stock
router.get('/', CurrentStockController.getAllCurrentStock);

// b) Get all stock entries for a product (across regions)
router.get('/product/:product_id', CurrentStockController.getStockByProduct);

// c) Get stock of product in a particular region via query
router.get('/product-region', CurrentStockController.getStockByProductAndRegion);

// Create current stock record
router.post('/', CurrentStockController.createCurrentStock);

// Update current stock record (patch semantics)
router.patch('/:product_id/:region_id', CurrentStockController.updateCurrentStock);

// Delete current stock record
router.delete('/:product_id/:region_id', CurrentStockController.deleteCurrentStock);

module.exports = router;
