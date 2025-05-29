import Cart from '../models/cart.model.js';

class CartMongo {
  async findAll() {
    return await Cart.find().lean();
  }

  async findById(id) {
    return await Cart.findById(id).populate('products.product').lean();
  }

  async create() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  async updateById(id, cartData) {
    return await Cart.findByIdAndUpdate(
      id,
      cartData,
      { new: true }
    );
  }

  async saveCart(cart) {
    return await cart.save();
  }

  async findByIdRaw(id) {
    return await Cart.findById(id);
  }
}

export default new CartMongo();