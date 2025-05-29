import userMongo from '../dao/mongo/user.mongo.js';

class UserRepository {
  async findByEmail(email) {
    return await userMongo.findByEmail(email);
  }

  async createUser(userData) {
    return await userMongo.create(userData);
  }

  async findById(id) {
    return await userMongo.findById(id);
  }
}

export default new UserRepository();