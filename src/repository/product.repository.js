import productMongo from '../dao/mongo/product.mongo.js';

class ProductRepository {
  async getProducts(options = {}) {
    return await productMongo.findAll(options.filter, options.paginateOptions);
  }

  async getProductById(id) {
    return await productMongo.findById(id);
  }

  async createProduct(productData) {
    return await productMongo.create(productData);
  }

  async updateProduct(id, productData) {
    return await productMongo.updateById(id, productData);
  }

  async deleteProduct(id) {
    return await productMongo.deleteById(id);
  }

  async getUniqueCategories() {
    return await productMongo.getDistinctCategories();
  }
}

export default new ProductRepository();