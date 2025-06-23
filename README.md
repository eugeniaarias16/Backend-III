# E-Commerce Backend - Proyecto Final

Un sistema backend completo para e-commerce desarrollado con Node.js y arquitectura por capas, que incluye autenticación JWT, roles de usuario, gestión de productos, carrito de compras, generación de tickets para transacciones y **sistema de mocking para datos de prueba**.

## Descripción del Proyecto

Este proyecto implementa un backend robusto para plataformas de comercio electrónico siguiendo una arquitectura profesional por capas. El sistema gestiona productos, carritos de compra, usuarios con diferentes roles, proceso de checkout completo con generación de tickets y **funcionalidades de mocking para facilitar el desarrollo y testing**.

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

- **Sistema de Mocking** ⭐ *Nuevo*
  - Generación de usuarios mock con contraseñas hasheadas
  - Generación de productos mock con datos realistas
  - Inserción masiva de datos de prueba en MongoDB
  - Integración completa con la arquitectura del proyecto

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

```
└───src
    ├───config          # Configuración (DB, passport, variables de entorno)
    ├───controllers     # Controladores para manejar solicitudes HTTP
    ├───dao             # Acceso a datos (modelos y DAOs)
    │   ├───models      # Esquemas de MongoDB
    │   └───mongo       # Implementaciones específicas para MongoDB  
    ├───dto             # Objetos de transferencia de datos
    ├───middlewares     # Middleware para autenticación, autorización, etc.
    ├───repository      # Patrón repositorio, abstracción de DAOs
    ├───routes          # Definición de rutas (incluye mocks.router.js)
    ├───services        # Lógica de negocio
    └───utils           # Utilidades (errores, logger, mocking.utils.js)
```

## Tecnologías Utilizadas

- **Backend**: Node.js, Express
- **Base de Datos**: MongoDB, Mongoose
- **Autenticación**: Passport.js, JWT
- **Seguridad**: bcrypt para hash de contraseñas
- **Email**: Nodemailer
- **Tiempo Real**: Socket.IO
- **Mocking**: @faker-js/faker ⭐ *Nuevo*
- **Otros**: dotenv para variables de entorno, express-validator para validaciones

## Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (v5 o superior)
- npm (v8 o superior)

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/eugeniaarias16/Backend-III.git
   cd Backend-III
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto
   - Configurar credenciales de MongoDB y otras variables necesarias:
   ```env
   PORT=8080
   MONGO_URI=tu_conexion_mongodb
   JWT_SECRET=tu_clave_secreta
   JWT_EXPIRES_IN=1h
   # Otras variables necesarias...
   ```

4. Iniciar la aplicación:
   ```bash
   npm run dev   # Para desarrollo
   npm start     # Para producción
   ```

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

### **Sistema de Mocking** ⭐ *Nuevos Endpoints*

- `GET /api/mocks/mockingusers` - Generar 50 usuarios mock con contraseñas hasheadas
- `GET /api/mocks/mockingproducts` - Generar productos mock (por defecto 50, personalizable con query param `count`)
- `POST /api/mocks/generateData` - Insertar usuarios y productos mock en MongoDB

## Ejemplos de Uso - Sistema de Mocking

### Generar Usuarios Mock
```bash
curl -X GET http://localhost:8080/api/mocks/mockingusers
```

### Generar Productos Mock
```bash
# Generar 50 productos (por defecto)
curl -X GET http://localhost:8080/api/mocks/mockingproducts

# Generar cantidad personalizada
curl -X GET http://localhost:8080/api/mocks/mockingproducts?count=20
```

### Insertar Datos Mock en MongoDB
```bash
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{
    "users": 10,
    "products": 25
  }'
```

## Ejemplos de Uso - Funcionalidades Principales

### Registro de Usuario
```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@ejemplo.com",
    "age": 30,
    "password": "contraseña123",
    "role": "user"
  }'
```

### Inicio de Sesión
```bash
curl -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "contraseña123"
  }'
```

### Crear Producto (como admin)
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Cookie: authToken=tu-jwt-token" \
  -d '{
    "title": "Smartphone XYZ",
    "description": "Último modelo con 128GB",
    "price": 999.99,
    "stock": 50,
    "category": "electronics"
  }'
```

## Características del Sistema de Mocking

### Usuarios Mock Generados
- **Contraseña**: Todos los usuarios mock tienen la contraseña `coder123` (hasheada con bcrypt)
- **Roles**: Distribución 50/50 entre `admin` y `user`
- **Datos**: Nombres, apellidos y emails realistas generados con Faker.js
- **Edad**: Entre 18 y 80 años
- **Carritos**: Se crean automáticamente para cada usuario

### Productos Mock Generados
- **Categorías**: Electronics, Clothing, Books, Home, Sports, Beauty, Toys, Automotive, Music, Health
- **Precios**: Rango realista entre $10 y $1000
- **Stock**: Entre 0 y 100 unidades
- **Estado**: 90% de productos activos
- **Imágenes**: URLs de placeholder realistas

## Manejo de Errores

El sistema implementa un manejo de errores centralizado con diferentes tipos de errores personalizados:

- `ValidationError`: Errores de validación de datos (400)
- `AuthError`: Errores de autenticación (401)
- `ForbiddenError`: Errores de permisos (403)
- `NotFoundError`: Recursos no encontrados (404)
- `ConflictError`: Conflictos con recursos existentes (409)

## Docker

### **Imagen Disponible en DockerHub**
La aplicación está containerizada y disponible públicamente:

**🐳 Imagen:** `eugeniaarias16/backend-ecommerce:latest`  
**📍 DockerHub:** https://hub.docker.com/r/eugeniaarias16/backend-ecommerce

### **Ejecución con Docker**

#### **Opción 1: Ejecutar directamente**
```bash
docker run -p 8080:8080 eugeniaarias16/backend-ecommerce:latest
```

#### **Opción 2: Con variables de entorno**
```bash
docker run -p 8080:8080 \
  -e MONGODB_URI="tu-conexion-mongodb" \
  -e JWT_SECRET="tu-clave-secreta" \
  eugeniaarias16/backend-ecommerce:latest
```

#### **Opción 3: Con archivo .env**
```bash
docker run -p 8080:8080 --env-file .env eugeniaarias16/backend-ecommerce:latest
```

### **Construcción Local**
Si prefieres construir la imagen localmente:

```bash
# Clonar el repositorio
git clone https://github.com/eugeniaarias16/Backend-III.git
cd Backend-III

# Construir la imagen
docker build -t backend-ecommerce .

# Ejecutar
docker run -p 8080:8080 backend-ecommerce
```

### **Características del Contenedor**
- ✅ **Imagen base:** Node.js 18 Alpine Linux (optimizada)
- ✅ **Usuario no-root:** Ejecuta con usuario `nodejs` para seguridad
- ✅ **Puerto:** 8080 (configurable con variable `PORT`)
- ✅ **Healthcheck:** Verificación automática de estado
- ✅ **Tamaño optimizado:** Solo dependencias de producción

### **Acceso a la Aplicación**
Una vez ejecutado el contenedor, la aplicación estará disponible en:
- **API:** http://localhost:8080
- **Documentación:** http://localhost:8080/api-docs
- **Mocking:** http://localhost:8080/api/mocks/mockingusers

## Testing

### **Ejecutar Tests**
```bash
npm test
```

### **Tests Implementados**
- **Tests unitarios:** Controladores con mocks (cart.controller.test.js)
- **Tests de integración:** Sistema de mocking (purchase.test.js)
- **Framework:** Jest con ES modules
- **Cobertura:** 5 tests pasando exitosamente

### **Estructura de Tests**
```
tests/
├── cart.controller.test.js   # Tests unitarios con mocks
└── purchase.test.js          # Tests de integración
```iar en modo desarrollo con nodemon
npm start        # Iniciar en modo producción
npm run lint     # Ejecutar linter
npm run lint:fix # Corregir errores de linting automáticamente
```

### Testing de Endpoints
Para probar la funcionalidad de mocking, se recomienda usar herramientas como Postman, Thunder Client o curl con los ejemplos proporcionados anteriormente.

## Historial del Proyecto

### Pre-entrega Actual
- ✅ Sistema de mocking completo implementado
- ✅ Generación de usuarios y productos mock
- ✅ Inserción masiva de datos de prueba
- ✅ Integración con arquitectura existente

### Funcionalidades Base
- ✅ Autenticación JWT completa
- ✅ CRUD de productos con roles
- ✅ Sistema de carritos y checkout
- ✅ Generación de tickets
- ✅ Envío de emails

## Contribución

1. Crea un fork del repositorio
2. Crea una rama para tu funcionalidad: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y haz commit: `git commit -m 'Añade nueva funcionalidad'`
4. Sube tus cambios: `git push origin feature/nueva-funcionalidad`
5. Envía un pull request

## Licencia

Este proyecto está licenciado bajo [ISC License](LICENSE).

## Autor

**Eugenia M. Arias**  
Desarrollado como proyecto final para el curso de Backend de Coderhouse.

---

*Este README se actualiza constantemente conforme se añaden nuevas funcionalidades al proyecto.*