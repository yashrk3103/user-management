const { body } = require('express-validator');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/errors');
const { getPresenceMetadata } = require('../utils/presence');

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const googleAuthValidation = [
  body('credential')
    .notEmpty()
    .withMessage('Google credential is required'),
];

const buildPresence = (req, user) => {
  const presence = getPresenceMetadata(req);
  user.isOnline = true;
  user.sessionInvalidAfter = null;
  user.lastLoginAt = presence.lastSeenAt;
  user.lastSeenAt = presence.lastSeenAt;
  user.lastBrowser = presence.lastBrowser;
  user.lastDeviceType = presence.lastDeviceType;
  user.lastUserAgent = presence.lastUserAgent;
  user.lastIp = presence.lastIp;
};

const verifyGoogleCredential = async (credential) => {
  if (!googleClient || !googleClientId) {
    throw new AppError('Google OAuth is not configured on server', 503);
  }

  let payload;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });
    payload = ticket.getPayload();
  } catch {
    throw new AppError('Invalid Google credential', 401);
  }

  if (!payload?.email) {
    throw new AppError('Unable to read Google account email', 400);
  }

  if (!payload.email_verified) {
    throw new AppError('Google account email is not verified', 400);
  }

  return {
    email: payload.email.toLowerCase(),
    name: payload.name || payload.email.split('@')[0],
    avatar: payload.picture || '',
  };
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    const user = new User({
      name,
      email,
      passwordHash: password,
      role: 'user',
      status: 'active',
    });

    buildPresence(req, user);

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

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

    buildPresence(req, user);

    await user.save();

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

const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    const googleUser = await verifyGoogleCredential(credential);

    let user = await User.findOne({ email: googleUser.email }).select('+passwordHash');

    if (!user) {
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        passwordHash: crypto.randomBytes(24).toString('hex'),
        role: 'user',
        status: 'active',
        avatar: googleUser.avatar,
      });
    } else if (user.status === 'inactive') {
      return next(new AppError('Your account has been deactivated', 401));
    } else if (googleUser.avatar && !user.avatar) {
      user.avatar = googleUser.avatar;
    }

    buildPresence(req, user);
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    req.user.isOnline = false;
    req.user.lastSeenAt = new Date();
    req.user.lastLogoutAt = new Date();
    await req.user.save();

    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

const updatePresence = async (req, res, next) => {
  try {
    const now = Date.now();

    if (
      req.user.isOnline &&
      req.user.lastSeenAt &&
      now - req.user.lastSeenAt.getTime() < 15000
    ) {
      return res.json({
        success: true,
        message: 'Presence already up to date',
      });
    }

    const presence = getPresenceMetadata(req);
    req.user.isOnline = true;
    req.user.lastSeenAt = presence.lastSeenAt;
    req.user.lastBrowser = presence.lastBrowser;
    req.user.lastDeviceType = presence.lastDeviceType;
    req.user.lastUserAgent = presence.lastUserAgent;
    req.user.lastIp = presence.lastIp;
    await req.user.save();

    res.json({
      success: true,
      message: 'Presence updated',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  registerValidation,
  login,
  loginValidation,
  googleAuth,
  googleAuthValidation,
  logout,
  updatePresence,
};
