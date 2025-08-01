const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { body } = require('express-validator');

const categoryValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().isString()
];

// a. Add category: POST /category
router.post(
  '/category',
  categoryValidationRules,
  categoryController.createCategory
);
// b. Get all categories: GET /category
router.get('/category', categoryController.getAllCategories);
// c. Get category by id: GET /category/:category_id
router.get('/category/:category_id', categoryController.getCategoryById);
// d. Update category: PUT /category/:category_id
router.put(
  '/category/:category_id',
  categoryValidationRules,
  categoryController.updateCategory
);
// e. Delete category: DELETE /category/:category_id
router.delete('/category/:category_id', categoryController.deleteCategory);

module.exports = router;
