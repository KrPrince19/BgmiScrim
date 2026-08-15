const express = require('express');
const router = express.Router();
const { getScrims, getAllScrims, getScrimById, createScrim, updateScrim, deleteScrim, finalizeScrim } = require('../controllers/scrimController');

router.get('/', getScrims);
router.get('/all', getAllScrims);
router.get('/:id', getScrimById);
router.post('/', createScrim);
router.put('/:id', updateScrim);
router.delete('/:id', deleteScrim);

// Match Results
router.post('/:id/finalize', finalizeScrim);
router.post('/publish-results', require('../controllers/scrimController').publishResults);

module.exports = router;
