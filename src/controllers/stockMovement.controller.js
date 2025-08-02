const { v4: uuidv4 } = require('uuid');
const StockMovementModel = require('../models/stockMovement.model');
const HttpException = require('../utils/HttpException.utils');
const currentStockModel = require('../models/currentStock.model');

class StockMovementController {
  // Create stock movement and update the CurrentStock table
  createStockMovement = async (req, res, next) => {
    try {
      const {
        product_id,
        region_id,
        user_id,
        change_in_stock,
        type,
        note,
        status = 'pending',          // <-- new: default if not supplied
        tracking_url = null          // <-- new: default if not supplied
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

      const currentStockEntryArr = await currentStockModel.findOne({ product_id, region_id });

      let old_quantity = 0;
      let new_quantity = 0;
      let entryExists = false;

      if (Array.isArray(currentStockEntryArr) && currentStockEntryArr.length > 0) {
        entryExists = true;
        old_quantity = currentStockEntryArr[0].quantity;
      }
      new_quantity = old_quantity + change_in_stock;

      if (new_quantity < 0) {
        throw new HttpException(400, 'Stock cannot be negative');
      }

      const id = uuidv4();
      const affectedRows = await StockMovementModel.create({
        id,
        product_id,
        region_id,
        user_id,
        change_in_stock,
        type,
        note,
        status,
        tracking_url
      });

      if (!affectedRows) {
        throw new HttpException(500, 'Failed to create stock movement');
      }

      let affectedRows2;
      if (entryExists) {
        affectedRows2 = await currentStockModel.update(
          { quantity: new_quantity },
          product_id,
          region_id
        );
      } else {
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
      const record = await StockMovementModel.find({ id });

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

  // PATCH: Update the status of a stock movement
  updateStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) throw new HttpException(400, 'Status is required');
      const affectedRows = await StockMovementModel.updateStatus(id, status);
      if (!affectedRows) throw new HttpException(404, 'Stock movement not found or status unchanged');
      res.json({ message: 'Status updated', id, status });
    } catch (error) {
      next(error);
    }
  };

  // PATCH: Update the tracking URL of a stock movement
  updateTrackingUrl = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { tracking_url } = req.body;
      if (!tracking_url) throw new HttpException(400, 'Tracking URL is required');
      const affectedRows = await StockMovementModel.updateTrackingUrl(id, tracking_url);
      if (!affectedRows) throw new HttpException(404, 'Stock movement not found or tracking URL unchanged');
      res.json({ message: 'Tracking URL updated', id, tracking_url });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new StockMovementController();
