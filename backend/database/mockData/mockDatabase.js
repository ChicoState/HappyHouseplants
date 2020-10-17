const { TIPS } = require('../models/tips');
const { USERS } = require('../models/users');
const { PLANTS } = require('../models/plants');
const tipsJSON = require('./tips.json');
const usersJSON = require('./users.json');
const plantsJSON = require('./plants.json');
/**
 * This is used to temporarily add to the database
 * While real data has not been scraped
 * Inserts default data into database
 */
function insertTestData() {
  USERS.insertMany(usersJSON);
  TIPS.insertMany(tipsJSON);
  PLANTS.insertMany(plantsJSON);
}

module.exports = { insertTestData };
