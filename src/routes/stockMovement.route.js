const express = require('express');
const router = express.Router();
const StockMovementController = require('../controllers/stockMovement.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const auth = require('../middleware/auth.middleware');
const { createStockMovementSchema, updateStatusSchema, updateTrackingUrlSchema } = require('../middleware/validators/stockMovementValidator.middleware');

router.post('/', auth('Admin', 'Supplier'), createStockMovementSchema, awaitHandlerFactory(StockMovementController.createStockMovement));
router.get('/', auth(), awaitHandlerFactory(StockMovementController.getAllStockMovements));
router.get('/:id', auth(), awaitHandlerFactory(StockMovementController.getStockMovementById));
router.get('/product/:product_id', auth(), awaitHandlerFactory(StockMovementController.getStockMovementsByProduct));
router.get('/user/:user_id', auth(), awaitHandlerFactory(StockMovementController.getStockMovementsByUser));
router.get('/region/:region_id', auth(), awaitHandlerFactory(StockMovementController.getStockMovementByRegion));
router.patch('/:id/status', auth('Admin', 'Supplier'), updateStatusSchema, awaitHandlerFactory(StockMovementController.updateStatus));
router.patch('/:id/tracking', auth('Admin', 'Supplier'), updateTrackingUrlSchema, awaitHandlerFactory(StockMovementController.updateTrackingUrl));

module.exports = router;
