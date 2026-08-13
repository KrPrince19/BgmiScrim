const User = require('../models/User');
const Scrim = require('../models/Scrim');
const Tournament = require('../models/Tournament');

// @desc Get platform statistics for home page
// @route GET /api/stats
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const completedMatches = await Scrim.countDocuments({ status: 'completed' });
        const upcomingMatches = await Scrim.countDocuments({ status: 'upcoming' });
        const totalTournaments = await Tournament.countDocuments(); 

        const recentScrims = await Scrim.find({ status: 'completed', mvpPlayer: { $exists: true, $ne: "" } })
            .sort({ time: -1 })
            .limit(10);
            
        let mvp = null;
        if (recentScrims.length > 0) {
            recentScrims.sort((a, b) => (b.mvpPlayerKills || 0) - (a.mvpPlayerKills || 0));
            const topScrim = recentScrims[0];
            mvp = {
                playerName: topScrim.mvpPlayer,
                teamName: topScrim.mvpPlayerTeam,
                kills: topScrim.mvpPlayerKills || 0,
                avatar: topScrim.mvpPlayerAvatar || "",
                matches: 1, 
                kd: topScrim.mvpPlayerKills || 0
            };
        }

        res.json({
            activePlayers: totalUsers,
            scrimsPlayed: completedMatches,
            dailyScrims: upcomingMatches, 
            tournaments: totalTournaments,
            mvp: mvp
        });
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({ message: "Server error fetching stats" });
    }
};
