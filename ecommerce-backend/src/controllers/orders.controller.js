const db = require('../config/database');

// Generar número de orden único
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

// Crear orden
exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      items, // [{ product_id, color, size, quantity, price }]
      payment_method,
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_district,
      shipping_reference
    } = req.body;

    // Validar datos
    if (!items || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'No hay productos en la orden.' 
      });
    }

    if (!payment_method || !shipping_name || !shipping_phone || !shipping_address || !shipping_district) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan datos de envío o pago.' 
      });
    }

    // Validar y verificar stock
    for (let item of items) {
      const [stockResult] = await connection.query(
        'SELECT stock FROM product_stock WHERE product_id = ? AND size = ?',
        [item.product_id, item.size]
      );

      if (stockResult.length === 0 || stockResult[0].stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ 
          success: false, 
          message: `Stock insuficiente para el producto ${item.product_id} talla ${item.size}.` 
        });
      }
    }

    // Calcular total
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping_cost = 10.00;
    const total = subtotal + shipping_cost;

    // Generar número de orden
    const order_number = generateOrderNumber();

    // Simular procesamiento de pago (solo para tarjetas de prueba)
    let payment_status = 'aprobado';
    if (payment_method === 'tarjeta') {
      // Lógica de simulación de pago
      // En producción, aquí irían las integraciones con pasarelas de pago reales
      const card_number = req.body.card_number || '';
      if (card_number === '4000000000000002') {
        payment_status = 'rechazado';
      }
    }

    if (payment_status === 'rechazado') {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Pago rechazado. Por favor, intente con otro método de pago.' 
      });
    }

    // Crear orden
    const [orderResult] = await connection.query(
      `INSERT INTO orders (
        user_id, order_number, total, shipping_cost, payment_method, payment_status,
        shipping_name, shipping_phone, shipping_address, shipping_district, shipping_reference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, order_number, total, shipping_cost, payment_method, payment_status,
        shipping_name, shipping_phone, shipping_address, shipping_district, shipping_reference
      ]
    );

    const orderId = orderResult.insertId;

    // Insertar items y actualizar stock
    for (let item of items) {
      // Obtener nombre del producto
      const [product] = await connection.query(
        'SELECT name FROM products WHERE id = ?',
        [item.product_id]
      );

      const subtotalItem = item.price * item.quantity;

      // Insertar item
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, color, size, quantity, price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, product[0].name, item.color, item.size, item.quantity, item.price, subtotalItem]
      );

      // Actualizar stock
      await connection.query(
        'UPDATE product_stock SET stock = stock - ? WHERE product_id = ? AND size = ?',
        [item.quantity, item.product_id, item.size]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente.',
      order: {
        id: orderId,
        order_number,
        total,
        payment_status
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear orden:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear orden.' 
    });
  } finally {
    connection.release();
  }
};

// Obtener órdenes del usuario
exports.getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT id, order_number, total, status, payment_method, created_at 
       FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener órdenes.' 
    });
  }
};

// Obtener detalle de una orden
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la orden pertenezca al usuario (o sea admin)
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ? AND (user_id = ? OR ? = "admin")',
      [id, req.user.id, req.user.role]
    );

    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Orden no encontrada.' 
      });
    }

    const order = orders[0];

    // Obtener items de la orden
    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    order.items = items;

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener orden.' 
    });
  }
};

// Obtener todas las órdenes (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;

    const params = [];

    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const [orders] = await db.query(query, params);

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener órdenes.' 
    });
  }
};

// Actualizar estado de orden (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pendiente', 'en_proceso', 'enviado', 'entregado', 'cancelado'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Estado inválido.' 
      });
    }

    await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({
      success: true,
      message: 'Estado de orden actualizado exitosamente.'
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar estado.' 
    });
  }
};