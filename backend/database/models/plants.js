const mongoose = require('mongoose');

mongoose.pluralize(null);
const plantSchema = new mongoose.Schema({
  plantID: { type: String, index: true },
  name: String,
  summary: String,
  maintenance: {
    level: Number,
    comment: String,
  },
  watering: {
    frequency: {
      quantity: Number,
      timeFrame: String,
    },
    comment: String,
  },
  lighting: {
    level: Number,
    comment: String,
    directSunlight: Boolean,
  },
  environment: {
    humidity: Number,
    indoor: Boolean,
    outdoor: Boolean,
    commonPests: {
      sourceURL: String,
      pests: Array,
    },
    comment: String,
    climate: {
      hot: Boolean,
      cold: Boolean,
    },
    temperature: {
      min: Number, // Celcius
      max: Number, // Celcius
    },
  },
  toxicity: {
    harmfulTo: Array,
    comment: String,
  },
  sourceURL: String,
  image: {
    sourceURL: String,
    credit: String,
  },
});

const PLANTS = mongoose.model('Plants', plantSchema);

module.exports = { PLANTS };
