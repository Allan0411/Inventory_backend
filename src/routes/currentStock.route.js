const express = require('express');
const router = express.Router();
const CurrentStockController = require('../controllers/currentStock.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const {
  createCurrentStockSchema,
  updateCurrentStockSchema
} = require('../middleware/validators/currentStockValidator.middleware');

router.get('/', awaitHandlerFactory(CurrentStockController.getAllCurrentStock));
router.get('/product/:product_id', awaitHandlerFactory(CurrentStockController.getStockByProduct));
router.get('/region/:region_id',awaitHandlerFactory(CurrentStockController.getStockByRegion));
router.get('/product-region', awaitHandlerFactory(CurrentStockController.getStockByProductAndRegion));
router.get('/low', awaitHandlerFactory(CurrentStockController.getLowStock));
router.post('/', createCurrentStockSchema, awaitHandlerFactory(CurrentStockController.createCurrentStock));
router.patch('/:product_id/:region_id', updateCurrentStockSchema, awaitHandlerFactory(CurrentStockController.updateCurrentStock));
router.delete('/:product_id/:region_id', awaitHandlerFactory(CurrentStockController.deleteCurrentStock));

module.exports = router;
