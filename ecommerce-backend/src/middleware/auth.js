const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acceso denegado. No se proporcionó token.' 
      });
    }

    // Verificar token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          success: false, 
          message: 'Token inválido o expirado.' 
        });
      }

      // Agregar información del usuario al request
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error en la autenticación.' 
    });
  }
};

module.exports = authenticateToken;