const { SERVER_ADDR } = require('../server');

const { authFetch } = require('./auth');

/**
 * Gets all Plants.
 * @returns { Promise } A Promise that resolves to an array of all plants.
 */
function getPlants() {
  return authFetch(`${SERVER_ADDR}/plants/`);
}

/**
 * Gets the information about a plant.
 * @param {String} plantID The ID of the plant.
 * @returns {Promise} A Promise that resolves to an object containing
 * information about the plant. */
function getPlantInfo(plantID) {
  return authFetch(`${SERVER_ADDR}/plants/${plantID}`);
}

module.exports = {
  getPlants,
  getPlantInfo,
};
