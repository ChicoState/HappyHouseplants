const {
  authGet,
  authPut,
  authDelete,
  updateUserDocument,
} = require('../api/auth');

module.exports = (app) => {
  authGet(app, '/favorites', (req, res, userDoc) => {
    let favoritePlants = [];
    if (userDoc.favoritePlants) {
      favoritePlants = userDoc.favoritePlants;
    }

    // Don't report the unnecessary _id property of favorite plants
    const idProp = '_id';
    for (let i = 0; i < favoritePlants.length; i += 1) {
      delete favoritePlants[i][idProp];
    }

    res.json(favoritePlants);
  }, true);

  authDelete(app, '/favorites/:plantID', (req, res, userDoc) => {
    const { plantID } = req.params;
    let favoritePlants = [];
    if (userDoc.favoritePlants) {
      favoritePlants = userDoc.favoritePlants;
    }

    const newfavoritePlants = favoritePlants.filter((plant) => plant.plantID !== plantID);
    const wasDeleted = newfavoritePlants.length < favoritePlants.length;

    updateUserDocument(userDoc.userId, { favoritePlants: newfavoritePlants }).then(() => {
      console.log(`Removed plant ${plantID} from user ID ${userDoc.userId}'s favorite plants.`);
      res.status(201).json(wasDeleted);
    }).catch((saveError) => {
      console.error(`Failed to remove a plant from 'favorites' for user ID ${userDoc.userId}. Reason: ${saveError}`);
      res.status(500).json({});
    });
  });

  authPut(app, '/favorites/', (req, res, userDoc) => {
    const {
      plantID,
      name,
      image,
    } = req.body;
    let favoritePlants = [];
    if (userDoc.favoritePlants) {
      favoritePlants = userDoc.favoritePlants;
    }

    // Only store known properties (don't allow client to store arbitrary data)
    const plant = {
      plantID,
      name,
      image,
    };

    // Check if it already exists
    const existingIndex = favoritePlants.findIndex((cur) => cur.plantID === plantID);

    if (existingIndex === -1) {
      favoritePlants.push(plant);
    } else {
      favoritePlants[existingIndex] = plant;
    }

    updateUserDocument(userDoc.userId, { favoritePlants }).then(() => {
      console.log(`Added plant ${plantID} to user ID ${userDoc.userId}'s favorite plants.`);
      res.status(201).json(existingIndex === -1);
    }).catch((saveError) => {
      console.error(`Failed to add a plant to 'favorites' for user ID ${userDoc.userId}. Reason: ${saveError}`);
      res.status(500).json({});
    });
  }, true);
};
