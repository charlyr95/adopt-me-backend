import { logger } from '../utils/logger.js';
import { errorResponse } from '../dto/response.dto.js';

export const notFoundHandler = (req, res) => {
  res.status(404).json(errorResponse('Route not found', [`${req.method} ${req.originalUrl}`]));
};

export const errorHandler = (error, req, res, next) => {
  logger.error(error.message, { stack: error.stack });

  let statusCode = error.statusCode || 500;
  let errors = error.details || [error.message];

  if (error.name === 'MulterError') {
    const code = error.code || '';
    statusCode = code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    errors = [error.message || 'Upload error'];
  }

  if (error.name === 'CastError') {
    statusCode = 404;
    errors = [error.message || 'Resource not found'];
  }

  res.status(statusCode).json(errorResponse(error.message || 'Internal server error', errors));
};
