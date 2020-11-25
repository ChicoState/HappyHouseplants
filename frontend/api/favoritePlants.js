const { SERVER_ADDR } = require('../server');

const { authFetch } = require('./auth');

/**
 * Gets all plants that are marked as favorites by the user.
 * @returns {Promise} A Promise that resolves to an array of plants. */
function getFavorites() {
  return authFetch(`${SERVER_ADDR}/favorites`);
}

/**
 * Checks if a plant is marked as a favorite by the user.
 * @param {string} plantID The plantID of the plant object.
 * @returns {Promise} A Promise that resolves to `true` if the plant
 * is marked as a favorite, otherwise `false`. */
function isFavorite(plantID) {
  return new Promise((resolved, rejected) => {
    getFavorites()
      .then((favorites) => {
        resolved(favorites.some((cur) => cur.plantID === plantID));
      })
      .catch((error) => {
        rejected(error);
      });
  });
}

/**
 * Adds a plant to the user's favorites.
 * @param {*} plant The plant object to add.
 * @returns {Promise} A Promise that resolves to `true` if the plant was
 * added. False indicates that it was already a favorite, so nothing changed. */
function addToFavorites(plant) {
  return authFetch(`${SERVER_ADDR}/favorites`, 'PUT', plant);
}

/**
 * Removes a plant from the user's favorites.
 * @param {*} plantID The ID of the plant to remove.
 * @returns {Promise} A Promise that resolves to `true` if the plant was
 * removed. False indicates that it was already non-favorites, so nothing changed. */
function removeFromFavorites(plantID) {
  return authFetch(`${SERVER_ADDR}/favorites/${plantID}`, 'DELETE');
}

module.exports = {
  getFavorites,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
};
