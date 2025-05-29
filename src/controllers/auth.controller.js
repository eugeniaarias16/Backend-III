import authService from '../services/auth.service.js';
import { createUserDTO } from '../dto/user.dto.js';
import mailService from '../services/mail.service.js';
import tokenService from '../services/token.service.js';
import userService from '../services/user.service.js';
import { AuthError, ValidationError} from '../utils/errors.js';
import logger from '../utils/logger.js';

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new ValidationError('Email y contraseña son requeridos');
    }

    const { token, user } = await authService.login(email, password);
    
    // Loguear el inicio de sesión exitoso
    logger.info(`Inicio de sesión exitoso: ${user.email}`, { userId: user._id });
    
    res
      .cookie("authToken", token, { httpOnly: true })
      .success("Login exitoso", { token, user });
  } catch (error) {
    // Convertir errores específicos a errores personalizados
    if (error.message === 'Usuario no encontrado') {
      return next(new AuthError('Credenciales inválidas'));
    }
    if (error.message === 'Contraseña incorrecta') {
      return next(new AuthError('Credenciales inválidas'));
    }
    
    logger.error(`Error en login: ${error.message}`, error);
    next(error);
  }
};


export const logoutController = (req, res) => {
  try {
    // Eliminar la cookie de autenticación
    res.clearCookie('authToken');
    
    // Responder exitosamente
    res.success(200, { message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    res.error(500, 'Error al cerrar la sesión', error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    // req.user viene del middleware authenticateJWT
    if (!req.user) {
      throw new AuthError('Usuario no autenticado');
    }
    
    const userDTO = createUserDTO(req.user);
    res.success('Usuario actual obtenido con éxito', userDTO);
  } catch (error) {
    next(error);
  }
};

export const registerController = async (req, res, next) => {
  try {
    const userData = req.body;
    
    // Validaciones básicas
    if (!userData.email || !userData.password || !userData.first_name) {
      throw new ValidationError('Faltan campos obligatorios para el registro');
    }
    
    const newUser = await authService.registerUser(userData);
    
    // Loguear el registro exitoso
    logger.info(`Usuario registrado: ${newUser.email}`, { userId: newUser._id });
    
    // Enviar correo de bienvenida
    await mailService.sendWelcomeEmail(newUser);
    
    res.created("Usuario registrado correctamente", createUserDTO(newUser));
  } catch (error) {
    logger.error(`Error al registrar usuario: ${error.message}`, error);
    next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      throw new ValidationError('El email es requerido');
    }
    
    const user = await userService.getUserByEmail(email);
    
    // Por seguridad, no revelar si el usuario existe o no
    if (!user) {
      // Simular que todo salió bien
      logger.info(`Intento de reset de contraseña para email no existente: ${email}`);
      return res.success('Si el correo existe, se enviará un enlace para restablecer la contraseña');
    }
    
    // Generar token
    const resetToken = await tokenService.generatePasswordResetToken(user._id);
    
    // Enviar correo con el token
    await mailService.sendPasswordReset(user, resetToken);
    
    // Loguear la acción
    logger.info(`Solicitud de reset de contraseña enviada: ${user.email}`, { userId: user._id });
    
    res.success('Se ha enviado un correo para restablecer tu contraseña');
  } catch (error) {
    logger.error(`Error al solicitar reset de contraseña: ${error.message}`, error);
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      throw new ValidationError('Token y contraseña son requeridos');
    }
    
    // Verificar token
    let resetToken;
    try {
      resetToken = await tokenService.verifyPasswordResetToken(token);
    } catch (error) {
      throw new AuthError('Token inválido o expirado');
    }
    
    // Actualizar contraseña
    await userService.updateUserPassword(resetToken.userId, password);
    
    // Invalidar token usado
    await tokenService.invalidateToken(resetToken._id);
    
    // Loguear la acción
    logger.info(`Contraseña restablecida con éxito para el usuario ID: ${resetToken.userId}`);
    
    res.success('Contraseña actualizada correctamente');
  } catch (error) {
    logger.error(`Error al restablecer contraseña: ${error.message}`, error);
    next(error);
  }
};