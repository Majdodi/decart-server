const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  archived: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Message', schema);
