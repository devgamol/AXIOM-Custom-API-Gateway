const express = require('express');
const router = express.Router();

const serviceController = require('../controllers/serviceController');
const { authenticate } = require('../middleware/authMiddleware');

// Create service
router.post('/', authenticate, serviceController.createService);

// Get all services
router.get('/', authenticate, serviceController.getServices);

// Get service by ID
router.get('/:id', authenticate, serviceController.getServiceById);

// Update service
router.put('/:id', authenticate, serviceController.updateService);

// Delete service
router.delete('/:id', authenticate, serviceController.deleteService);

module.exports = router;
