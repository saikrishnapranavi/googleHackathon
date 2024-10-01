const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  location: String,
  browsingHistory: [String],
  preferences: {
    type: Map,
    of: String
  }
});

module.exports = mongoose.model('User', userSchema);