const express = require('express');
const { login, loginValidation } = require('../controllers/authController');
const { handleValidationErrors } = require('../utils/validation');

const router = express.Router();

router.post('/login', loginValidation, handleValidationErrors, login);

module.exports = router;
