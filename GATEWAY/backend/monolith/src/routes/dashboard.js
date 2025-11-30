const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

// All dashboard routes require authentication
router.get('/stats', authenticate, dashboardController.getUserDashboardStats);
router.get('/stats/all', dashboardController.getDashboardStats); // Admin/public stats

module.exports = router;
