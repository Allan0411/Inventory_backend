const CategoryModel = require('../models/category.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

/**
 * Controller for Category endpoints
 */
class CategoryController {
    // GET /api/v1/categories
    getAllCategories = async (req, res, next) => {
        try {
            const categoryList = await CategoryModel.find();
            if (!categoryList.length) {
                // Instead of error, return 200 with empty array and a message
                return res.status(200).json({
                    message: 'No categories found. The category list is empty.',
                    categories: []
                });
            }
            res.send(categoryList);
        } catch (error) {
            next(error);
        }
    };

    // GET /api/v1/categories/:id
    getCategoryById = async (req, res, next) => {
        const category = await CategoryModel.find({ category_id: req.params.category_id });
        if (!category) {
            throw new HttpException(404, 'Category not found');
        }
        res.send(category);
    };

    // POST /api/v1/categories


    createCategory = async (req, res, next) => {
        this.checkValidation(req);

        const { name, description } = req.body;
        const category_id = 'cat-' + uuidv4();
        console.log(category_id);
        const result = await CategoryModel.create({ category_id, name, description });
        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }
        res.status(201).send('Category was created!');
    };

    // PUT /api/v1/categories/:id
    updateCategory = async (req, res, next) => {
        this.checkValidation(req);
        const { name, description } = req.body;
        const result = await CategoryModel.update({ name, description }, req.params.category_id);
        if (!result) {
            throw new HttpException(404, 'Category not found');
        }
        res.send({ message: 'Category updated successfully' });
    };

    // DELETE /api/v1/categories/:id
    deleteCategory = async (req, res, next) => {
        const result = await CategoryModel.delete(req.params.category_id);
        if (!result) {
            throw new HttpException(404, 'Category not found');
        }
        res.send('Category has been deleted');
    };

    // Utility validation checker
    checkValidation = (req) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    }
}

module.exports = new CategoryController();
