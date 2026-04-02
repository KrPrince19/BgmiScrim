const express = require('express');
const router = express.Router();
const { getSetting, updateSetting } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to get a setting
router.get('/:key', getSetting);

// Protected admin route to update a setting
router.put('/:key', protect, admin, updateSetting);

module.exports = router;
