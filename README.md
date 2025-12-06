# 🛒 FINA Perú - E-commerce Backend API

API RESTful robusta para gestionar una plataforma de comercio electrónico. Desarrollada en **Node.js** y **Express**, conectada a una base de datos **MySQL**. Incluye autenticación segura, gestión de roles y transacciones complejas.

![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Express](https://img.shields.io/badge/Express-4.x-gray) ![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

## ⚡ Características del API

- **Autenticación:** Registro y Login seguro con JWT (JSON Web Tokens) y bcryptjs.
- **Roles:** Middleware de autorización para proteger rutas de Administrador.
- **Productos:**
  - Filtrado avanzado (categoría, precio, género, búsqueda).
  - Manejo de relaciones complejas (Imágenes, Colores, Stock por talla).
- **Pedidos:**
  - Creación de órdenes con validación de stock.
  - Historial de pedidos por usuario.
- **Dashboard:** Endpoints analíticos para gráficos de ventas y métricas.
- **Seguridad:** CORS configurado y protección de rutas sensibles.

## 🛠️ Tecnologías Utilizadas

- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de Datos:** MySQL (driver `mysql2` con Promesas)
- **Autenticación:** JWT, bcryptjs
- **Utilidades:** Dotenv, Cors, Morgan (opcional)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/ecommerce-backend.git
cd ecommerce-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Base de Datos
- Asegúrate de tener MySQL instalado y corriendo.
- Crea una base de datos llamada `ecommerce_db`.
- Ejecuta el script `database.sql` incluido en la raíz para crear las tablas e insertar datos iniciales.

### 4. Variables de Entorno
Crea un archivo `.env` en la raíz:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=ecommerce_db
JWT_SECRET=tu_secreto_super_seguro
```

### 5. Ejecutar el servidor
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```
El servidor correrá en http://localhost:5000.

## 🔐 Credenciales de Administrador

Para acceder al panel de administración, utiliza las siguientes credenciales:
```
Email: anjeli.verastigue@gmail.com
Contraseña: 123456
```

> ⚠️ **Importante:** Cambia estas credenciales en producción por seguridad.

## 📚 Endpoints Principales

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| **AUTH** |
| POST | /api/auth/register | Registrar nuevo usuario | Público |
| POST | /api/auth/login | Iniciar sesión | Público |
| GET | /api/auth/profile | Obtener datos del usuario | Privado |
| **PRODUCTOS** |
| GET | /api/products | Listar productos (con filtros) | Público |
| GET | /api/products/:id | Detalle de producto | Público |
| POST | /api/products | Crear producto | 🛡️ Admin |
| PUT | /api/products/:id | Actualizar producto | 🛡️ Admin |
| DELETE | /api/products/:id | Eliminar producto | 🛡️ Admin |
| **ORDENES** |
| POST | /api/orders | Crear nueva orden | Privado |
| GET | /api/orders/my-orders | Ver mis pedidos | Privado |
| GET | /api/orders | Ver todas las órdenes | 🛡️ Admin |
| **USUARIOS** |
| GET | /api/users | Listar todos los usuarios | 🛡️ Admin |
| DELETE | /api/users/:id | Eliminar usuario | 🛡️ Admin |

---
