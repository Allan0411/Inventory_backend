const { body } = require('express-validator');

exports.createCategorySchema = [
    body('category_id')
        .exists().withMessage('Category ID is required')
        .isString().withMessage('Category ID must be a string'),

    body('name')
        .exists().withMessage('Category name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

    body('description')
        .optional()
        .isString().withMessage('Description must be text')
];

exports.updateCategorySchema = [
    body('category_id')
        .optional()
        .isString().withMessage('Category ID must be a string'),

    body('name')
        .optional()
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

    body('description')
        .optional()
        .isString().withMessage('Description must be text'),

    // Ensure at least one valid field is being updated
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide at least one field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowedUpdates = ['category_id', 'name', 'description'];
            return updates.every(update => allowedUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];
