const Leaderboard = require("../models/Leaderboard");

// @desc Get public leaderboard (Top 50)
// @route GET /api/leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const teams = await Leaderboard.find().sort({ points: -1, wins: -1 }).limit(50);
        res.json(teams);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching leaderboard" });
    }
};

// @desc Admin: Update or Create Team Stats
// @route POST /api/admin/leaderboard
exports.updateTeamStats = async (req, res) => {
    const { teamName, wins, totalKills } = req.body;

    try {
        let team = await Leaderboard.findOne({ teamName });

        if (team) {
            team.wins = wins;
            team.totalKills = totalKills;
            await team.save();
        } else {
            team = new Leaderboard({ teamName, wins, totalKills });
            await team.save();
        }

        // Emit Real-time Update
        if (req.io) {
            const allTeams = await Leaderboard.find().sort({ points: -1, wins: -1 }).limit(50);
            req.io.emit('leaderboardUpdate', allTeams);
        }

        res.json({ message: "Leaderboard updated successfully", team });
    } catch (err) {
        console.error("Leaderboard Error:", err);
        res.status(500).json({
            message: err.code === 11000 ? "Team name already exists!" : "Error updating leaderboard"
        });
    }
};

// @desc Admin: Delete Team
// @route DELETE /api/admin/leaderboard/:id
exports.deleteTeam = async (req, res) => {
    try {
        await Leaderboard.findByIdAndDelete(req.params.id);

        // Emit Real-time Update
        if (req.io) {
            const allTeams = await Leaderboard.find().sort({ points: -1, wins: -1 }).limit(50);
            req.io.emit('leaderboardUpdate', allTeams);
        }

        res.json({ message: "Team removed from leaderboard" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting team" });
    }
};
