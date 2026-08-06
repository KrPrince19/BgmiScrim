const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  matchName: {
    type: String,
    required: true
  },
  matchType: {
    type: String,
    enum: ['Classic', 'TDM'],
    default: 'Classic'
  },
  image: {
    type: String,
    default: ""
  },
  time: {
    type: Date,
    required: true
  },
  entryFee: {
    type: Number,
    required: true,
    default: 0
  },
  winningPrize: {
    type: Number,
    required: true,
    default: 0
  },
  totalSlots: {
    type: Number,
    required: true,
    default: 100
  },
  slotsFilled: {
    type: Number,
    default: 0
  },
  roomID: {
    type: String,
    default: ""
  },
  roomPassword: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  winner: {
    type: String,
    default: ""
  },
  secondPlace: {
    type: String,
    default: ""
  },
  thirdPlace: {
    type: String,
    default: ""
  },
  mvpPlayer: {
    type: String,
    default: ""
  },
  mvpPlayerTeam: {
    type: String,
    default: ""
  },
  mvpPlayerKills: {
    type: Number,
    default: 0
  },
  matchResults: [{
    teamName: String,
    kills: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
