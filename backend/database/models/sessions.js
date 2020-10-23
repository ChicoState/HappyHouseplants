const mongoose = require('mongoose');

mongoose.pluralize(null);
const sessionSchema = new mongoose.Schema({
  authToken: String,
  userId: String,
  creationDate: Date,
  lastLoginDate: Date,
  expireDate: Date,
});

const SESSIONS = mongoose.model('Sessions', sessionSchema);

module.exports = { SESSIONS };
