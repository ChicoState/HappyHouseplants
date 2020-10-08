const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  tipSubject: String,
  tipMessage: String,
  tipID: { type: String, index: true },
  plantType: String,
  sourceURL: String,
});

const TIPS = mongoose.model('tips', tipSchema);


module.exports = { TIPS };
