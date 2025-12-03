const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  siteName: String,
  contactEmail: String,
  themeColor: String,

  // ⭐ أضف هذا السطر:
  heroImage: { type: String, default: "/images/perfume.jpg" }

}, { timestamps: true });

module.exports = mongoose.model('Settings', schema);
