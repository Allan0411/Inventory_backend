const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const auth = require('../middleware/auth.middleware');

// Region analytics
router.get('/region/capacity-utilization', auth(), awaitHandlerFactory(analyticsController.getRegionCapacityUtilization));
router.get('/region/movement-summary', auth(), awaitHandlerFactory(analyticsController.getRegionMovementSummary));

// Category analytics
router.get('/category/top-by-product-count', auth(), awaitHandlerFactory(analyticsController.getTopCategoriesByProductCount));
router.get('/category/movement-summary', auth(), awaitHandlerFactory(analyticsController.getCategoryMovementSummary));

// Stock analytics
router.get('/stock/total-by-product', auth(), awaitHandlerFactory(analyticsController.getTotalQuantityByProduct));
router.get('/stock/total-by-region', auth(), awaitHandlerFactory(analyticsController.getTotalQuantityByRegion));
router.get('/stock/total-value', auth(), awaitHandlerFactory(analyticsController.getTotalStockValue));

// Stock movement analytics
router.get('/movement/total-by-product', auth(), awaitHandlerFactory(analyticsController.getTotalMovedByProduct));
router.get('/movement/most-active-regions', auth(), awaitHandlerFactory(analyticsController.getMostActiveRegions));
router.get('/movement/top-delivered-products', auth(), awaitHandlerFactory(analyticsController.getTopDeliveredProducts));
router.get('/movement/monthly-summary', auth(), awaitHandlerFactory(analyticsController.getMonthlyMovementSummary));

module.exports = router;
