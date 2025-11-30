const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { authenticate } = require('../middleware/authMiddleware');

// All logs routes require authentication
router.post('/', logController.createLog); // Called by gateway proxy
router.get('/', authenticate, logController.getLogs);

module.exports = router;
