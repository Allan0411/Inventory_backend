const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
 const { v4: uuidv4 } = require('uuid');
class UserController {
    // GET /api/users
    getAllUsers = async (req, res, next) => {
        const userList = await UserModel.find();
        if (!userList.length) {
            throw new HttpException(404, 'No users found');
        }

        res.send(userList);
    };

    // GET /api/users/:id
    getUserById = async (req, res, next) => {
        const user = await UserModel.findOne({ user_id: req.params.id });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        res.send(user);
    };

    // POST /api/users
    createUser = async (req, res, next) => {
        this.checkValidation(req);
        const user_id = 'user-' + uuidv4();
        const userData = { ...req.body, user_id };
        const result = await UserModel.create(userData);
        if (!result) {
            throw new HttpException(500, 'Failed to create user');
        }

        res.status(201).send('User created successfully');
    };

    // PUT /api/users/:id
    updateUser = async (req, res, next) => {
        this.checkValidation(req);

        const result = await UserModel.update(req.body, req.params.id);
        if (!result) {
            throw new HttpException(404, 'User not found or update failed');
        }

        const { affectedRows, changedRows, info } = result;
        const message = !affectedRows
            ? 'User not found'
            : changedRows
            ? 'User updated successfully'
            : 'Nothing was updated';

        res.send({ message, info });
    };

    // DELETE /api/users/:id
    deleteUser = async (req, res, next) => {
        const result = await UserModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'User not found');
        }

        res.send('User deleted successfully');
    };

    // Validation check helper
    checkValidation = (req) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    };
}

module.exports = new UserController();
