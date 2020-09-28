const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tipSubject: String,
  tipMessage: String,
  tipID: String,
  plantType: String,
  sourceURL: URL,
});

const TIPS = mongoose.model('Tips', userSchema);

module.exports = { TIPS };
