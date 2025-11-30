// backend/monolith/src/routes/apikeys.js

const express = require('express');
const router = express.Router();

const apiKeyController = require('../controllers/apiKeyController');
const { authenticate } = require('../middleware/authMiddleware');

// IMPORTANT: Put validate route FIRST to avoid collision with :userId
router.get('/validate/:apiKey', apiKeyController.validateApiKey);

// Create API key
router.post('/', authenticate, apiKeyController.createApiKey);

// Get all API keys of logged-in user
router.get('/:userId', authenticate, apiKeyController.getApiKeys);

// Rotate API key
router.put('/:id/rotate', authenticate, apiKeyController.rotateApiKey);

// Update API key stats
router.patch('/:id/stats', apiKeyController.updateStats);

// Delete API key
router.delete('/:id', authenticate, apiKeyController.deleteApiKey);

module.exports = router;
