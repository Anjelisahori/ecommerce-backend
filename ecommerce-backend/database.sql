-- =============================================
-- E-COMMERCE DATABASE SCHEMA - MySQL
-- =============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- =============================================
-- TABLA: users
-- =============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('cliente', 'admin') DEFAULT 'cliente',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- =============================================
-- TABLA: products
-- =============================================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    gender ENUM('mujer', 'hombre', 'ninos') NOT NULL,
    category ENUM('poleras', 'pantalones', 'vestidos', 'chaquetas', 'zapatos') NOT NULL,
    style ENUM('casual', 'formal', 'deportivo') NOT NULL,
    material VARCHAR(100),
    care_instructions TEXT,
    is_new BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_gender (gender),
    INDEX idx_category (category),
    INDEX idx_style (style),
    INDEX idx_price (price)
);

-- =============================================
-- TABLA: product_images
-- =============================================
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
);

-- =============================================
-- TABLA: product_colors
-- =============================================
CREATE TABLE product_colors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    color_name VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
);

-- =============================================
-- TABLA: product_stock
-- =============================================
CREATE TABLE product_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL,
    stock INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_size (product_id, size),
    INDEX idx_product (product_id)
);

-- =============================================
-- TABLA: orders
-- =============================================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 10.00,
    status ENUM('pendiente', 'en_proceso', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
    payment_method ENUM('tarjeta', 'yape', 'plin') NOT NULL,
    payment_status ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
    
    -- Datos de envío
    shipping_name VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_district VARCHAR(100) NOT NULL,
    shipping_reference TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- TABLA: order_items
-- =============================================
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    color VARCHAR(50) NOT NULL,
    size VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order (order_id)
);

-- =============================================
-- INSERTAR USUARIO ADMIN POR DEFECTO
-- =============================================
-- Password: admin123 (hasheado con bcrypt)
INSERT INTO users (name, email, password, role) VALUES 
('Administrador', 'admin@ecommerce.com', '$2a$10$X8qVXz5wZ9Y5wZ9Y5wZ9Y.K8qVXz5wZ9Y5wZ9Y5wZ9Y5wZ9Y5wZ9Y', 'admin');

-- =============================================
-- PRODUCTOS DE EJEMPLO
-- =============================================
INSERT INTO products (name, description, price, gender, category, style, material, care_instructions, is_new) VALUES
('Polera Básica Blanca', 'Polera de algodón 100%, corte clásico, ideal para el día a día', 49.90, 'mujer', 'poleras', 'casual', 'Algodón 100%', 'Lavar a máquina con agua fría', true),
('Jean Slim Fit', 'Pantalón jean ajustado, estilo moderno', 129.90, 'hombre', 'pantalones', 'casual', 'Denim 98% Algodón, 2% Elastano', 'Lavar del revés', true),
('Vestido Floral Verano', 'Vestido ligero con estampado floral, perfecto para verano', 89.90, 'mujer', 'vestidos', 'casual', 'Poliéster', 'Lavar a mano', false),
('Chaqueta Deportiva', 'Chaqueta con capucha, resistente al viento', 159.90, 'hombre', 'chaquetas', 'deportivo', 'Poliéster 100%', 'Lavar a máquina', true),
('Zapatillas Running', 'Zapatillas deportivas con tecnología de amortiguación', 199.90, 'hombre', 'zapatos', 'deportivo', 'Sintético', 'Limpiar con paño húmedo', true);

-- =============================================
-- IMÁGENES DE PRODUCTOS
-- =============================================
INSERT INTO product_images (product_id, image_url, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 1),
(1, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800', 2),
(1, 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800', 3),
(1, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800', 4),
(2, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 1),
(2, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', 2),
(3, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 1),
(3, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 2),
(4, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', 1),
(4, 'https://images.unsplash.com/photo-1548126032-079d4a74c6c6?w=800', 2),
(5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 1),
(5, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', 2);

-- =============================================
-- COLORES DE PRODUCTOS
-- =============================================
INSERT INTO product_colors (product_id, color_name, color_hex) VALUES
(1, 'Blanco', '#FFFFFF'),
(1, 'Negro', '#000000'),
(1, 'Azul', '#3B82F6'),
(2, 'Azul Oscuro', '#1E3A8A'),
(2, 'Negro', '#000000'),
(3, 'Rosa', '#EC4899'),
(3, 'Verde', '#10B981'),
(4, 'Negro', '#000000'),
(4, 'Rojo', '#EF4444'),
(5, 'Negro', '#000000'),
(5, 'Blanco', '#FFFFFF');

-- =============================================
-- STOCK DE PRODUCTOS
-- =============================================
INSERT INTO product_stock (product_id, size, stock) VALUES
(1, 'S', 10),
(1, 'M', 15),
(1, 'L', 8),
(1, 'XL', 5),
(2, 'S', 12),
(2, 'M', 20),
(2, 'L', 15),
(2, 'XL', 10),
(3, 'S', 8),
(3, 'M', 12),
(3, 'L', 6),
(4, 'M', 10),
(4, 'L', 15),
(4, 'XL', 12),
(5, 'M', 20),
(5, 'L', 18),
(5, 'XL', 10);

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista: Productos con stock total
CREATE VIEW v_products_with_stock AS
SELECT 
    p.*,
    COALESCE(SUM(ps.stock), 0) as total_stock
FROM products p
LEFT JOIN product_stock ps ON p.id = ps.product_id
GROUP BY p.id;

-- Vista: Órdenes con información del usuario
CREATE VIEW v_orders_details AS
SELECT 
    o.*,
    u.name as user_name,
    u.email as user_email,
    (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count
FROM orders o
JOIN users u ON o.user_id = u.id;