const express = require('express');
const router = express.Router();
const { getScrims, getAllScrims, getScrimById, createScrim, updateScrim, deleteScrim, finalizeScrim } = require('../controllers/scrimController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getScrims);
router.get('/all', getAllScrims);
router.get('/:id', getScrimById);
router.post('/', protect, admin, createScrim);
router.put('/:id', protect, admin, updateScrim);
router.delete('/:id', protect, admin, deleteScrim);

// Match Results
router.post('/:id/finalize', protect, admin, finalizeScrim);
router.post('/publish-results', protect, admin, require('../controllers/scrimController').publishResults);

module.exports = router;
