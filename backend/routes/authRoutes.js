const express = require('express');
const { register, registerValidation, login, loginValidation } = require('../controllers/authController');
const { handleValidationErrors } = require('../utils/validation');

const router = express.Router();

router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);

module.exports = router;
