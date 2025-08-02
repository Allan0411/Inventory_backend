const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { body } = require('express-validator');

const categoryValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().isString()
];

// Create category
router.post('/', categoryValidationRules, categoryController.createCategory);

// List all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID
router.get('/:category_id', categoryController.getCategoryById);

// Update category by ID
router.put(
  '/:category_id',
  categoryValidationRules,
  categoryController.updateCategory
);

// Delete category by ID
router.delete('/:category_id', categoryController.deleteCategory);

module.exports = router;
