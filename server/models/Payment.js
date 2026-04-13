const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentType: {
    type: String,
    enum: ['scrim', 'store'],
    default: 'scrim'
  },
  scrim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scrim',
    required: function() { return this.paymentType === 'scrim'; }
  },
  storeItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoreItem'
  },
  itemName: String,
  priceAtPurchase: Number,
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
    required: function() { return this.paymentType === 'scrim'; }
  },
  player1: { type: String, required: function() { return this.paymentType === 'scrim'; } },
  player2: { type: String, required: function() { return this.paymentType === 'scrim'; } },
  player3: { type: String, required: function() { return this.paymentType === 'scrim'; } },
  player4: { type: String, required: function() { return this.paymentType === 'scrim'; } },
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
