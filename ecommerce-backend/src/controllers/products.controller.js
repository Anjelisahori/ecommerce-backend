const db = require('../config/database');

// Obtener todos los productos con filtros
exports.getAllProducts = async (req, res) => {
  try {
    const { 
      gender, 
      category, 
      style, 
      minPrice, 
      maxPrice, 
      color, 
      search,
      limit = 50,
      offset = 0
    } = req.query;

    let query = `
      SELECT DISTINCT
        p.*,
        COALESCE(SUM(ps.stock), 0) as total_stock
      FROM products p
      LEFT JOIN product_stock ps ON p.id = ps.product_id
      WHERE p.active = true
    `;
    const params = [];

    // Filtros
    if (gender) {
      query += ' AND p.gender = ?';
      params.push(gender);
    }

    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }

    if (style) {
      query += ' AND p.style = ?';
      params.push(style);
    }

    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (search) {
      query += ' AND p.name LIKE ?';
      params.push(`%${search}%`);
    }

    if (color) {
      query += ` AND p.id IN (
        SELECT product_id FROM product_colors WHERE color_name = ?
      )`;
      params.push(color);
    }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await db.query(query, params);

    // Obtener imágenes, colores y stock para cada producto
    for (let product of products) {
      // Imágenes
      const [images] = await db.query(
        'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order',
        [product.id]
      );
      product.images = images.map(img => img.image_url);

      // Colores
      const [colors] = await db.query(
        'SELECT color_name, color_hex FROM product_colors WHERE product_id = ?',
        [product.id]
      );
      product.colors = colors;

      // Stock por talla
      const [stock] = await db.query(
        'SELECT size, stock FROM product_stock WHERE product_id = ?',
        [product.id]
      );
      product.stock_by_size = stock;
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener productos.' 
    });
  }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ? AND active = true',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Producto no encontrado.' 
      });
    }

    const product = products[0];

    // Imágenes
    const [images] = await db.query(
      'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order',
      [id]
    );
    product.images = images.map(img => img.image_url);

    // Colores
    const [colors] = await db.query(
      'SELECT color_name, color_hex FROM product_colors WHERE product_id = ?',
      [id]
    );
    product.colors = colors;

    // Stock por talla
    const [stock] = await db.query(
      'SELECT size, stock FROM product_stock WHERE product_id = ?',
      [id]
    );
    product.stock_by_size = stock;

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener producto.' 
    });
  }
};

// Crear producto (Admin)
exports.createProduct = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      name,
      description,
      price,
      gender,
      category,
      style,
      material,
      care_instructions,
      is_new,
      images,
      colors,
      stock
    } = req.body;

    // Validar datos básicos
    if (!name || !price || !gender || !category || !style) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos obligatorios.' 
      });
    }

    // Insertar producto
    const [result] = await connection.query(
      `INSERT INTO products (name, description, price, gender, category, style, material, care_instructions, is_new) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, gender, category, style, material, care_instructions, is_new || false]
    );

    const productId = result.insertId;

    // Insertar imágenes
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await connection.query(
          'INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)',
          [productId, images[i], i + 1]
        );
      }
    }

    // Insertar colores
    if (colors && colors.length > 0) {
      for (let color of colors) {
        await connection.query(
          'INSERT INTO product_colors (product_id, color_name, color_hex) VALUES (?, ?, ?)',
          [productId, color.name, color.hex]
        );
      }
    }

    // Insertar stock por tallas
    if (stock && stock.length > 0) {
      for (let s of stock) {
        await connection.query(
          'INSERT INTO product_stock (product_id, size, stock) VALUES (?, ?, ?)',
          [productId, s.size, s.quantity]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente.',
      productId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear producto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear producto.' 
    });
  } finally {
    connection.release();
  }
};

// Actualizar producto (Admin)
exports.updateProduct = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { id } = req.params;
    await connection.beginTransaction();

    const {
      name,
      description,
      price,
      gender,
      category,
      style,
      material,
      care_instructions,
      is_new,
      images,
      colors,
      stock
    } = req.body;

    // Actualizar producto
    await connection.query(
      `UPDATE products SET 
        name = ?, description = ?, price = ?, gender = ?, category = ?, 
        style = ?, material = ?, care_instructions = ?, is_new = ?
       WHERE id = ?`,
      [name, description, price, gender, category, style, material, care_instructions, is_new, id]
    );

    // Actualizar imágenes
    if (images) {
      await connection.query('DELETE FROM product_images WHERE product_id = ?', [id]);
      for (let i = 0; i < images.length; i++) {
        await connection.query(
          'INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)',
          [id, images[i], i + 1]
        );
      }
    }

    // Actualizar colores
    if (colors) {
      await connection.query('DELETE FROM product_colors WHERE product_id = ?', [id]);
      for (let color of colors) {
        await connection.query(
          'INSERT INTO product_colors (product_id, color_name, color_hex) VALUES (?, ?, ?)',
          [id, color.name, color.hex]
        );
      }
    }

    // Actualizar stock
    if (stock) {
      await connection.query('DELETE FROM product_stock WHERE product_id = ?', [id]);
      for (let s of stock) {
        await connection.query(
          'INSERT INTO product_stock (product_id, size, stock) VALUES (?, ?, ?)',
          [id, s.size, s.quantity]
        );
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente.'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar producto.' 
    });
  } finally {
    connection.release();
  }
};

// Eliminar producto (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('UPDATE products SET active = false WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente.'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar producto.' 
    });
  }
};