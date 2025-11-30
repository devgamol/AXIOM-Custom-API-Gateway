const express = require('express');
const router = express.Router();
const metricController = require('../controllers/metricController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', metricController.createMetric); // Called by gateway
router.get('/:apiKey', authenticate, metricController.getMetrics);

module.exports = router;
