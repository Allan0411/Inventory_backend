const CategoryModel = require('../models/category.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');

class CategoryController {
    getAllCategories = async (req, res, next) => {
        const categoryList = await CategoryModel.find();
        if (!categoryList.length) {
            throw new HttpException(404, 'Categories not found');
        }
        res.send(categoryList);
    };

    getCategoryById = async (req, res, next) => {
        const category = await CategoryModel.findOne({ category_id: req.params.id });
        if (!category) {
            throw new HttpException(404, 'Category not found');
        }
        res.send(category);
    };

    createCategory = async (req, res, next) => {
        this.checkValidation(req);
        const result = await CategoryModel.create(req.body);
        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }
        res.status(201).send('Category was created!');
    };

    updateCategory = async (req, res, next) => {
        this.checkValidation(req);
        const result = await CategoryModel.update(req.body, req.params.id);
        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;
        const message = !affectedRows ? 'Category not found' :
            changedRows ? 'Category updated successfully' : 'Update failed';

        res.send({ message, info });
    };

    deleteCategory = async (req, res, next) => {
        const result = await CategoryModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Category not found');
        }
        res.send('Category has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    }
}

module.exports = new CategoryController;
