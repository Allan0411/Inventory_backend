const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const auth=require('../middleware/auth.middleware');

const {
  createCategorySchema,
  updateCategorySchema
} = require('../middleware/validators/categoryValidator.middleware');

// Create category
router.post('/', auth('Admin'), createCategorySchema, awaitHandlerFactory(categoryController.createCategory));

// List all categories
router.get('/', auth(), awaitHandlerFactory(categoryController.getAllCategories));

// Get category by ID
router.get('/:category_id', auth(), awaitHandlerFactory(categoryController.getCategoryById));

// Update category by ID
router.put('/:category_id', auth('Admin'), updateCategorySchema, awaitHandlerFactory(categoryController.updateCategory));

// Delete category by ID
router.delete('/:category_id', auth('Admin'), awaitHandlerFactory(categoryController.deleteCategory));

module.exports = router;
