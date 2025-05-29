
import CartService from './cart.service.js';
import UserRepository from '../repository/user.repository.js';
import bcrypt from 'bcrypt';

class UserService {
  async createUser(userData) {
    try {
      // Crear carrito para el usuario
      const cart = await CartService.createCart();
      
      // Asignar carrito al usuario
      userData.cart = cart._id;
      
      // Crear usuario
      const user = await UserRepository.createUser(userData);
      return user;
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    try {
      return await UserRepository.findByEmail(email);
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      return await UserRepository.findById(id);
    } catch (error) {
      throw new Error(`Error al buscar usuario por ID: ${error.message}`);
    }
  }

  async updateUserPassword(userId, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      return await UserRepository.updateUserById(userId, { password: hashedPassword });
    } catch (error) {
      throw new Error(`Error al actualizar contraseña: ${error.message}`);
    }
  }
}

export default new UserService();