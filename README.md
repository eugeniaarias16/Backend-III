# E-Commerce Backend

Un sistema backend completo para e-commerce desarrollado con Node.js y arquitectura por capas, que incluye autenticación JWT, roles de usuario, gestión de productos, carrito de compras y generación de tickets para transacciones.

## Descripción del Proyecto

Este proyecto implementa un backend robusto para plataformas de comercio electrónico siguiendo una arquitectura profesional por capas. El sistema gestiona productos, carritos de compra, usuarios con diferentes roles y proceso de checkout completo con generación de tickets.

## Características Principales

- **Autenticación y Autorización**
  - Sistema completo basado en JWT
  - Roles de usuario (admin/usuario regular)
  - Restricción de rutas según rol
  - Recuperación de contraseña

- **Gestión de Productos**
  - CRUD completo de productos
  - Filtrado y ordenamiento
  - Paginación de resultados
  - Categorización

- **Carrito de Compras**
  - Creación de carritos
  - Añadir/quitar productos
  - Modificar cantidades
  - Proceso de compra con validación de stock

- **Tickets de Compra**
  - Generación de tickets con código único
  - Cálculo de totales
  - Registro de productos comprados

- **Funcionalidades Adicionales**
  - Envío de emails (confirmación de registro, compras, etc.)
  - Manejo centralizado de errores
  - Sistema de logging avanzado

## Arquitectura del Proyecto

El proyecto sigue una arquitectura por capas profesional:


└───src
    ├───config          # Configuración (DB, passport, variables de entorno)
    ├───controllers     # Controladores para manejar solicitudes HTTP
    ├───dao             # Acceso a datos (modelos y DAOs)
    │   ├───models      # Esquemas de MongoDB
    │   └───mongo       # Implementaciones específicas para MongoDB
    ├───dto             # Objetos de transferencia de datos
    ├───middlewares     # Middleware para autenticación, autorización, etc.
    ├───repository      # Patrón repositorio, abstracción de DAOs
    ├───routes          # Definición de rutas
    ├───services        # Lógica de negocio
    └───utils           # Utilidades (errores, logger, etc.)


## Tecnologías Utilizadas

- **Backend**: Node.js, Express
- **Base de Datos**: MongoDB, Mongoose
- **Autenticación**: Passport.js, JWT
- **Seguridad**: bcrypt para hash de contraseñas
- **Email**: Nodemailer
- **Tiempo Real**: Socket.IO
- **Otros**: dotenv para variables de entorno, express-validator para validaciones

## Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (v5 o superior)
- npm (v8 o superior)

## Instalación

1. Clonar el repositorio:

   git clone https://github.com/tuusuario/ecommerce-backend.git
   cd ecommerce-backend


2. Instalar dependencias:

   npm install


3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto basado en `.env.example`
   - Configurar credenciales de MongoDB y otras variables necesarias

4. Iniciar la aplicación:
  
   npm run dev   # Para desarrollo
   npm start     # Para producción
   

## Endpoints Principales

### Autenticación

- `POST /api/sessions/register` - Registro de usuario
- `POST /api/sessions/login` - Inicio de sesión
- `GET /api/sessions/current` - Obtener usuario actual
- `GET /api/sessions/logout` - Cerrar sesión
- `POST /api/sessions/forgot-password` - Solicitar restauración de contraseña
- `POST /api/sessions/reset-password` - Restablecer contraseña

### Productos

- `GET /api/products` - Listar productos (con filtros, paginación)
- `GET /api/products/:pid` - Obtener producto por ID
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:pid` - Actualizar producto (admin)
- `DELETE /api/products/:pid` - Eliminar producto (admin)

### Carritos

- `POST /api/carts` - Crear carrito
- `GET /api/carts/:cid` - Obtener carrito por ID
- `POST /api/carts/:cid/product/:pid` - Agregar producto al carrito
- `PUT /api/carts/:cid` - Actualizar carrito completo
- `PUT /api/carts/:cid/product/:pid` - Actualizar cantidad de producto
- `DELETE /api/carts/:cid/product/:pid` - Eliminar producto del carrito
- `DELETE /api/carts/:cid` - Vaciar carrito
- `POST /api/carts/:cid/purchase` - Finalizar compra y generar ticket

## Ejemplos de Uso

### Registro de Usuario


curl -X POST http://localhost:8082/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@ejemplo.com",
    "age": 30,
    "password": "contraseña123",
    "role": "user"
  }'


### Inicio de Sesión


curl -X POST http://localhost:8082/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "contraseña123"
  }'


### Crear Producto (como admin)


curl -X POST http://localhost:8082/api/products \
  -H "Content-Type: application/json" \
  -H "Cookie: authToken=tu-jwt-token" \
  -d '{
    "title": "Smartphone XYZ",
    "description": "Último modelo con 128GB",
    "price": 999.99,
    "code": "PHONE-123",
    "stock": 50,
    "category": "Electronics",
    "thumbnail": ["https://ejemplo.com/imagen1.jpg", "https://ejemplo.com/imagen2.jpg"]
  }'


### Comprar Carrito


curl -X POST http://localhost:8082/api/carts/tu-id-de-carrito/purchase \
  -H "Cookie: authToken=tu-jwt-token"


## Manejo de Errores

El sistema implementa un manejo de errores centralizado con diferentes tipos de errores personalizados:

- `ValidationError`: Errores de validación de datos (400)
- `AuthError`: Errores de autenticación (401)
- `ForbiddenError`: Errores de permisos (403)
- `NotFoundError`: Recursos no encontrados (404)
- `ConflictError`: Conflictos con recursos existentes (409)

## Testing- Para ejecutar las pruebas:

npm test


## Contribución

1. Crea un fork del repositorio
2. Crea una rama para tu funcionalidad: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y haz commit: `git commit -m 'Añade nueva funcionalidad'`
4. Sube tus cambios: `git push origin feature/nueva-funcionalidad`
5. Envía un pull request

## Licencia

Este proyecto está licenciado bajo [ISC License](LICENSE).

## Autor

Eugenia M. Arias.
Desarrollado como proyecto final para el curso de Backend de Coderhouse.