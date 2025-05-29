
import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import { createRequire } from 'module';



// Importar el módulo 'process' de Node.js
const require = createRequire(import.meta.url);
const process = require('process');

// Middleware para capturar errores de mongoose
export const handleMongooseErrors = (err, req, res, next) => {
  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.keys(err.errors).forEach(key => {
      errors[key] = err.errors[key].message;
    });
    return res.error('Error de validación', 400, { errors });
  }

  // Error de ID inválido de Mongoose
  if (err.name === 'CastError') {
    return res.error(`ID inválido: ${err.value}`, 400);
  }

  // Error de clave duplicada (índice único)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.error(`Valor duplicado: ${field}`, 409);
  }

  next(err);
};

// Middleware para manejar errores operacionales
export const handleAppErrors = (err, req, res, next) => {
  // Si es un error operacional (creado por nosotros)
  if (err instanceof AppError) {
    return res.error(err.message, err.statusCode, err.errors);
  }

  next(err);
};

// Middleware para errores no controlados
export const handleUnexpectedErrors = (err, req, res) => {
  // Loguear error para depuración
  logger.error('ERROR NO CONTROLADO:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // En producción no enviamos detalles del error
  if (process.env.NODE_ENV === 'production') {
    return res.error('Error interno del servidor', 500);
  }

  // En desarrollo enviamos más información
  res.error(err.message, 500, {
    stack: err.stack,
    error: err
  });
};