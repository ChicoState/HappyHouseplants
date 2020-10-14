const { TIPS } = require('../models/tips');
const { USERS } = require('../models/users');
const tipsJSON = require('./tips.json');
const usersJSON = require('./users.json');
/**
 * This is used to temporarily add to the database
 * While real data has not been scraped
 * Inserts default data into database
 */
function insertTestData() {
  USERS.insertMany(usersJSON);
  TIPS.insertMany(tipsJSON);
}

module.exports = { insertTestData };
