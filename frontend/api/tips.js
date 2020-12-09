const { SERVER_ADDR } = require('../server');

const { authFetch } = require('./auth');

/**
 * Gets a set of random plant maintenance tips.
 * @returns { Promise } A Promise that resolves to an array of tip IDs.
 */
function getRandomTips() {
  return authFetch(`${SERVER_ADDR}/random_tips/`);
}

/**
 * Gets the data for a tip by its ID.
 * @param { string } tipId The ID of the tip.
 * @returns { Promise } A Promise that resolves to the tip object.
 */
function getTip(tipId) {
  return authFetch(`${SERVER_ADDR}/tips/${tipId}`);
}

module.exports = {
  getRandomTips,
  getTip,
};
