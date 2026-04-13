const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['All', 'Outfits', 'Gun Skins', 'X-Suits', 'UC'],
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  rarity: {
    type: String,
    enum: ['Mythic', 'Legendary', 'Epic', 'Rare'],
    required: true,
  },
  imageUrl: {
    type: String,
    required: true, // Path to the uploaded image inside /uploads
  },
  isDealOfDay: {
    type: Boolean,
    default: false,
  },
  isOutOfStock: {
    type: Boolean,
    default: false,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('StoreItem', storeItemSchema);
