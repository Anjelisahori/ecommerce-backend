const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/roleAuth');

// Ruta protegida (Admin)
router.get('/dashboard', authenticateToken, authorizeRole('admin'), statsController.getDashboardStats);

module.exports = router;