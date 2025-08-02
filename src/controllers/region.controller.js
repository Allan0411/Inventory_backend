const RegionModel = require('../models/region.model');
const HttpException = require('../utils/HttpException.utils');



class RegionController {
    // GET all regions
    getAll = async (req, res, next) => {
        const regions = await RegionModel.find();
        if (!regions.length) {
            throw new HttpException(404, 'No regions found');
        }
        res.send(regions);
    };

    // GET region by ID
    getById = async (req, res, next) => {
        const region = await RegionModel.findOne({ region_id: req.params.id });
        if (!region) {
            throw new HttpException(404, 'Region not found');
        }
        res.send(region);
    };

    // POST create region
    create = async (req, res, next) => {
        const result = await RegionModel.create(req.body);
        if (!result) {
            throw new HttpException(500, 'Region creation failed');
        }
        res.status(201).send('Region created successfully');
    };

    // PATCH update region
    update = async (req, res, next) => {
        const result = await RegionModel.update(req.body, req.params.id);
        if (!result) {
            throw new HttpException(404, 'Region not found or update failed');
        }
        res.send({ message: 'Region updated successfully' });
    };

    // DELETE region
    delete = async (req, res, next) => {
        const result = await RegionModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Region not found');
        }
        res.send('Region deleted successfully');
    };
}

module.exports = new RegionController();
