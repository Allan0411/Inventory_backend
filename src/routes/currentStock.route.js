const express = require('express');
const router = express.Router();
const CurrentStockController = require('../controllers/currentStock.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const auth = require('../middleware/auth.middleware');
const {
  createCurrentStockSchema,
  updateCurrentStockSchema
} = require('../middleware/validators/currentStockValidator.middleware');

router.get('/',auth(), awaitHandlerFactory(CurrentStockController.getAllCurrentStock));
router.get('/product/:product_id',auth(), awaitHandlerFactory(CurrentStockController.getStockByProduct));
router.get('/region/:region_id',auth(),awaitHandlerFactory(CurrentStockController.getStockByRegion));
router.get('/product-region',auth(), awaitHandlerFactory(CurrentStockController.getStockByProductAndRegion));
router.get('/low',auth(), awaitHandlerFactory(CurrentStockController.getLowStock));
router.post('/',auth('Admin','Supplier'), createCurrentStockSchema, awaitHandlerFactory(CurrentStockController.createCurrentStock));
router.patch('/:product_id/:region_id', updateCurrentStockSchema, awaitHandlerFactory(CurrentStockController.updateCurrentStock));
router.delete('/:product_id/:region_id',auth('Admin'), awaitHandlerFactory(CurrentStockController.deleteCurrentStock));

module.exports = router;
