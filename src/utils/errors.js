
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Errores de autenticación
export class AuthError extends AppError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthError';
  }
}

// Errores de autorización
export class ForbiddenError extends AppError {
  constructor(message) {
    super(message || 'No tienes permisos para realizar esta acción', 403);
    this.name = 'ForbiddenError';
  }
}

// Errores de datos no encontrados
export class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource || 'Recurso'} no encontrado`, 404);
    this.name = 'NotFoundError';
  }
}

// Errores de validación
export class ValidationError extends AppError {
  constructor(message, errors = {}) {
    super(message || 'Error de validación', 400);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// Errores de conflicto (duplicados)
export class ConflictError extends AppError {
  constructor(message) {
    super(message || 'Conflicto con recurso existente', 409);
    this.name = 'ConflictError';
  }
}

// Error cuando un recurso ya no está disponible 
export class UnavailableError extends AppError {
  constructor(message) {
    super(message || 'Recurso no disponible', 410);
    this.name = 'UnavailableError';
  }
}