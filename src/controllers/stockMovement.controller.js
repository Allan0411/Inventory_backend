const { v4: uuidv4 } = require('uuid');
const StockMovementModel = require('../models/stockMovement.model');
const HttpException = require('../utils/HttpException.utils');

class StockMovementController {
  // Create a new stock movement (POST /stock_movements)
  createStockMovement = async (req, res, next) => {
    try {
      const {
        product_id,
        region_id,
        user_id,
        change_in_stock,
        type,
        note
      } = req.body;

      // Basic validation could be added here or via middleware

      if (!product_id || !region_id || !user_id || !change_in_stock || !type) {
        throw new HttpException(400, 'Missing required fields');
      }

      const id = uuidv4();

      const affectedRows = await StockMovementModel.create({
        id,
        product_id,
        region_id,
        user_id,
        change_in_stock,
        type,
        note
      });

      if (!affectedRows) {
        throw new HttpException(500, 'Failed to create stock movement');
      }

      res.status(201).json({ message: 'Stock movement created', id });
    } catch (error) {
      next(error);
    }
  };

  // Get all stock movements (GET /stock_movements)
  getAllStockMovements = async (req, res, next) => {
    try {
      const records = await StockMovementModel.find();
      res.json(records);
    } catch (error) {
      next(error);
    }
  };

  // Get a single stock movement by id (GET /stock_movements/:id)
  getStockMovementById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const record = await StockMovementModel.findOne({ id });

      if (!record) {
        throw new HttpException(404, 'Stock movement not found');
      }

      res.json(record);
    } catch (error) {
      next(error);
    }
  };

  // Get movements for a product (GET /products/:product_id/stock_movements)
  getStockMovementsByProduct = async (req, res, next) => {
    try {
      const product_id = req.params.product_id;
      const records = await StockMovementModel.find({ product_id });

      res.json(records);
    } catch (error) {
      next(error);
    }
  };

  // Get movements by user (GET /users/:user_id/stock_movements)
  getStockMovementsByUser = async (req, res, next) => {
    try {
      const user_id = req.params.user_id;
      const records = await StockMovementModel.find({ user_id });
      res.json(records);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new StockMovementController();
