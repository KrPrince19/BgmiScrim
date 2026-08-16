const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    unique: true,
    sparse: true, // allows existing docs without clerkId
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    default: '0000000000'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
