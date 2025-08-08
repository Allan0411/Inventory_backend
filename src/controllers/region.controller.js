const RegionModel = require('../models/region.model');
const { v4: uuidv4 } = require('uuid');

class RegionController {
    getAll = async (req, res, next) => {
        try {
            const regions = await RegionModel.find();
            if (!regions.length) {
                return res.status(200).json({ message: 'No regions found', regions: [] });
            }
            res.json(regions);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req, res, next) => {
        try {
            const region = await RegionModel.findOne({ region_id: req.params.id });
            if (!region) {
                return res.status(200).json({ message: 'Region not found' });
            }
            res.json(region);
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            req.body.region_id = 'region-' + uuidv4();
            const result = await RegionModel.create(req.body);
            if (!result) {
                return res.status(500).json({ message: 'Region creation failed' });
            }
            res.status(201).json({ message: 'Region created successfully' });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const result = await RegionModel.update(req.body, req.params.id);
            if (!result) {
                return res.status(200).json({ message: 'Region not found or update failed' });
            }
            res.json({ message: 'Region updated successfully' });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const result = await RegionModel.delete(req.params.id);
            if (!result) {
                return res.status(200).json({ message: 'Region not found' });
            }
            res.json({ message: 'Region deleted successfully' });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new RegionController();
