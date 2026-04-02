const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scrim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scrim',
    required: true
  },
  transactionID: {
    type: String,
    required: true,
    minlength: 12,
    maxlength: 12
  },
  screenshot: {
    type: String,
    required: true
  },
  clanName: {
    type: String,
    required: true
  },
  player1: { type: String, required: true },
  player2: { type: String, required: true },
  player3: { type: String, required: true },
  player4: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvalDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
