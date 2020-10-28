const mongoose = require('mongoose');

mongoose.pluralize(null);
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  userId: { type: String, index: true },
  password: String, // Salted+Hashed
  savedTipsByID: Array,
  savedPlantsByID: Array,
  myPlantsByID: Array,
});

const USERS = mongoose.model('Users', userSchema);

module.exports = { USERS };
