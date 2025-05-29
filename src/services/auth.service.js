import UserRepository from '../repository/user.repository.js';
import { validPassword } from '../utils/hashPassword.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import UserService from './user.service.js';

// Inspeccionar todo el objeto config
console.log('==== CONFIG OBJETO COMPLETO ====');
console.log(JSON.stringify(config, null, 2));
console.log('================================');

class AuthService {
  async login(email, password) {
    try {
      const user = await UserRepository.findByEmail(email);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const isValid = await validPassword(password, user.password);
      if (!isValid) {
        throw new Error('Contraseña incorrecta');
      }

      // Log para depuración
      console.log('JWT Secret valor:', config.jwt_secret);
      console.log('JWT Expires In valor:', config.jwt_expires_in);
      
      // Usar una cadena literal si config.jwt_secret es undefined
      const secretKey = config.jwt_secret || 'miClaveSuperNoSecreta123456';
      const expiresIn = config.jwt_expires_in || '1h';
      
      console.log('Secret Key a usar:', secretKey);
      console.log('Expires In a usar:', expiresIn);

      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        secretKey, 
        { expiresIn: expiresIn }
      );

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async registerUser(userData) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await UserRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('El correo electrónico ya está registrado');
      }
      
      return await UserService.createUser(userData);
    } catch (error) {
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  }
}

export default new AuthService();