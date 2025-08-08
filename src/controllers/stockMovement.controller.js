const { v4: uuidv4 } = require('uuid');
const StockMovementModel = require('../models/stockMovement.model');
const HttpException = require('../utils/HttpException.utils');
const currentStockModel = require('../models/currentStock.model');
const RegionModel=require('../models/region.model');
class StockMovementController {
  checkValidation = (req) => {
    const { validationResult } = require('express-validator');
    const HttpException = require('../utils/HttpException.utils');
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new HttpException(400, 'Validation failed', errors.array());
  };

  createStockMovement = async (req, res, next) => {
    try {
      this.checkValidation(req);
      const {
        product_id,
        region_id,
        user_id,
        change_in_stock,
        type,
        note,
        status = 'pending',
        tracking_url = null
      } = req.body;

    

      const id = uuidv4();
      const affectedRows = await StockMovementModel.create({
        id, product_id, region_id, user_id, change_in_stock, type, note, status, tracking_url
      });
    
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
      if (!record) throw new HttpException(404, 'Stock movement not found');
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

  getStockMovementByRegion=async(req,res,next)=>{
    try{
      const region_id=req.params.region_id;
      const records=await StockMovementModel.find({region_id});
      res.json(records);
    }
    catch(error){
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

  updateStatus = async (req, res, next) => {
    try {
      this.checkValidation(req);
      const{id}=req.params;
      const {status}=req.body;
      if(!status) throw new HttpException(400,'Status is required');

       const stockMovementArr=await StockMovementModel.find({id});
       const stockMovement=Array.isArray(stockMovementArr) && stockMovementArr.length>0 ? stockMovementArr[0]:null;

       if(!stockMovement)
          throw new HttpException(404,'Stock Movement not found');

       const oldStatus=stockMovement.status;

       const statusOrder={'pending':1,'in-transit':2,'delivered':3};
       if(oldStatus=='delivered')
          throw new HttpException(400,'Delivered stock movement status cannot be changed');
       
       if (!(statusOrder[status] && statusOrder[status] === statusOrder[oldStatus] + 1)) {
        throw new HttpException(
          400,
          `Invalid status transition: ${oldStatus} → ${status}. Only forward status movement allowed`
        );
      }

      // Only update the status after all checks and stock updates for 'delivered'
      if(status === 'delivered') {
        const { product_id, region_id, change_in_stock } = stockMovement;
        const regionArr = await RegionModel.find({ region_id });
        const region = Array.isArray(regionArr) && regionArr.length > 0 ? regionArr[0] : null;
        const capacity = region ? region.capacity : null;
        const regionName=region.name;
        if (capacity == null)
          throw new HttpException(404, 'Region not found');

        const inUse = await currentStockModel.getRegionCapacityInUse(region_id);
        let currentStockEntryArr = await currentStockModel.findOne({ product_id, region_id });
        let old_quantity = 0;
        if (Array.isArray(currentStockEntryArr) && currentStockEntryArr.length > 0) {
          old_quantity = currentStockEntryArr[0].quantity;
        }

        let new_quantity = old_quantity + change_in_stock;
        let future_in_use = inUse + change_in_stock;

        if (future_in_use > capacity) {
          throw new HttpException(400, `Capacity Exceeded at region ${regionName} : capacity is ${capacity}; trying to add ${change_in_stock} to ${inUse} `);
        }

        let affectedRows2;
        if (old_quantity === 0) {
          // Create
          affectedRows2 = await currentStockModel.create({
            product_id,
            region_id,
            quantity: new_quantity
          });
          if (!affectedRows2) throw new HttpException(500, 'Failed to create current stock entry');
        } else {
          // Update
          affectedRows2 = await currentStockModel.update({ quantity: new_quantity }, product_id, region_id);
          if (!affectedRows2) throw new HttpException(500, 'Failed to update current stock');
        }

        // Now update the status to 'delivered'
        const affectedRows = await StockMovementModel.updateStatus(id, status);
        if (!affectedRows)
          throw new HttpException(404, "stock movement not found or status unchanged");
      } else {
        // For other statuses, update status as before
        const affectedRows = await StockMovementModel.updateStatus(id, status);
        if (!affectedRows)
          throw new HttpException(404, "stock movement not found or status unchanged");
      }
      res.json({message:'Status updated',id,status});

    } catch (error) {
      next(error);
    }
  };

  updateTrackingUrl = async (req, res, next) => {
    try {
      this.checkValidation(req);
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
