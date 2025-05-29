
import tokenDao from '../dao/mongo/token.mongo.js';

class TokenRepository {
  async createToken(tokenData) {
    return await tokenDao.create(tokenData);
  }

  async findValidToken(token) {
    return await tokenDao.findByToken(token);
  }

  async deleteToken(id) {
    return await tokenDao.deleteById(id);
  }

  async deleteUserTokens(userId) {
    return await tokenDao.deleteByUserId(userId);
  }
}

export default new TokenRepository();