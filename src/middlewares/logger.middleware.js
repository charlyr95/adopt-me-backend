import { logger } from '../utils/logger.js';

export const loggerMiddleware = (req, res, next) => {
  res.on('finish', () => {
    const logData = {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      statusCode: res.statusCode
    };

    if (res.statusCode === 401 || res.statusCode === 403) {
      logger.warn(`${req.method} ${req.originalUrl}`, logData);
      return;
    }

    logger.info(`${req.method} ${req.originalUrl}`, logData);
  });

  next();
};
