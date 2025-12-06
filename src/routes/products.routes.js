const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/roleAuth');

// Rutas públicas
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);

// Rutas protegidas (Admin)
router.post('/', authenticateToken, authorizeRole('admin'), productsController.createProduct);
router.put('/:id', authenticateToken, authorizeRole('admin'), productsController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('admin'), productsController.deleteProduct);

module.exports = router;