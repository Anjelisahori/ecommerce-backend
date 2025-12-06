const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/roleAuth');

// Todas las rutas requieren autenticación y rol de admin
router.use(authenticateToken);
router.use(authorizeRole('admin'));

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.patch('/:id/role', usersController.updateUserRole);
router.patch('/:id/status', usersController.toggleUserStatus);

// 👇 Esta es la línea nueva que conecta con la función deleteUser del controlador
router.delete('/:id', usersController.deleteUser);

module.exports = router;