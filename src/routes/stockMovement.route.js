const express = require('express');
const router = express.Router();
const StockMovementController = require('../controllers/stockMovement.controller');


router.post('/stock_movements', StockMovementController.createStockMovement);
router.get('/stock_movements', StockMovementController.getAllStockMovements);
router.get('/stock_movements/:id', StockMovementController.getStockMovementById);
router.get('/products/:product_id/stock_movements', StockMovementController.getStockMovementsByProduct);
router.get('/users/:user_id/stock_movements', StockMovementController.getStockMovementsByUser);
module.exports = router;
