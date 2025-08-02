const express = require('express');
const router = express.Router();
const regionController = require('../controllers/region.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

// Routes
router.get('/', awaitHandlerFactory(regionController.getAll)); // GET all regions
router.get('/:id', awaitHandlerFactory(regionController.getById)); // GET region by ID
router.post('/', awaitHandlerFactory(regionController.create)); // Create region
router.patch('/:id', awaitHandlerFactory(regionController.update)); // Update region
router.delete('/:id', awaitHandlerFactory(regionController.delete)); // Delete region

module.exports = router;
