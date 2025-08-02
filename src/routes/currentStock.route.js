const express = require('express');
const router = express.Router();
const CurrentStockController = require('../controllers/currentStock.controller');

router.get('/', CurrentStockController.getAllCurrentStock);

router.get('/product/:product_id', CurrentStockController.getStockByProduct);

router.get('/product-region', CurrentStockController.getStockByProductAndRegion);

router.get('/low', CurrentStockController.getLowStock);

router.post('/', CurrentStockController.createCurrentStock);

router.patch('/:product_id/:region_id', CurrentStockController.updateCurrentStock);

router.delete('/:product_id/:region_id', CurrentStockController.deleteCurrentStock);

module.exports = router;
