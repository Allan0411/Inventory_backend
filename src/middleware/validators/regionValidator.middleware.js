const { body } = require('express-validator');

exports.createRegionValidator = [
    body('region_id').notEmpty().withMessage('region_id is required'),
    body('name').notEmpty().withMessage('Region name is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('capacity').isNumeric().withMessage('Capacity must be a number'),
];

exports.updateRegionValidator = [
    body('name').optional().notEmpty().withMessage('Region name cannot be empty'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('capacity').optional().isNumeric().withMessage('Capacity must be a number'),
];
