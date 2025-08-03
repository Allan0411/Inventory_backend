const { body, param, query } = require('express-validator');

// For creation: require all fields
exports.createCurrentStockSchema = [
  body('product_id')
    .exists().withMessage('product_id is required')
    .isString().withMessage('product_id must be a string'),
  body('region_id')
    .exists().withMessage('region_id is required')
    .isString().withMessage('region_id must be a string'),
  body('quantity')
    .exists().withMessage('quantity is required')
    .isInt({ min: 0 }).withMessage('quantity must be a non-negative integer'),
];

// For update: just quantity, required and non-negative integer
exports.updateCurrentStockSchema = [
  body('quantity')
    .exists().withMessage('quantity is required')
    .isInt({ min: 0 }).withMessage('quantity must be a non-negative integer')
];
