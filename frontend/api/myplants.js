const { SERVER_ADDR } = require('../server');

const { authFetch } = require('./auth');

/**
 * Array of default plant locations. */
const DefaultPlantLocations = ['Living room', 'Kitchen', 'Bedroom', 'Porch'];

/**
 * Gets all plants that are owned by the user.
 * @returns {Promise<object[]>} A Promise that resolves to an array of plants.
 * Each plant has the following properties:
 *
 * `instanceID` - The unique ID of the particular instance of the plant.
 *
 * `plantID` - The ID of the plant in general, such as the ID of a Chinese Evergreen plant.
 *
 * `name` - The user-defined name of the plant.
 *
 * `location` - The user-defined location of the plant.
 *
 * `images` - An array where each value contains a `sourceURL` property that points to the image
 *            , and an optional `authenticationRequired` property that indicates whether
 *           authentication is required to retrieve the image. Due to the potential requirement for
 *           authentication, the application should use a `PlantImage` component rather than React
 *           Native's `Image` component.
 *  */
function getMyPlants() {
  return new Promise((plantsLoaded, rejected) => {
    authFetch(`${SERVER_ADDR}/myplants/`)
      .then((data) => {
        plantsLoaded(data);
      }).catch((error) => {
        rejected(error);
      });
  });
}

/**
 * @param {Array} plants - Input array of plants.
 * @returns {Object} - Dictionary-style object where each
 * key is a location, and each value is an array of plants
 * in that location.
 * @throws {Error} if the `plants` argument is falsey. */
function groupPlantsByLocation(plants) {
  if (!plants) {
    throw Error('The plants argument cannot be falsey.');
  }
  const ret = {};
  for (let i = 0; i < plants.length; i += 1) {
    const plant = plants[i];
    if (ret[plant.location]) {
      ret[plant.location].push(plant);
    } else {
      ret[plant.location] = [plant];
    }
  }
  return ret;
}

/**
 * Gets the locations into which a user's plants may be stored.
 * @param {boolean} includeUnusedDefaults Should `DefaultPlantLocations`
 * be included in the resolved array, even if none of the user's plants
 * are stored in such room?
 * @returns {Promise<string[]>} A Promise that resolves to an array of location names.
 * The resolved array is not sorted in any particular order. */
function getMyPlantLocations(includeUnusedDefaults = false) {
  return new Promise((locationsLoaded, rejected) => {
    getMyPlants()
      .then((plants) => {
        const ret = Object.keys(groupPlantsByLocation(plants));

        if (includeUnusedDefaults) {
          for (let i = 0; i < DefaultPlantLocations.length; i += 1) {
            if (!ret.includes(DefaultPlantLocations[i])) {
              ret.push(DefaultPlantLocations[i]);
            }
          }
        }

        locationsLoaded(ret);
      })
      .catch((error) => {
        rejected(error);
      });
  });
}

/**
 * Adds a new plant to the user's collection of owned plants.
 * @param {string} plantID The ID of the general plant type.
 * @param {string} name The user-defined name of the plant.
 * @param {string} location The user-defined location where the plant is stored.
 * If the location does not already exist, then it will be created.
 * @param {*} images Array of objects that contain the images. There are two possible
 * methods of specifying each image. You can specify an image by a URL, by including
 * an object with a `sourceURL` property. Or you can upload an image by
 * including an object with a `base64` property, which will contain the base64-encoded
 * JPEG image.
 * @returns {Promise<string>} A Promise that resolves to the instance ID of the owned plant.
 * The Promise will be rejected if any argument is invalid, or if there is a network error. */
function addToMyPlants(plantID, name, location, images) {
  return new Promise((plantAdded, rejected) => {
    if (!plantID) {
      rejected(Error('The plantID argument cannot be falsey.'));
    } else if (!name) {
      rejected(Error('The name argument cannot be falsey.'));
    } else if (!location) {
      rejected(Error('The location argument cannot be falsey.'));
    } else if (!images) {
      rejected(Error('The images argument cannot be falsey.'));
    } else {
      authFetch(`${SERVER_ADDR}/myplants`, 'POST', {
        plantID,
        name,
        location,
        images,
      }).then((response) => {
        if (response.error) {
          rejected(Error(response.error));
        } else {
          plantAdded(response.instanceID);
        }
      }).catch((error) => {
        rejected(error);
      });
    }
  });
}

/**
 * Removes a plant from the user's collection of owned plants.
 * @param {string} instanceID The instance ID of the owned plant.
 * @returns {Promise} A Promise that resolves after the plant has been removed.
 * The Promise will be rejected if `instanceID` is falsey, or if there is a network error. */
function removeFromMyPlants(instanceID) {
  return new Promise((plantRemoved, rejected) => {
    if (!instanceID) {
      rejected(Error('The instanceID argument cannot be falsey.'));
    } else {
      authFetch(`${SERVER_ADDR}/myplants/${instanceID}`, 'DELETE').then(() => {
        plantRemoved();
      }).catch((error) => {
        rejected(error);
      });
    }
  });
}

/**
 * Updates information about an owned plant.
 * @param {string} instanceID The instance ID of the owned plant.
 * @param {*} plant - The new plant data to assign. It may contain any of the following
 * properties:
 *
 * `name` - The new name to assign to the plant.
 *
 * `location` - The new location of the plant. If this does not refer to an existing
 *              location, then it will be created.
 *
 * @returns {Promise} A Promise that resolves to the new state of the plant.
 * The Promise will be rejected if any argument is invalid, or if there is a network error. */
function updateMyPlant(instanceID, plant) {
  return new Promise((plantUpdated, rejected) => {
    if (!instanceID) {
      rejected(Error('The instanceID argument cannot be falsey.'));
    } else if (!plant) {
      rejected(Error('The plant argument cannot be falsey.'));
    } else {
      authFetch(`${SERVER_ADDR}/myplants/${instanceID}`, 'PUT', plant).then((response) => {
        if (response.error) {
          rejected(Error(response.error));
        } else {
          plantUpdated(response);
        }
      }).catch((error) => {
        rejected(error);
      });
    }
  });
}
/**
 * Adds an image to an owned plant.
 * @param {string} instanceID The instance ID of the owned plant.
 * @param {string} base64 The base64-encoded JPEG data of the image to upload.
 * @param {Date} date The date when the picture was taken.
 * @returns {Promise} A Promise that resolves after the image has been uploaded. */
function addMyPlantImage(instanceID, base64, date) {
  return new Promise((added, rejected) => {
    if (!instanceID) {
      rejected(Error('The instanceID argument cannot be falsey.'));
    } else if (!base64) {
      rejected(Error('The base64 argument cannot be falsey.'));
    } else if (!date) {
      rejected(Error('The date argument cannot be falsey.'));
    } else {
      authFetch(`${SERVER_ADDR}/myplants/${instanceID}/image/`, 'POST', {
        base64, date,
      })
        .then(() => {
          added();
        })
        .catch((error) => {
          rejected(error);
        });
    }
  });
}

/**
 * Removes an image of an owned plant.
 * @param {string} instanceID The instance ID of the owned plant.
 * @param {Number} index The index of the image to remove.
 * @returns {Promise} A Promise that resolves after the image has been removed. */
function removeMyPlantImage(instanceID, index) {
  return new Promise((removed, rejected) => {
    if (!instanceID) {
      rejected(Error('The instanceID argument cannot be falsey.'));
    } else if (index === undefined) {
      rejected(Error('The index argument cannot be undefined.'));
    } else {
      authFetch(`${SERVER_ADDR}/myplants/${instanceID}/image/${index}`, 'DELETE')
        .then(() => {
          removed();
        })
        .catch((error) => {
          rejected(error);
        });
    }
  });
}

/**
 * Updates an image of an owned plant.
 * @param {string} instanceID The instance ID of the owned plant.
 * @param {Number} index The index of the image to update.
 * @param {string} base64 The base64-encoded JPEG data of the new image to upload.
 * @param {string} date The date when the new picture was taken.
 * @returns {Promise} A Promise that resolves after the image has been updated. */
function updateMyPlantImage(instanceID, index, base64, date) {
  return new Promise((updated, rejected) => {
    if (!instanceID) {
      rejected(Error('The instanceID argument cannot be falsey.'));
    } else if (index === undefined) {
      rejected(Error('The index argument cannot be undefined.'));
    } else if (!base64) {
      rejected(Error('The base64 argument cannot be falsey.'));
    } else if (!date) {
      rejected(Error('The date argument cannot be falsey.'));
    } else {
      authFetch(`${SERVER_ADDR}/myplants/${instanceID}/image/${index}`, 'PUT', {
        base64, date,
      })
        .then(() => {
          updated();
        })
        .catch((error) => {
          rejected(error);
        });
    }
  });
}

module.exports = {
  DefaultPlantLocations,
  getMyPlants,
  groupPlantsByLocation,
  getMyPlantLocations,
  addToMyPlants,
  removeFromMyPlants,
  updateMyPlant,
  addMyPlantImage,
  removeMyPlantImage,
  updateMyPlantImage,
};
