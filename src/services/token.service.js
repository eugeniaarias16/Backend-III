
import tokenRepository from '../repository/token.repository.js';
import crypto from 'crypto';

class TokenService {
  async generatePasswordResetToken(userId) {
    try {
      // Generar un token aleatorio
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Generar un hash del token para almacenarlo en la base de datos
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      // Eliminar tokens anteriores del mismo usuario
      await tokenRepository.deleteUserTokens(userId);
      
      // Crear nuevo token en la base de datos
      await tokenRepository.createToken({
        userId,
        token: resetTokenHash,
        expiresAt: new Date(Date.now() + 3600000) // 1 hora
      });
      
      // Devolver el token original (sin hash) para incluirlo en el correo
      return resetToken;
    } catch (error) {
      throw new Error(`Error al generar token: ${error.message}`);
    }
  }

  async verifyPasswordResetToken(token) {
    try {
      // Generar hash del token recibido
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      
      // Buscar token válido
      const resetToken = await tokenRepository.findValidToken(tokenHash);
      
      if (!resetToken) {
        throw new Error('Token inválido o expirado');
      }
      
      return resetToken;
    } catch (error) {
      throw new Error(`Error al verificar token: ${error.message}`);
    }
  }

  async invalidateToken(tokenId) {
    try {
      return await tokenRepository.deleteToken(tokenId);
    } catch (error) {
      throw new Error(`Error al invalidar token: ${error.message}`);
    }
  }
}

export default new TokenService();
