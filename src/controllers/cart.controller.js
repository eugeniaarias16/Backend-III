import cartService from "../services/cart.service.js";
import userService from "../services/user.service.js";
import mailService from "../services/mail.service.js";
import { NotFoundError, ValidationError, AuthError} from '../utils/errors.js';
import logger from '../utils/logger.js';
import WhatsAppService from "../services/whatsapp.service.js";





export const getAllCarts = async (req, res, next) => {
  try {
    const carts = await cartService.getAllCarts();
    res.success("Carritos obtenidos correctamente", carts);
  } catch (error) {
    next(error);
  }
};

export const getCartById = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    
    if (!cart) {
      throw new NotFoundError('Carrito');
    }
    
    res.success("Carrito encontrado", cart);
  } catch (error) {
    next(error);
  }
};

export const createCart = async (req, res, next) => {
  try {
    const newCart = await cartService.createCart();
    
    // Loguear la acción
    logger.info(`Carrito creado: ${newCart._id}`, {
      cartId: newCart._id,
      userId: req.user?._id
    });
    
    res.created("Carrito creado correctamente", newCart);
  } catch (error) {
    logger.error(`Error al crear carrito: ${error.message}`, error);
    next(error);
  }
};

export const addProductToCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;
    
    // Validaciones básicas
    if (quantity <= 0 || !Number.isInteger(Number(quantity))) {
      throw new ValidationError('La cantidad debe ser un número entero positivo');
    }
    
    const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
    
    // Loguear la acción
    logger.info(`Producto agregado al carrito: ${pid} en carrito ${cid}, cantidad: ${quantity}`, {
      cartId: cid,
      productId: pid,
      userId: req.user?._id
    });
    
    res.success("Producto agregado al carrito correctamente", updatedCart);
  } catch (error) {
    logger.error(`Error al agregar producto al carrito: ${error.message}`, error);
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      throw new ValidationError("El campo products debe ser un array");
    }
    
    const updatedCart = await cartService.updateCart(cid, products);
    
    // Loguear la acción
    logger.info(`Carrito actualizado: ${cid}`, {
      cartId: cid,
      userId: req.user?._id
    });
    
    res.success("Carrito actualizado correctamente", updatedCart);
  } catch (error) {
    next(error);
  }
};

export const updateProductQuantity = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || isNaN(quantity) || quantity < 1 || !Number.isInteger(Number(quantity))) {
      throw new ValidationError("La cantidad debe ser un número entero mayor a 0");
    }
    
    const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
    
    // Loguear la acción
    logger.info(`Cantidad actualizada en carrito: producto ${pid} en carrito ${cid}, nueva cantidad: ${quantity}`, {
      cartId: cid,
      productId: pid,
      userId: req.user?._id
    });
    
    res.success("Cantidad del producto actualizada correctamente", updatedCart);
  } catch (error) {
    next(error);
  }
};

export const removeProductFromCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartService.removeProductFromCart(cid, pid);
    
    // Loguear la acción
    logger.info(`Producto eliminado del carrito: ${pid} en carrito ${cid}`, {
      cartId: cid,
      productId: pid,
      userId: req.user?._id
    });
    
    res.success("Producto eliminado del carrito correctamente", updatedCart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const emptyCart = await cartService.clearCart(cid);
    
    // Loguear la acción
    logger.info(`Carrito vaciado: ${cid}`, {
      cartId: cid,
      userId: req.user?._id
    });
    
    res.success("Carrito vaciado correctamente", emptyCart);
  } catch (error) {
    next(error);
  }
};

export const purchaseCart = async (req, res, next) => {
  try {
    const { cid } = req.params;

    // Verificar que el usuario esté autenticado
    if (!req.user) {
      throw new AuthError("Usuario no autenticado");
    }

    const result = await cartService.purchaseCart(cid, req.user.email);

    // Loguear la acción
    logger.info(`Compra realizada: carrito ${cid}, usuario ${req.user.email}`, {
      cartId: cid,
      userId: req.user._id,
      ticketId: result.ticket?._id
    });

    // Si se generó un ticket, enviar correo de confirmación
    if (result.ticket) {
      // información completa del usuario 
      const user = req.user.email
        ? await userService.getUserByEmail(req.user.email)
        : req.user;

      // Enviar correo de confirmación de compra
      await mailService.sendPurchaseConfirmation(user, result.ticket);

      // Si el usuario tiene número de teléfono, enviar WhatsApp
      if (user.phone) {
        await WhatsAppService.sendPurchaseConfirmation(user.phone, result.ticket);
      }
    }

    if (result.productsNotPurchased.length > 0) {
      // Loguear productos no comprados
      logger.warn(`Compra parcial: algunos productos no tenían stock suficiente`, {
        cartId: cid,
        userId: req.user._id,
        productsNotPurchased: result.productsNotPurchased
      });
      
      return res.success(
        "Compra procesada parcialmente. Algunos productos no tenían stock suficiente",
        {
          ticket: result.ticket,
          productsNotPurchased: result.productsNotPurchased,
        }
      );
    }

    res.success("Compra realizada con éxito", { ticket: result.ticket });
  } catch (error) {
    logger.error(`Error al procesar la compra: ${error.message}`, error);
    next(error);
  }
};