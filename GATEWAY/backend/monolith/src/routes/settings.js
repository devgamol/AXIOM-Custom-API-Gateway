const express = require('express');
const router = express.Router();

const settingsController = require('../controllers/settingsController');
const { authenticate } = require('../middleware/authMiddleware');

// GET all settings
router.get('/', authenticate, settingsController.getSettings);

// UPDATE settings (bulk update)
router.put('/', authenticate, settingsController.updateSettings);

module.exports = router;
