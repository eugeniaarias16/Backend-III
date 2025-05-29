import productService from '../services/product.service.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const getProducts = async (req, res, next) => {
  try {
    const { limit, page, sort, category, status } = req.query;
    const options = { limit, page, sort, category, status };
    const result = await productService.getProducts(options);
    res.success("Productos obtenidos correctamente", result);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productService.getProductById(pid);
    
    if (!product) {
      throw new NotFoundError('Producto');
    }
    
    res.success("Producto encontrado", product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    
    // Validaciones básicas
    if (!productData.title) {
      throw new ValidationError('El título del producto es obligatorio');
    }
    
    if (!productData.price || isNaN(productData.price) || productData.price <= 0) {
      throw new ValidationError('El precio debe ser un número mayor a 0');
    }
    
    const newProduct = await productService.createProduct(productData);
    
    // Loguear la acción
    logger.info(`Producto creado con éxito: ${newProduct._id}`, {
      productId: newProduct._id,
      userId: req.user?._id
    });
    
    // Emitir evento socket.io
    if (req.app.get("socketio")) {
      const io = req.app.get("socketio");
      const products = await productService.getProducts();
      io.emit("updateProducts", products.payload);
    }
    
    res.created("Producto creado correctamente", newProduct);
  } catch (error) {
    logger.error(`Error al crear producto: ${error.message}`, error);
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const productData = req.body;
    
    // Verificar que el producto existe
    const existingProduct = await productService.getProductById(pid);
    if (!existingProduct) {
      throw new NotFoundError('Producto');
    }
    
    const updatedProduct = await productService.updateProduct(pid, productData);
    
    // Loguear la acción
    logger.info(`Producto actualizado: ${pid}`, {
      productId: pid,
      userId: req.user?._id
    });
    
    // Emitir evento socket.io
    if (req.app.get("socketio")) {
      const io = req.app.get("socketio");
      const products = await productService.getProducts();
      io.emit("updateProducts", products.payload);
    }
    
    res.success("Producto actualizado correctamente", updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;
    
    // Verificar que el producto existe
    const existingProduct = await productService.getProductById(pid);
    if (!existingProduct) {
      throw new NotFoundError('Producto');
    }
    
    await productService.deleteProduct(pid);
    
    // Loguear la acción
    logger.info(`Producto eliminado: ${pid}`, {
      productId: pid,
      userId: req.user?._id
    });
    
    // Emitir evento socket.io
    if (req.app.get("socketio")) {
      const io = req.app.get("socketio");
      const products = await productService.getProducts();
      io.emit("updateProducts", products.payload);
    }
    
    res.success("Producto eliminado correctamente");
  } catch (error) {
    next(error);
  }
};