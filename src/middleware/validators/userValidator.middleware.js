// const { body } = require('express-validator');
// const Role = require('../../utils/userRoles.utils');


// exports.createUserSchema = [
//     body('username')
//         .exists()
//         .withMessage('username is required')
//         .isLength({ min: 3 })
//         .withMessage('Must be at least 3 chars long'),
//     body('first_name')
//         .exists()
//         .withMessage('Your first name is required')
//         .isAlpha()
//         .withMessage('Must be only alphabetical chars')
//         .isLength({ min: 3 })
//         .withMessage('Must be at least 3 chars long'),
//     body('last_name')
//         .exists()
//         .withMessage('Your last name is required')
//         .isAlpha()
//         .withMessage('Must be only alphabetical chars')
//         .isLength({ min: 3 })
//         .withMessage('Must be at least 3 chars long'),
//     body('email')
//         .exists()
//         .withMessage('Email is required')
//         .isEmail()
//         .withMessage('Must be a valid email')
//         .normalizeEmail(),
//     body('role')
//         .optional()
//         .isIn([Role.Admin, Role.SuperUser])
//         .withMessage('Invalid Role type'),
//     body('password')
//         .exists()
//         .withMessage('Password is required')
//         .notEmpty()
//         .isLength({ min: 6 })
//         .withMessage('Password must contain at least 6 characters')
//         .isLength({ max: 10 })
//         .withMessage('Password can contain max 10 characters'),
//     body('confirm_password')
//         .exists()
//         .custom((value, { req }) => value === req.body.password)
//         .withMessage('confirm_password field must have the same value as the password field'),
//     body('age')
//         .optional()
//         .isNumeric()
//         .withMessage('Must be a number')
// ];

// exports.updateUserSchema = [
//     body('username')
//         .optional()
//         .isLength({ min: 3 })
//         .withMessage('Must be at least 3 chars long'),
//     body('first_name')
//         .optional()
//         .isAlpha()
//         .withMessage('Must be only alphabetical chars')
//         .isLength({ min: 3 })
//         .withMessage('Must be at least 3 chars long'),
//     body('last_name')
//         .optional()
//         .isAlpha()
//         .withMessage('Must be only alphabetical chars')
//         .isLength({ min: 3 })
//         .withMessage('Must be at least 3 chars long'),
//     body('email')
//         .optional()
//         .isEmail()
//         .withMessage('Must be a valid email')
//         .normalizeEmail(),
//     body('role')
//         .optional()
//         .isIn([Role.Admin, Role.SuperUser])
//         .withMessage('Invalid Role type'),
//     body('password')
//         .optional()
//         .notEmpty()
//         .isLength({ min: 6 })
//         .withMessage('Password must contain at least 6 characters')
//         .isLength({ max: 10 })
//         .withMessage('Password can contain max 10 characters')
//         .custom((value, { req }) => !!req.body.confirm_password)
//         .withMessage('Please confirm your password'),
//     body('confirm_password')
//         .optional()
//         .custom((value, { req }) => value === req.body.password)
//         .withMessage('confirm_password field must have the same value as the password field'),
//     body('age')
//         .optional()
//         .isNumeric()
//         .withMessage('Must be a number'),
//     body()
//         .custom(value => {
//             return !!Object.keys(value).length;
//         })
//         .withMessage('Please provide required field to update')
//         .custom(value => {
//             const updates = Object.keys(value);
//             const allowUpdates = ['username', 'password', 'confirm_password', 'email', 'role', 'first_name', 'last_name', 'age'];
//             return updates.every(update => allowUpdates.includes(update));
//         })
//         .withMessage('Invalid updates!')
// ];

// exports.validateLogin = [
//     body('email')
//         .exists()
//         .withMessage('Email is required')
//         .isEmail()
//         .withMessage('Must be a valid email')
//         .normalizeEmail(),
//     body('password')
//         .exists()
//         .withMessage('Password is required')
//         .notEmpty()
//         .withMessage('Password must be filled')
// ];

const { body } = require('express-validator');

/**
 * Validator for creating a new user
 */
exports.createUserSchema = [
 

  body('name')
    .exists().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),

  body('role')
    .optional()
    .isIn(['Admin', 'User']).withMessage('Role must be either Admin or User'),

  body('contact')
    .optional()
    .isLength({ min: 10, max: 20 }).withMessage('Contact must be between 10 to 20 characters')
];

/**
 * Validator for updating an existing user
 */
exports.updateUserSchema = [
  body('name')
    .optional()
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email'),

  body('role')
    .optional()
    .isIn(['Admin', 'Editor', 'Viewer']).withMessage('Role must be either Admin, Editor or Viewer'),

  body('contact')
    .optional()
    .isLength({ min: 10, max: 20 }).withMessage('Contact must be between 10 to 20 characters'),

  // Check that at least one valid field is provided and no invalid fields
  body().custom(value => {
    const allowedFields = ['name', 'email', 'role', 'contact'];
    const fields = Object.keys(value);
    if (!fields.length) {
      throw new Error('Please provide at least one field to update');
    }
    const isValid = fields.every(field => allowedFields.includes(field));
    if (!isValid) {
      throw new Error('Invalid update fields!');
    }
    return true;
  })
];


exports.validateLogin = [
  body('email')
    .exists().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),

  body('contact')
    .optional()
    .isLength({ min: 10, max: 20 }).withMessage('Contact must be between 10 to 20 characters')
];
