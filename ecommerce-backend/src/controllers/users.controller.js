const db = require('../config/database');

// Obtener todos los usuarios (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        u.active, 
        u.created_at,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener usuarios.' 
    });
  }
};

// Obtener usuario por ID (Admin)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        u.active, 
        u.created_at,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.id = ?
      GROUP BY u.id
    `, [id]);

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado.' 
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener usuario.' 
    });
  }
};

// Cambiar rol de usuario (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['cliente', 'admin'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rol inválido.' 
      });
    }

    // No permitir que un admin se quite sus propios permisos
    if (id === req.user.id.toString() && role === 'cliente') {
      return res.status(400).json({ 
        success: false, 
        message: 'No puedes cambiar tu propio rol.' 
      });
    }

    await db.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    res.json({
      success: true,
      message: 'Rol actualizado exitosamente.'
    });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar rol.' 
    });
  }
};

// Activar/Desactivar usuario (Admin)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    // No permitir que un admin se desactive a sí mismo
    if (id === req.user.id.toString() && !active) {
      return res.status(400).json({ 
        success: false, 
        message: 'No puedes desactivar tu propia cuenta.' 
      });
    }

    await db.query(
      'UPDATE users SET active = ? WHERE id = ?',
      [active, id]
    );

    res.json({
      success: true,
      message: active ? 'Usuario activado exitosamente.' : 'Usuario desactivado exitosamente.'
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al cambiar estado.' 
    });
  }
};

// Eliminar usuario permanentemente (Admin) - NUEVA FUNCIÓN
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir que un admin se elimine a sí mismo
    if (id === req.user.id.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: 'No puedes eliminar tu propia cuenta.' 
      });
    }

    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado.' 
      });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado permanentemente.'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar usuario. Verifica que no tenga pedidos asociados o intenta desactivarlo.' 
    });
  }
};