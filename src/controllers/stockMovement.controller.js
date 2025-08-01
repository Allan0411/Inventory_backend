const { v4: uuidv4 } = require('uuid');
const StockMovementModel = require('../models/stockMovement.model');
const HttpException = require('../utils/HttpException.utils');
const currentStockModel = require('../models/currentStock.model');
class StockMovementController {
  
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

      if (
        !product_id ||
        !region_id ||
        !user_id ||
        typeof change_in_stock !== 'number' ||
        !type
      ) {
        throw new HttpException(400, 'Missing required fields');
      }

      // Check if current_stock entry exists for product_id and region_id
      const currentStockEntryArr = await currentStockModel.findOne({
        product_id,
        region_id
      });

      let old_quantity = 0;
      let new_quantity = 0;
      let entryExists = false;
      let currentStockEntry = null;

      // According to the model, findOne returns an array of rows (possibly empty)
      if (Array.isArray(currentStockEntryArr) && currentStockEntryArr.length > 0) {
        entryExists = true;
        currentStockEntry = currentStockEntryArr[0];
        old_quantity = currentStockEntry.quantity;
      } else {
        old_quantity = 0;
      }
      new_quantity = old_quantity + change_in_stock;

      if (new_quantity < 0) {
        throw new HttpException(400, 'Stock cannot be negative');
      }

      // Create stock movement record
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

      let affectedRows2;
      if (entryExists) {
        // Update existing current_stock entry
        affectedRows2 = await currentStockModel.update(
          { quantity: new_quantity },
          product_id,
          region_id
        );
      } else {
        // Create new current_stock entry
        affectedRows2 = await currentStockModel.create({
          product_id,
          region_id,
          quantity: new_quantity
        });
      }

      if (!affectedRows2) {
        throw new HttpException(500, 'Failed to update/create current stock');
      }

      res.status(201).json({ message: 'Stock movement created', id });
    } catch (error) {
      next(error);
    }
  };


  getAllStockMovements = async (req, res, next) => {
    try {
      const records = await StockMovementModel.find();
      res.json(records);
    } catch (error) {
      next(error);
    }
  };


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


  getStockMovementsByProduct = async (req, res, next) => {
    try {
      const product_id = req.params.product_id;
      const records = await StockMovementModel.find({ product_id });

      res.json(records);
    } catch (error) {
      next(error);
    }
  };

  
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
