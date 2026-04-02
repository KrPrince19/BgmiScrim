const express = require('express');
const router = express.Router();
const { getLeaderboard, updateTeamStats, deleteTeam } = require('../controllers/leaderboardController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route
router.get('/', getLeaderboard);

// Admin routes
router.post('/admin', protect, admin, updateTeamStats);
router.delete('/admin/:id', protect, admin, deleteTeam);

module.exports = router;
