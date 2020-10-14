const mongoose = require('mongoose');

mongoose.pluralize(null);
const tipSchema = new mongoose.Schema({
  tipID: { type: String, index: true },
  tipSubject: String,
  tipMessage: String,
  // plantType: String,
  sourceURL: String,
});

const TIPS = mongoose.model('tips', tipSchema);

module.exports = { TIPS };
