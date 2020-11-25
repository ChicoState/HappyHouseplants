const {
  authGet,
  authDelete,
  updateUserDocument,
} = require('../api/auth');

module.exports = (app) => {
  authGet(app, '/savedplants', (req, res, userDoc) => {
    let savedPlantsByID = [];
    if (userDoc.savedPlantsByID) {
      savedPlantsByID = userDoc.savedPlantsByID;
    }

    res.json(savedPlantsByID);
  }, true);

  authDelete(app, '/savedplants', (req, res, userDoc) => {
    const { plantID } = req.body;
    let savedPlantsByID = [];
    if (userDoc.savedPlantsByID) {
      savedPlantsByID = userDoc.savedPlantsByID;
    }

    const newSavedPlantsByID = savedPlantsByID.filter((plant) => plant.plantID !== plantID);

    updateUserDocument(userDoc.userId, { savedPlantsByID: newSavedPlantsByID }).then(() => {
      console.log(`Removed plant ${plantID} from user ID ${userDoc.userId}'s saved plants.`);
      res.status(201).json({});
    }).catch((saveError) => {
      console.error(`Failed to remove a plant from 'savedplants' for user ID ${userDoc.userId}. Reason: ${saveError}`);
      res.status(500).json({});
    });
  });
};
