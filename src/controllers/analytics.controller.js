const RegionModel = require('../models/region.model');
const CategoryModel = require('../models/category.model');
const CurrentStockModel = require('../models/currentStock.model');
const StockMovementModel = require('../models/stockMovement.model');

class AnalyticsController {
    /**
     * Get region capacity utilization (percent of capacity used per region)
     */
    getRegionCapacityUtilization = async (req, res, next) => {
        try {
            const rows = await RegionModel.getRegionCapacityUtilization();
            res.json(rows);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get region movement summary (transactions, inbound, outbound per region)
     */
    getRegionMovementSummary = async (req, res, next) => {
        try {
            const rows = await RegionModel.getRegionMovementSummary();
            res.json(rows);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get top categories by product count
     */
    getTopCategoriesByProductCount = async (req, res, next) => {
        try {
            const rows = await CategoryModel.getTopCategoriesByProductCount();
            res.json(rows);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get category movement summary (total in/out per category)
     */
    getCategoryMovementSummary = async (req, res, next) => {
        try {
            const rows = await CategoryModel.getCategoryMovementSummary();
            res.json(rows);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get total stock quantity by product
     */
    getTotalQuantityByProduct = async (req, res, next) => {
        try {
            const rows = await CurrentStockModel.getTotalQuantityByProduct();
            res.json(rows);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get total stock quantity by region
     */
    getTotalQuantityByRegion = async (req, res, next) => {
        try {
            const rows = await CurrentStockModel.getTotalQuantityByRegion();
            res.json(rows);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get total stock value (sum of quantity * price for all products in stock)
     */
    getTotalStockValue = async (req, res, next) => {
        try {
            const value = await CurrentStockModel.getTotalStockValue();
            res.json({ total_value: Number(value) });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get total moved in/out by product (from stock movements)
     */
    getTotalMovedByProduct = async (req, res, next) => {
        try {
            // Optionally filter by region_id, date, etc. via query params
            const params = {};
            if (req.query.region_id) params.region_id = req.query.region_id;
            if (req.query.product_id) params.product_id = req.query.product_id;
            const rows = await StockMovementModel.getTotalMovedByProduct(params);
            res.json(rows);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get most active regions by number of stock movements
     */
    getMostActiveRegions = async (req, res, next) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const rows = await StockMovementModel.getMostActiveRegions(limit);
            res.json(rows);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get top delivered products (by number of delivered movements)
     */
    getTopDeliveredProducts = async (req, res, next) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const rows = await StockMovementModel.getTopDeliveredProducts(limit);
            res.json(rows);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get monthly movement summary for a given year
     */
    getMonthlyMovementSummary = async (req, res, next) => {
        try {
            const year = req.query.year ? parseInt(req.query.year) : (new Date()).getFullYear();
            const rows = await StockMovementModel.getMonthlyMovementSummary(year);
            res.json(rows);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AnalyticsController();
