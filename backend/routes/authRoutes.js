const express = require('express');
const {
	register,
	registerValidation,
	login,
	loginValidation,
	googleAuth,
	googleAuthValidation,
	logout,
	updatePresence,
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { handleValidationErrors } = require('../utils/validation');

const router = express.Router();

router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/google', googleAuthValidation, handleValidationErrors, googleAuth);
router.post('/logout', authMiddleware, logout);
router.post('/presence', authMiddleware, updatePresence);

module.exports = router;
