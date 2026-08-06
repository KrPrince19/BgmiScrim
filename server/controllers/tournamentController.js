const Tournament = require('../models/Tournament');
const Leaderboard = require('../models/Leaderboard');

// Get all upcoming tournaments (public)
exports.getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({ status: 'upcoming' })
      .select('-roomID -roomPassword')
      .sort({ time: 1 });
    res.json(tournaments);
  } catch (error) {
    const fs = require('fs');
    fs.appendFileSync('error.log', `[${new Date().toISOString()}] getTournaments: ${error.stack}\n`);
    res.status(500).json({ message: error.message });
  }
};

// Get ALL tournaments (admin)
exports.getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ time: -1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single tournament details (publicly accessible)
exports.getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id).select('-roomID -roomPassword');
    if (tournament) {
      res.json(tournament);
    } else {
      res.status(404).json({ message: 'Tournament not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new tournament (admin)
exports.createTournament = async (req, res) => {
  try {
    const { matchName, matchType, time, entryFee, winningPrize, totalSlots, roomID, roomPassword, image } = req.body;
    const tournament = await Tournament.create({ matchName, matchType, time, entryFee, winningPrize, totalSlots, roomID, roomPassword, image });

    // Emit Real-time Update
    if (req.io) {
      req.io.emit('tournamentCreated', tournament);
    }

    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tournament (admin)
exports.updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    // Emit Real-time Update
    if (req.io) {
      req.io.emit('tournamentUpdate', tournament);
    }

    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete tournament (admin)
exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    // Emit Real-time Update
    if (req.io) {
      req.io.emit('tournamentDeleted', req.params.id);
    }

    res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [ADMIN] Finalize match results (Mark as completed)
exports.finalizeTournament = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    tournament.status = 'completed';
    await tournament.save();

    if (req.io) {
      req.io.emit('tournamentUpdate', tournament);
    }

    res.json({ message: 'Tournament marked as completed. Please manage results in Leaderboard panel.', tournament });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
