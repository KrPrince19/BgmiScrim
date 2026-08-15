const express = require('express');
const router = express.Router();
const { getLeaderboard, updateTeamStats, deleteTeam } = require('../controllers/leaderboardController');

// Public route
router.get('/', getLeaderboard);

// Admin routes
router.post('/admin', updateTeamStats);
router.delete('/admin/:id', deleteTeam);

module.exports = router;
