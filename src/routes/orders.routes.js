const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/roleAuth');

// Rutas protegidas (Cliente)
router.post('/', authenticateToken, ordersController.createOrder);
router.get('/my-orders', authenticateToken, ordersController.getMyOrders);
router.get('/:id', authenticateToken, ordersController.getOrderById);

// Rutas protegidas (Admin)
router.get('/', authenticateToken, authorizeRole('admin'), ordersController.getAllOrders);
router.patch('/:id/status', authenticateToken, authorizeRole('admin'), ordersController.updateOrderStatus);

module.exports = router;