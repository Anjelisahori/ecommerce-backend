const db = require('../config/database');

// Obtener estadísticas del dashboard (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    // Total ventas del mes
    const [salesResult] = await db.query(`
      SELECT COALESCE(SUM(total), 0) as total_sales
      FROM orders
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
        AND status != 'cancelado'
    `);

    // Total pedidos
    const [ordersResult] = await db.query(`
      SELECT COUNT(*) as total_orders
      FROM orders
      WHERE status != 'cancelado'
    `);

    // Total usuarios
    const [usersResult] = await db.query(`
      SELECT COUNT(*) as total_users
      FROM users
      WHERE active = true
    `);

    // Ventas últimos 7 días
    const [salesByDay] = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(total), 0) as sales
      FROM orders
      WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
        AND status != 'cancelado'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Productos vendidos por categoría
    const [salesByCategory] = await db.query(`
      SELECT 
        p.category,
        COUNT(oi.id) as quantity_sold,
        COALESCE(SUM(oi.subtotal), 0) as total_sales
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelado'
      GROUP BY p.category
      ORDER BY quantity_sold DESC
    `);

    // Últimos 5 pedidos
    const [recentOrders] = await db.query(`
      SELECT 
        o.id,
        o.order_number,
        o.total,
        o.status,
        o.created_at,
        u.name as user_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: {
        total_sales: parseFloat(salesResult[0].total_sales),
        total_orders: ordersResult[0].total_orders,
        total_users: usersResult[0].total_users,
        sales_by_day: salesByDay.map(item => ({
          date: item.date,
          sales: parseFloat(item.sales)
        })),
        sales_by_category: salesByCategory.map(item => ({
          category: item.category,
          quantity_sold: item.quantity_sold,
          total_sales: parseFloat(item.total_sales)
        })),
        recent_orders: recentOrders
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener estadísticas.' 
    });
  }
};