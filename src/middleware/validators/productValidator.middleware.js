// middlewares/validators/productValidator.js
const { body } = require('express-validator');

exports.createProductSchema = [
    body('product_id')
        .exists().withMessage('Product ID is required')
        .isString().withMessage('Product ID must be a string'),

    body('name')
        .exists().withMessage('Product name is required')
        .isLength({ min: 2 }).withMessage('Product name must be at least 2 characters long'),

    body('category_id')
        .exists().withMessage('Category ID is required')
        .isString().withMessage('Category ID must be a string'),

    body('description')
        .optional()
        .isString().withMessage('Description must be text'),

    body('price')
        .optional()
        .isDecimal().withMessage('Price must be a decimal number'),

    body('life_time')
        .optional()
        .isInt({ min: 0 }).withMessage('Life time must be a non-negative integer'),

    body('additional_details')
        .optional()
        .isString().withMessage('Additional details must be text'),

    body('is_clearance')
        .optional()
        .isIn([0, 1]).withMessage('is_clearance must be either 0 or 1')
];

exports.updateProductSchema = [
    body('product_id')
        .optional()
        .isString().withMessage('Product ID must be a string'),

    body('name')
        .optional()
        .isLength({ min: 2 }).withMessage('Product name must be at least 2 characters long'),

    body('category_id')
        .optional()
        .isString().withMessage('Category ID must be a string'),

    body('description')
        .optional()
        .isString().withMessage('Description must be text'),

    body('price')
        .optional()
        .isDecimal().withMessage('Price must be a decimal number'),

    body('life_time')
        .optional()
        .isInt({ min: 0 }).withMessage('Life time must be a non-negative integer'),

    body('additional_details')
        .optional()
        .isString().withMessage('Additional details must be text'),

    body('is_clearance')
        .optional()
        .isIn([0, 1]).withMessage('is_clearance must be either 0 or 1'),

    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide at least one field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['product_id', 'name', 'category_id', 'description', 'price', 'life_time', 'additional_details', 'is_clearance'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];
