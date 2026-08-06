const express = require('express');
const router = express.Router();
const { signup, login, adminSignup, directResetPassword } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/admin-signup', adminSignup);
router.post('/login', login);
router.post('/reset-password', directResetPassword);

module.exports = router;
