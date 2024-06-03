const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../auth/auth');
const { validateRegistrationData } = require('../auth/validation');

router.post('/register', validateRegistrationData, registerUser);
router.post('/login', loginUser);

module.exports = router;