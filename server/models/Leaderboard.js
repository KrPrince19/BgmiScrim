const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    wins: {
        type: Number,
        default: 0,
    },
    secondPlace: {
        type: Number,
        default: 0,
    },
    thirdPlace: {
        type: Number,
        default: 0,
    },
    mvps: {
        type: Number,
        default: 0,
    },
    mvpPlayerName: {
        type: String,
        default: ""
    },
    mvpPlayerTeam: {
        type: String,
        default: ""
    },
    totalKills: {
        type: Number,
        default: 0,
    },
    points: {
        type: Number,
        default: 0,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Points Calculation Logic:
// 1st (Wins): 20 pts
// 2nd Place: 10 pts
// 3rd Place: 5 pts
// MVP: 5 pts
// Kills: 1 pt each
leaderboardSchema.pre('save', function () {
    this.points = (this.wins * 20) + (this.secondPlace * 10) + (this.thirdPlace * 5) + (this.mvps * 5) + (this.totalKills * 1);
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
