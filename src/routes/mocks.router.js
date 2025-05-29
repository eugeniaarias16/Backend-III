import { Router } from 'express';
import { generateMockUsers, generateMockProducts } from '../utils/mocking.utils.js';
import { User } from '../dao/models/user.models.js';
import Product from '../dao/models/product.model.js';
import CartService from '../services/cart.service.js';
import { ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const router = Router();

// GET /api/mocks/mockingusers - Generar 50 usuarios mock
router.get('/mockingusers', async (req, res, next) => {
  try {
    const users = await generateMockUsers(50);
    
    logger.info('Usuarios mock generados exitosamente', { count: users.length });
    
    res.success('Usuarios mock generados correctamente', {
      count: users.length,
      users
    });
  } catch (error) {
    logger.error(`Error al generar usuarios mock: ${error.message}`, error);
    next(error);
  }
});

// GET /api/mocks/mockingproducts - Generar productos mock
router.get('/mockingproducts', async (req, res, next) => {
  try {
    const { count = 50 } = req.query;
    const numProducts = Math.max(1, Math.min(parseInt(count) || 50, 100)); // Limitar entre 1-100
    
    const products = generateMockProducts(numProducts);
    
    logger.info('Productos mock generados exitosamente', { count: products.length });
    
    res.success('Productos mock generados correctamente', {
      count: products.length,
      products
    });
  } catch (error) {
    logger.error(`Error al generar productos mock: ${error.message}`, error);
    next(error);
  }
});

// POST /api/mocks/generateData - Insertar datos mock en MongoDB
router.post('/generateData', async (req, res, next) => {
  try {
    const { users: userCount, products: productCount } = req.body;

    // Validar parámetros
    if (!userCount || !productCount) {
      throw new ValidationError('Se requieren los parámetros "users" y "products"');
    }

    const numUsers = parseInt(userCount);
    const numProducts = parseInt(productCount);

    if (isNaN(numUsers) || isNaN(numProducts) || numUsers < 1 || numProducts < 1) {
      throw new ValidationError('Los parámetros deben ser números enteros positivos');
    }

    // Limitar cantidad para evitar sobrecarga
    if (numUsers > 100 || numProducts > 100) {
      throw new ValidationError('Máximo 100 usuarios y 100 productos por operación');
    }

    logger.info(`Iniciando generación de datos: ${numUsers} usuarios, ${numProducts} productos`);

    // Generar datos mock
    const mockUsers = await generateMockUsers(numUsers);
    const mockProducts = generateMockProducts(numProducts);

    // Crear carritos para usuarios y asignar IDs
    const usersWithCarts = [];
    for (const userData of mockUsers) {
      try {
        const cart = await CartService.createCart();
        userData.cart = cart._id;
        usersWithCarts.push(userData);
      } catch (error) {
        logger.error(`Error al crear carrito para usuario: ${error.message}`);
        throw error;
      }
    }

    // Insertar en MongoDB
    const insertedUsers = await User.insertMany(usersWithCarts);
    const insertedProducts = await Product.insertMany(mockProducts);

    logger.info('Datos insertados exitosamente', {
      usersInserted: insertedUsers.length,
      productsInserted: insertedProducts.length
    });

    res.created('Datos generados e insertados correctamente', {
      insertedUsers: insertedUsers.length,
      insertedProducts: insertedProducts.length,
      users: insertedUsers,
      products: insertedProducts
    });

  } catch (error) {
    logger.error(`Error al generar e insertar datos: ${error.message}`, error);
    next(error);
  }
});

export default router;