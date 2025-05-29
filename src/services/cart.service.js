import CartRepository from '../repository/cart.repository.js';
import ProductRepository from '../repository/product.repository.js';
import ProductService from './product.service.js';
import TicketService from './ticket.service.js';

class CartService {
  async getAllCarts() {
    try {
      return await CartRepository.getAllCarts();
    } catch (error) {
      throw new Error(`Error al obtener los carritos: ${error.message}`);
    }
  }

  async getCartById(id) {
    try {
      const cart = await CartRepository.getCartById(id);
      
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  }

  async createCart() {
    try {
      const newCart = await CartRepository.createCart();
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  
  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      // Verificar que el producto existe
      const product = await ProductRepository.getProductById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      
      const cart = await CartRepository.getCartByIdRaw(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      // Buscar si el producto ya existe en el carrito
      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId
      );
      
      if (productIndex >= 0) {
        // Si el producto ya existe, aumentar la cantidad
        cart.products[productIndex].quantity += quantity;
      } else {
        // Si el producto no existe, agregarlo al carrito
        cart.products.push({
          product: productId,
          quantity
        });
      }
      
      // Guardar el carrito con los cambios (esta línea faltaba)
      await CartRepository.saveCart(cart);
      
      // Obtener el carrito con población para la respuesta
      return await CartRepository.getCartById(cartId);
    } catch (error) {
      throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await CartRepository.getCartByIdRaw(cartId);
      
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      // Verificar que todos los productos sean válidos
      for (const item of products) {
        const product = await ProductRepository.getProductById(item.product);
        if (!product) {
          throw new Error(`Producto con ID ${item.product} no encontrado`);
        }
      }
      
      cart.products = products;
      
      // Obtener el carrito con población para la respuesta
      return await CartRepository.getCartById(cartId);
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (quantity <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }
      
      const cart = await CartRepository.getCartByIdRaw(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId
      );
      
      if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
      }
      
      cart.products[productIndex].quantity = quantity;
      await CartRepository.saveCart(cart);
      
      // Obtener el carrito con población para la respuesta
      return await CartRepository.getCartById(cartId);
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto: ${error.message}`);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartRepository.getCartByIdRaw(cartId);
      
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      cart.products = cart.products.filter(
        item => item.product.toString() !== productId
      );
      
      await CartRepository.saveCart(cart);
      return cart;
    } catch (error) {
      throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await CartRepository.updateCart(cartId, { products: [] });
      
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      
      return cart;
    } catch (error) {
      throw new Error(`Error al vaciar el carrito: ${error.message}`);
    }
  }

  async purchaseCart(cartId, userEmail) {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart || !cart.products || cart.products.length === 0) {
        throw new Error('Carrito no encontrado o vacío');
      }
  
      let totalAmount = 0;
      const productsNotPurchased = [];
      const purchasedProducts = [];
  
      // Verificar stock y procesar cada producto
      for (const item of cart.products) {
        const product = await ProductService.getProductById(item.product._id || item.product);
        
        if (product.stock >= item.quantity) {
          // Hay stock suficiente
          // Actualizar stock
          await ProductService.updateProduct(product._id, {
            stock: product.stock - item.quantity
          });
          
          // Calcular subtotal
          totalAmount += product.price * item.quantity;
          purchasedProducts.push(item);
        } else {
          // No hay stock suficiente
          productsNotPurchased.push(item.product._id || item.product);
        }
      }
  
      if (purchasedProducts.length > 0) {
        // Crear ticket solo si se compró al menos un producto
        const ticket = await TicketService.createTicket({
          amount: totalAmount,
          purchaser: userEmail
        });
  
        // Actualizar carrito con productos no comprados
        if (productsNotPurchased.length > 0) {
          const updatedProducts = cart.products.filter(item => 
            productsNotPurchased.includes(item.product._id.toString() || item.product.toString())
          );
          await this.updateCart(cartId, updatedProducts);
        } else {
          // Si todos los productos fueron comprados, vaciar el carrito
          await this.clearCart(cartId);
        }
  
        return {
          ticket,
          productsNotPurchased
        };
      } else {
        throw new Error('No se pudo comprar ningún producto por falta de stock');
      }
    } catch (error) {
      throw new Error(`Error al procesar compra: ${error.message}`);
    }
  }
  
}

export default new CartService();