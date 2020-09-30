const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  userId: String,
  password: String,
  savedTipsByID: Array,
  savedPlantsByID: Array,
});

const USERS = mongoose.model('Users', userSchema);

module.exports = { USERS };
