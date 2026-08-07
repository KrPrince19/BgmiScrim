const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');

// Public route
router.get('/', getStats);

module.exports = router;
