import passport from 'passport';
import { errorResponse } from '../dto/response.dto.js';

export const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json(errorResponse('Unauthorized', ['Missing or invalid token']));
    }
    req.user = user;
    return next();
  })(req, res, next);
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json(errorResponse('Forbidden', ['Insufficient permissions']));
  }

  return next();
};
