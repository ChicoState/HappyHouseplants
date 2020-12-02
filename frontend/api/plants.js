const { SERVER_ADDR } = require('../server');

const { authFetch } = require('./auth');

/**
 * Gets all Plants.
 * @returns { Promise } A Promise that resolves to an array of all plants.
 */
function getPlants() {
  return authFetch(`${SERVER_ADDR}/plants/`);
}

module.exports = {
  getPlants,
};
