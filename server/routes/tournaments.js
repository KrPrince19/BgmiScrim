const express = require('express');
const router = express.Router();
const { getTournaments, getAllTournaments, getTournamentById, createTournament, updateTournament, deleteTournament, finalizeTournament } = require('../controllers/tournamentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getTournaments);
router.get('/all', getAllTournaments);
router.get('/:id', getTournamentById);
router.post('/', protect, admin, createTournament);
router.put('/:id', protect, admin, updateTournament);
router.delete('/:id', protect, admin, deleteTournament);

// Match Results
router.post('/:id/finalize', protect, admin, finalizeTournament);

module.exports = router;
