const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/errors');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    if (user.status === 'inactive') {
      return next(new AppError('User account is inactive', 401));
    }

    const tokenIssuedAtMs = (decoded.iat || 0) * 1000;
    const invalidAfterMs = user.sessionInvalidAfter
      ? new Date(user.sessionInvalidAfter).getTime()
      : 0;

    if (invalidAfterMs > 0 && tokenIssuedAtMs <= invalidAfterMs) {
      return next(new AppError('Session expired. Please login again', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
};

module.exports = { authMiddleware, authorize };
