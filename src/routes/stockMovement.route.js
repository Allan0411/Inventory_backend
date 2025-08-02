const express = require('express');
const router = express.Router();
const StockMovementController = require('../controllers/stockMovement.controller');


router.post('/', StockMovementController.createStockMovement);
router.get('/', StockMovementController.getAllStockMovements);
router.get('/:id', StockMovementController.getStockMovementById);
router.get('/product/:product_id', StockMovementController.getStockMovementsByProduct);
router.get('/user/:user_id', StockMovementController.getStockMovementsByUser);
router.patch('/:id/status',StockMovementController.updateStatus);
router.patch('/:id/tracking',StockMovementController.updateTrackingUrl);
module.exports = router;
