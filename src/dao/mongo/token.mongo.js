
import TokenResetModel from "../models/token.model.js";
class TokenResetDao {
  async create(tokenData) {
    try {
      const newToken = await TokenResetModel.create(tokenData);
      return newToken;
    } catch (error) {
      throw new Error(`Error al crear token: ${error.message}`);
    }
  }

  async findByToken(token) {
    try {
      return await TokenResetModel.findOne({ 
        token,
        expiresAt: { $gt: new Date() }
      });
    } catch (error) {
      throw new Error(`Error al buscar token: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      return await TokenResetModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar token: ${error.message}`);
    }
  }

  async deleteByUserId(userId) {
    try {
      return await TokenResetModel.deleteMany({ userId });
    } catch (error) {
      throw new Error(`Error al eliminar tokens por userId: ${error.message}`);
    }
  }
}

export default new TokenResetDao();