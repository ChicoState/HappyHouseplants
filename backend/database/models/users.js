const mongoose = require('mongoose');

mongoose.pluralize(null);
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  userId: { type: String, index: true },
  password: String, // Salted+Hashed
  savedTipsByID: Array,
  favoritePlants: [
    {
      plantID: String,
      name: String,
      image: {
        sourceURL: String,
      },
    },
  ],
  myPlantsByID: [
    {
      plantID: String,
      name: String,
      location: String,
      images: [{
        date: Date,
        base64: String,
      }],
    },
  ],
  calendarNotes: mongoose.Schema.Types.Mixed,

  expoPushToken: String,
  customLabels: [{
    text: String,
    color: String,
  }],
});

const USERS = mongoose.model('Users', userSchema);

module.exports = { USERS };
