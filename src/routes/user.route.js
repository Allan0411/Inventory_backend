const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const { createUserSchema, updateUserSchema } = require('../middleware/validators/userValidator.middleware');



router.post('/login', userController.login); // Login route!
router.post('/', createUserSchema, awaitHandlerFactory(userController.createUser));
router.put('/:id', updateUserSchema, awaitHandlerFactory(userController.updateUser));
router.get('/', awaitHandlerFactory(userController.getAllUsers));
router.get('/:id', awaitHandlerFactory(userController.getUserById));
router.delete('/:id', awaitHandlerFactory(userController.deleteUser));

module.exports = router;
