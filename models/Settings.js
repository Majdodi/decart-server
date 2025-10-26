const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  siteName: String,
  contactEmail: String,
  themeColor: String
}, { timestamps: true });
module.exports = mongoose.model('Settings', schema);
