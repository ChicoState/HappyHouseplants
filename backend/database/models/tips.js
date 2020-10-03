const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  tipSubject: String,
  tipMessage: String,
  tipID: String,
  plantType: String,
  sourceURL: String,
});

const TIPS = mongoose.model('Tips', tipSchema);

module.exports = { TIPS };
