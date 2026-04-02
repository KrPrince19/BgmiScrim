const express = require('express');
const router = express.Router();
const { signup, login, adminSignup } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/admin-signup', adminSignup);
router.post('/login', login);

module.exports = router;
