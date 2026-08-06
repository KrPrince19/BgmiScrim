const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
    playerName: {
        type: String,
        default: "",
    },
    teamName: {
        type: String,
        required: true,
        trim: true,
    },
    killPoint: {
        type: Number,
        default: 0,
    },
    rank: {
        type: Number,
        default: 0,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
