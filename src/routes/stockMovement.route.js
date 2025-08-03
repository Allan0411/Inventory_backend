const express = require('express');
const router = express.Router();
const StockMovementController = require('../controllers/stockMovement.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const { createStockMovementSchema, updateStatusSchema, updateTrackingUrlSchema } = require('../middleware/validators/stockMovementValidator.middleware');

router.post('/', createStockMovementSchema, awaitHandlerFactory(StockMovementController.createStockMovement));
router.get('/', awaitHandlerFactory(StockMovementController.getAllStockMovements));
router.get('/:id', awaitHandlerFactory(StockMovementController.getStockMovementById));
router.get('/product/:product_id', awaitHandlerFactory(StockMovementController.getStockMovementsByProduct));
router.get('/user/:user_id', awaitHandlerFactory(StockMovementController.getStockMovementsByUser));
router.get('/region/:region_id',awaitHandlerFactory(StockMovementController.getStockMovementByRegion));
router.patch('/:id/status', updateStatusSchema, awaitHandlerFactory(StockMovementController.updateStatus));
router.patch('/:id/tracking', updateTrackingUrlSchema, awaitHandlerFactory(StockMovementController.updateTrackingUrl));

module.exports = router;
