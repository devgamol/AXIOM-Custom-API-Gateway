const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { authenticate } = require('../middleware/authMiddleware');

// All API-scoped routes require authentication
router.get('/:apiKey/stats', authenticate, apiController.getApiStats);
router.get('/:apiKey/services', authenticate, apiController.getApiServices);
router.get('/:apiKey/routes', authenticate, apiController.getApiRoutes);
router.get('/:apiKey/logs', authenticate, apiController.getApiLogs);

module.exports = router;
