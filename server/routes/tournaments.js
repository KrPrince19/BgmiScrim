const express = require('express');
const router = express.Router();
const { getTournaments, getAllTournaments, getTournamentById, createTournament, updateTournament, deleteTournament, finalizeTournament } = require('../controllers/tournamentController');

router.get('/', getTournaments);
router.get('/all', getAllTournaments);
router.get('/:id', getTournamentById);
router.post('/', createTournament);
router.put('/:id', updateTournament);
router.delete('/:id', deleteTournament);

// Match Results
router.post('/:id/finalize', finalizeTournament);

module.exports = router;
