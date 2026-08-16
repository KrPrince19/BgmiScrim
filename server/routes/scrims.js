const express = require('express');
const router = express.Router();
const {
  getScrims, getAllScrims, getScrimById,
  createScrim, updateScrim, deleteScrim,
  finalizeScrim, publishResults
} = require('../controllers/scrimController');

router.get('/', getScrims);
router.get('/all', getAllScrims);

// IMPORTANT: /publish-results MUST be declared before /:id routes,
// otherwise Express treats "publish-results" as a dynamic :id param.
router.post('/publish-results', publishResults);

router.get('/:id', getScrimById);
router.post('/', createScrim);
router.put('/:id', updateScrim);
router.delete('/:id', deleteScrim);

// Match Results
router.post('/:id/finalize', finalizeScrim);

module.exports = router;
