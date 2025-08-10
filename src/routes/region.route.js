const express = require('express');
const router = express.Router();
const regionController = require('../controllers/region.controller');
const auth = require('../middleware/auth.middleware');

const { validationResult } = require('express-validator');
const { createRegionValidator, updateRegionValidator } = require('../middleware/validators/regionValidator.middleware');

// Middleware to handle validation result
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// GET all
router.get('/', auth(), regionController.getAll);

// GET by ID
router.get('/:id', auth(), regionController.getById);

// POST create
router.post('/', auth('Admin'), createRegionValidator, handleValidation, regionController.create);

// PATCH update
router.patch('/:id', auth('Admin'), updateRegionValidator, handleValidation, regionController.update);

// DELETE
router.delete('/:id', auth('Admin'), regionController.delete);

module.exports = router;
