import ProductRepository from "../repository/product.repository.js";

class ProductService {
  async getProducts(options = {}) {
    const { 
      limit = 30, 
      page = 1, 
      sort, 
      category,
      status 
    } = options;
  
    const validLimit = Math.max(1, parseInt(limit));
    const validPage = Math.max(1, parseInt(page));
  
    const filter = {};
    if (category) {
      filter.category = { $regex: new RegExp(category.trim(), 'i') }; //insensible a mayúsculas/minúsculas
    }
    if (status !== undefined) {
      filter.status = status === 'true' || status === true;
    }
  
    const paginateOptions = {
      page: validPage,
      limit: validLimit,
      lean: true
    };
  
    if (sort === 'asc' || sort === 'desc') {
      paginateOptions.sort = { price: sort === 'asc' ? 1 : -1 };
    }
  
    try {
      const result = await ProductRepository.getProducts({
        filter,
        paginateOptions
      });
      
      return {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage
      };
    } catch (error) {
      console.error('Error en getProducts:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }
  
  async getUniqueCategories() {
    try {
      const categories = await ProductRepository.getUniqueCategories();
      return categories.map(cat => cat.toLowerCase());
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductRepository.getProductById(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  }

  async createProduct(productData) {
    try {
      delete productData.uuid; // Eliminar cualquier UUID proporcionado manualmente
      
      const newProduct = await ProductRepository.createProduct(productData);
      return newProduct;
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  }

  async updateProduct(id, productData) {
    try {
      const updatedProduct = await ProductRepository.updateProduct(id, productData);
      
      if (!updatedProduct) {
        throw new Error('Producto no encontrado');
      }
      
      return updatedProduct;
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await ProductRepository.deleteProduct(id);
      
      if (!deletedProduct) {
        throw new Error('Producto no encontrado');
      }
      
      return deletedProduct;
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }
}

export default new ProductService();