const express = require('express');
const router = express.Router();
const { getSetting, updateSetting } = require('../controllers/settingsController');

// Public route to get a setting
router.get('/:key', getSetting);

// Protected admin route to update a setting
router.put('/:key', updateSetting);

module.exports = router;
