const Scrim = require('../models/Scrim');
const Leaderboard = require('../models/Leaderboard');

// Get all upcoming scrims (public)
exports.getScrims = async (req, res) => {
  try {
    const scrims = await Scrim.find({ status: 'upcoming' })
      .select('-roomID -roomPassword')
      .sort({ time: 1 });
    res.json(scrims);
  } catch (error) {
    const fs = require('fs');
    fs.appendFileSync('error.log', `[${new Date().toISOString()}] getScrims: ${error.stack}\n`);
    res.status(500).json({ message: error.message });
  }
};

// Get ALL scrims (admin)
exports.getAllScrims = async (req, res) => {
  try {
    const scrims = await Scrim.find().sort({ time: -1 });
    res.json(scrims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single scrim details (publicly accessible)
exports.getScrimById = async (req, res) => {
  try {
    const scrim = await Scrim.findById(req.params.id).select('-roomID -roomPassword');
    if (scrim) {
      res.json(scrim);
    } else {
      res.status(404).json({ message: 'Scrim not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new scrim (admin)
exports.createScrim = async (req, res) => {
  try {
    const { matchName, time, entryFee, winningPrize, totalSlots, roomID, roomPassword } = req.body;
    const scrim = await Scrim.create({ matchName, time, entryFee, winningPrize, totalSlots, roomID, roomPassword });

    // Emit Real-time Update
    if (req.io) {
      req.io.emit('scrimCreated', scrim);
    }

    res.status(201).json(scrim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update scrim (admin)
exports.updateScrim = async (req, res) => {
  try {
    const scrim = await Scrim.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scrim) return res.status(404).json({ message: 'Scrim not found' });

    // Emit Real-time Update
    if (req.io) {
      req.io.emit('scrimUpdate', scrim);
    }

    res.json(scrim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete scrim (admin)
exports.deleteScrim = async (req, res) => {
  try {
    const scrim = await Scrim.findByIdAndDelete(req.params.id);
    if (!scrim) return res.status(404).json({ message: 'Scrim not found' });

    // Emit Real-time Update
    if (req.io) {
      req.io.emit('scrimDeleted', req.params.id);
    }

    res.json({ message: 'Scrim deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [ADMIN] Finalize match results (Mark as completed)
exports.finalizeScrim = async (req, res) => {
  try {
    const scrimId = req.params.id;
    const scrim = await Scrim.findById(scrimId);
    if (!scrim) return res.status(404).json({ message: 'Scrim not found' });

    scrim.status = 'completed';
    await scrim.save();

    if (req.io) {
      req.io.emit('scrimUpdate', scrim);
    }

    res.json({ message: 'Scrim marked as completed. Please manage results in Leaderboard panel.', scrim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [ADMIN] Atomic publish to live leaderboard
exports.publishResults = async (req, res) => {
  try {
    const { scrimId, rankings, mvpPlayer, mvpTeam, mvpKills } = req.body;

    const scrim = await Scrim.findById(scrimId);
    if (!scrim) return res.status(404).json({ message: 'Scrim not found' });

    // Update Scrim record with official results
    scrim.winner = rankings.find(r => r.rank === 1)?.teamName || "";
    scrim.secondPlace = rankings.find(r => r.rank === 2)?.teamName || "";
    scrim.thirdPlace = rankings.find(r => r.rank === 3)?.teamName || "";
    scrim.mvpPlayer = mvpPlayer || "";
    scrim.mvpPlayerTeam = mvpTeam || "";
    scrim.mvpPlayerKills = mvpKills || 0;
    scrim.matchResults = rankings.map(r => ({ teamName: r.teamName, kills: r.kills }));
    await scrim.save();

    // RESET GLOBAL LEADERBOARD
    await Leaderboard.deleteMany({});

    // Bulk insert new leaderboard entries
    const leaderboardEntries = rankings.map(r => ({
      teamName: r.teamName,
      wins: r.rank === 1 ? 1 : 0,
      secondPlace: r.rank === 2 ? 1 : 0,
      thirdPlace: r.rank === 3 ? 1 : 0,
      mvps: r.teamName === mvpTeam ? 1 : 0,
      mvpPlayerName: r.teamName === mvpTeam ? (mvpPlayer || "") : "",
      mvpPlayerTeam: r.teamName === mvpTeam ? (mvpTeam || "") : "",
      totalKills: r.kills
    }));

    await Leaderboard.insertMany(leaderboardEntries);

    // Emit Real-time Updates
    if (req.io) {
      req.io.emit('scrimUpdate', scrim);
      const updatedLeaderboard = await Leaderboard.find().sort({ points: -1, wins: -1 }).limit(50);
      req.io.emit('leaderboardUpdate', updatedLeaderboard);
    }

    res.json({ message: 'Leaderboard published successfully!', scrim });
  } catch (error) {
    console.error("Publish Error:", error);
    res.status(500).json({ message: error.message });
  }
};
