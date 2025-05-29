import Product from '../models/product.model.js';

class ProductMongo {
  async findAll(filter = {}, options = {}) {
    return await Product.paginate(filter, options);
  }

  async findById(id) {
    return await Product.findById(id).lean();
  }

  async create(productData) {
    const newProduct = new Product(productData);
    return await newProduct.save();
  }

  async updateById(id, productData) {
    return await Product.findByIdAndUpdate(
      id,
      productData,
      { new: true, runValidators: true } 
    );
  }

  async deleteById(id) {
    return await Product.findByIdAndDelete(id);
  }

  async getDistinctCategories() {
    return await Product.distinct('category');
  }
}

export default new ProductMongo();