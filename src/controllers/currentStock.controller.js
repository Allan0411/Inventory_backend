const CurrentStockModel = require('../models/currentStock.model');
const HttpException = require('../utils/HttpException.utils');

class CurrentStockController {
  // a) View current stock: GET /current_stock
  getAllCurrentStock = async (req, res, next) => {
    try {
      const allStocks = await CurrentStockModel.find();
      res.json(allStocks);
    } catch (error) {
      next(error);
    }
  };

  // b) Get product stock across all regions: GET /current_stock/product/:product_id
  getStockByProduct = async (req, res, next) => {
    try {
      const { product_id } = req.params;
      if (!product_id) {
        throw new HttpException(400, 'Product ID is required');
      }
      const records = await CurrentStockModel.find({ product_id });
      res.json(records);
    } catch (error) {
      next(error);
    }
  };

  // c) Get stock of a product in a particular region: GET /current_stock?product_id={id}&region_id={id}
  getStockByProductAndRegion = async (req, res, next) => {
    try {
      const { product_id, region_id } = req.query;

      if (!product_id || !region_id) {
        throw new HttpException(400, 'Both product_id and region_id are required');
      }

      const record = await CurrentStockModel.findOne({ product_id, region_id });

      if (!record) {
        throw new HttpException(404, 'Stock record not found for given product and region');
      }

      res.json(record);
    } catch (error) {
      next(error);
    }
  };

  // Create a new current stock record: POST /current_stock
  createCurrentStock = async (req, res, next) => {
    try {
      const { product_id, region_id, quantity } = req.body;

      if (!product_id || !region_id || quantity === undefined) {
        throw new HttpException(400, 'product_id, region_id and quantity are required');
      }

      const affectedRows = await CurrentStockModel.create({ product_id, region_id, quantity });

      if (!affectedRows) {
        throw new HttpException(500, 'Failed to create current stock record');
      }

      res.status(201).json({ message: 'Current stock record created' });
    } catch (error) {
      next(error);
    }
  };

  // Update quantity (or other fields) of existing current stock record: PATCH /current_stock/:product_id/:region_id
  updateCurrentStock = async (req, res, next) => {
    try {
      const { product_id, region_id } = req.params;
      const updateFields = req.body;

      if (!product_id || !region_id) {
        throw new HttpException(400, 'product_id and region_id are required in params');
      }

      if (!Object.keys(updateFields).length) {
        throw new HttpException(400, 'No fields to update provided');
      }

      const result = await CurrentStockModel.update(updateFields, product_id, region_id);

      if (!result) {
        throw new HttpException(404, 'Current stock record not found');
      }

      const { affectedRows, changedRows } = result;
      const message = !affectedRows
        ? 'Current stock record not found'
        : changedRows
          ? 'Current stock updated successfully'
          : 'No changes made to current stock';

      res.json({ message });
    } catch (error) {
      next(error);
    }
  };

  // Delete a current stock record: DELETE /current_stock/:product_id/:region_id
  deleteCurrentStock = async (req, res, next) => {
    try {
      const { product_id, region_id } = req.params;

      if (!product_id || !region_id) {
        throw new HttpException(400, 'product_id and region_id are required in params');
      }

      const affectedRows = await CurrentStockModel.delete(product_id, region_id);

      if (!affectedRows) {
        throw new HttpException(404, 'Current stock record not found');
      }

      res.json({ message: 'Current stock record deleted' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new CurrentStockController();
