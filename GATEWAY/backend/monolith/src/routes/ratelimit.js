const express = require('express');
const router = express.Router();
const rateLimitController = require('../controllers/rateLimitController');

router.post('/check', rateLimitController.checkRateLimit);

module.exports = router;
