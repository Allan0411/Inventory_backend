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
      const records = await CurrentStockModel.find({ product_id });
      res.json(records);
    } catch (error) {
      next(error);
    }
  };

  getStockByRegion=async (req,res,next)=>{
    try{
      const{region_id}=req.params;
    const records=await CurrentStockModel.find({region_id});
    res.json(records);
    }
  
    catch(err){
      next(err);
    }
  };
  // c) Get stock of a product in a particular region: GET /current_stock?product_id={id}&region_id={id}
  getStockByProductAndRegion = async (req, res, next) => {
    try {
      const { product_id, region_id } = req.query;
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
      console.log(product_id,region_id);
      const updateFields = req.body;
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
      const affectedRows = await CurrentStockModel.delete(product_id, region_id);
      if (!affectedRows) {
        throw new HttpException(404, 'Current stock record not found');
      }
      res.json({ message: 'Current stock record deleted' });
    } catch (error) {
      next(error);
    }
  };

  // http://localhost:3000/api/v1/current_stock/low?threshold=number
  getLowStock = async (req, res, next) => {
    try {
      let { threshold } = req.query;
      threshold = threshold !== undefined ? Number(threshold) : 10;
      if (isNaN(threshold) || threshold < 0) {
        throw new HttpException(400, 'Threshold must be a non-negative number');
      }
      const lowStockRecords = await CurrentStockModel.findLowStock(threshold);
      console.log(lowStockRecords);
      res.status(200).json(lowStockRecords);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new CurrentStockController();
