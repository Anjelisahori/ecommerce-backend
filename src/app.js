const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Define todos los orígenes permitidos en un array
const allowedOrigins = [
  // La URL temporal de Vercel que da el error
  'https://ecommerce-frontend-eta-sepia-88.vercel.app',

  // Tu dominio local para desarrollo
  'http://localhost:3000',
];

// 2. Filtra los valores nulos o indefinidos (por si FRONTEND_URL no está definido)
const finalOrigins = allowedOrigins.filter(Boolean);


// 3. Aplica la configuración de CORS
app.use(cors({
  // Asigna el array de orígenes
  origin: finalOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================================
// IMPORTAR RUTAS
// =============================================
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const ordersRoutes = require('./routes/orders.routes');
const usersRoutes = require('./routes/users.routes');
const statsRoutes = require('./routes/stats.routes');

// =============================================
// RUTAS
// =============================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API E-Commerce de Ropa',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      users: '/api/users',
      stats: '/api/stats'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stats', statsRoutes);

// =============================================
// MANEJO DE ERRORES 404
// =============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada.'
  });
});

// =============================================
// MANEJO DE ERRORES GLOBAL
// =============================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor.'
  });
});

// =============================================
// INICIAR SERVIDOR
// =============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════╗
    ║   🚀 SERVIDOR CORRIENDO               ║
    ║   📍 Puerto: ${PORT}                     ║
    ║   🌍 Entorno: ${process.env.NODE_ENV || 'development'}      ║
    ║   🔗 URL: http://localhost:${PORT}       ║
    ╚═══════════════════════════════════════╝
  `);
});

module.exports = app;