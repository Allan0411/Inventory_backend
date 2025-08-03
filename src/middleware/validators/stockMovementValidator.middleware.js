const { body } = require('express-validator');

exports.createStockMovementSchema = [
  body('product_id')
    .exists().withMessage('product_id is required')
    .isString().withMessage('product_id must be a string'),
  body('region_id')
    .exists().withMessage('region_id is required')
    .isString().withMessage('region_id must be a string'),
  body('user_id')
    .exists().withMessage('user_id is required')
    .isString().withMessage('user_id must be a string'),
  body('change_in_stock')
    .exists().withMessage('change_in_stock is required')
    .isInt().withMessage('change_in_stock must be an integer'),
  body('type')
    .exists().withMessage('type is required')
    .isIn(['in', 'out']).withMessage('type must be "in" or "out"'),
  body('note')
    .optional().isString().withMessage('note must be text'),
  body('status')
    .optional().isString().withMessage('status must be a string'),
  body('tracking_url')
    .optional().isString().withMessage('tracking_url must be a string'),
];

exports.updateStatusSchema = [
  body('status')
    .exists().withMessage('Status is required')
    .isString().withMessage('Status must be a string')
];
exports.updateTrackingUrlSchema = [
  body('tracking_url')
    .exists().withMessage('Tracking URL is required')
    .isString().withMessage('Tracking URL must be a string')
];
