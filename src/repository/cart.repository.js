import cartMongo from '../dao/mongo/cart.mongo.js';

class CartRepository {
  async getAllCarts() {
    return await cartMongo.findAll();
  }

  async getCartById(id) {
    return await cartMongo.findById(id);
  }

  async createCart() {
    return await cartMongo.create();
  }

  async updateCart(id, cartData) {
    return await cartMongo.updateById(id, cartData);
  }

  async saveCart(cart) {
    return await cartMongo.saveCart(cart);
  }

  async getCartByIdRaw(id) {
    return await cartMongo.findByIdRaw(id);
  }
}

export default new CartRepository();