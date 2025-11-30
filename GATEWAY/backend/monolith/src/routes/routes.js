const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateRoute } = require('../middleware/validation');

// Protected routes
router.post('/', authenticate, validateRoute, routeController.createRoute);
router.get('/', authenticate, routeController.getRoutes);
router.get('/lookup', routeController.lookupRoute); // public for gateway
router.get('/:id', authenticate, routeController.getRoute);
router.put('/:id', authenticate, validateRoute, routeController.updateRoute);
router.delete('/:id', authenticate, routeController.deleteRoute);

module.exports = router;
