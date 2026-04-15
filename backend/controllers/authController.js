const { body } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/errors');

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    if (user.status === 'inactive') {
      return next(new AppError('Your account has been deactivated', 401));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, loginValidation };
