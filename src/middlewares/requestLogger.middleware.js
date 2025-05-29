
import logger from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log en entrada
  logger.http(`Solicitud entrante: ${req.method} ${req.url}`);
  
  // Cuando se complete la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusMessage = res.statusMessage || '';
    
    const level = statusCode >= 500 ? 'error' : 
                  statusCode >= 400 ? 'warn' : 'info';
    
    logger[level](
      `Respuesta: ${statusCode} ${statusMessage} ${req.method} ${req.url} - ${duration}ms`,
      { 
        method: req.method,
        url: req.url,
        statusCode,
        duration,
        userId: req.user?._id || 'anónimo'
      }
    );
  });
  
  next();
};