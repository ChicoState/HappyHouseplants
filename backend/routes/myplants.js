const {
  authGet,
  authPost,
  authPut,
  authDelete,
  updateUserDocument,
} = require('../api/auth');
const { findOneDocument } = require('../database/findDocuments');

module.exports = (app) => {
  authGet(app, '/myplants', (req, res, userDoc) => {
    let myPlantsByID = [];
    if (userDoc.myPlantsByID) {
      myPlantsByID = userDoc.myPlantsByID;
    }

    const idProp = '_id';
    const imageMappedPlants = [];
    for (let i = 0; i < myPlantsByID.length; i += 1) {
      const plant = myPlantsByID[i];
      if (plant.image.base64) {
        // Rewrite plant to refer to server image URL
        delete plant.image.base64;
        plant.image.sourceURL = `${req.protocol}://${req.get('host')}${req.originalUrl}${plant[idProp]}/image.jpg`;
        plant.image.authenticationRequired = true;
      } // TODO: Refactor

      // Rename '_id' to 'instanceID'
      plant.instanceID = plant[idProp];
      delete plant[idProp];

      imageMappedPlants.push(plant);
    }

    res.json(imageMappedPlants);
  }, true);

  authGet(app, '/myplants/:plantID/image.jpg', (req, res, userDoc) => {
    const { plantID } = req.params;
    let myPlantsByID = [];
    if (userDoc.myPlantsByID) {
      myPlantsByID = userDoc.myPlantsByID;
    }

    const idProp = '_id';
    const plant = myPlantsByID.find((cur) => cur[idProp].toString() === plantID.toString());
    if (plant && plant.image.base64) {
      res.json(plant.image.base64);
    } else {
      res.status(404).send();
    }
  }, true);

  authPut(app, '/myplants/:plantID/image.jpg', (req, res, userDoc) => {
    const { plantID } = req.params;
    const { base64 } = req.body.image;
    let myPlantsByID = [];
    if (userDoc.myPlantsByID) {
      myPlantsByID = userDoc.myPlantsByID;
    }

    const idProp = '_id';
    const idx = myPlantsByID.findIndex((cur) => cur[idProp].toString() === plantID.toString());
    if (idx !== -1) {
      myPlantsByID[idx].image = {
        base64,
      };

      updateUserDocument(userDoc.userId, { myPlantsByID }).then(() => {
        res.status(200).json({});
      }).catch((saveError) => {
        console.error(`Failed to update a plant picture for user ID ${userDoc.userId}. Reason: ${saveError}`);
        res.status(500).json({});
      });
    } else {
      res.status(404).send();
    }
  }, true);

  authPost(app, '/myplants', (req, res, userDoc) => {
    const {
      plantID,
      name,
      location,
      image,
    } = req.body;
    const idProp = '_id';
    let myPlantsByID = [];
    if (userDoc.myPlantsByID) {
      myPlantsByID = userDoc.myPlantsByID;
    }

    // Only store known properties (don't allow client to store arbitrary data)
    const plant = {
      plantID,
      name,
      location,
      image,
    };
    myPlantsByID.push(plant);

    updateUserDocument(userDoc.userId, { myPlantsByID }).then(() => {
    // Refresh to find the instanceID
    // TODO: Optimize this. We need the _id that was assigned to the added plant.
      findOneDocument('Users', { userId: userDoc.userId })
        .then((newUserDoc) => {
          const addedPlant = newUserDoc.myPlantsByID[newUserDoc.myPlantsByID.length - 1];
          addedPlant.instanceID = addedPlant[idProp];
          delete addedPlant[idProp];
          console.log(`Added plant ${plantID} to user ID ${userDoc.userId}'s owned plants`);
          res.status(201).json(addedPlant);
        })
        .catch((refreshError) => {
          console.error(`Failed to add a plant to 'myplants' for user ID ${userDoc.userId}. Reason: ${refreshError}`);
          res.status(500).json({});
        });
    }).catch((saveError) => {
      console.error(`Failed to add a plant to 'myplants' for user ID ${userDoc.userId}. Reason: ${saveError}`);
      res.status(500).json({});
    });
  }, true);

  authPost(app, '/savedplants', (req, res, userDoc) => {
    const {
      plantID,
      plantName,
      image,
    } = req.body;
    let savedPlantsByID = [];
    if (userDoc.savedPlantsByID) {
      savedPlantsByID = userDoc.savedPlantsByID;
    }

    // Only store known properties (don't allow client to store arbitrary data)
    const plant = {
      plantID,
      plantName,
      image,
    };
    savedPlantsByID.push(plant);

    updateUserDocument(userDoc.userId, { savedPlantsByID }).then(() => {
      console.log(`Added plant ${plantID} to user ID ${userDoc.userId}'s saved plants.`);
      res.status(201).json({});
    }).catch((saveError) => {
      console.error(`Failed to add a plant to 'savedplants' for user ID ${userDoc.userId}. Reason: ${saveError}`);
      res.status(500).json({});
    });
  }, true);

  authDelete(app, '/myplants/:instanceID', (req, res, userDoc) => {
    const idProp = '_id';
    const { instanceID } = req.params;
    let myPlantsByID = [];
    if (userDoc.myPlantsByID) {
      myPlantsByID = userDoc.myPlantsByID;
    }

    const newMyPlantsByID = myPlantsByID.filter(
      (cur) => cur[idProp].toString() !== instanceID.toString(),
    );

    if (newMyPlantsByID.length !== myPlantsByID.length) {
      updateUserDocument(userDoc.userId, { myPlantsByID: newMyPlantsByID }).then(() => {
        console.log(`Removed plant with instanceID=${instanceID} from user ID ${userDoc.userId}'s owned plants.`);
        res.status(201).json({});
      }).catch((saveError) => {
        console.error(`Failed to remove a plant from 'myplants' for user ID ${userDoc.userId}. Reason: ${saveError}`);
        res.status(500).json({});
      });
    } else {
      console.log(`Failed to remove plant with instanceID=${instanceID} from user ID ${userDoc.userId}'s owned plants because the instanceID was not recognized.`);
      res.status(404).json({});
    }
  }, true);

  authPut(app, '/myplants/:instanceID', (req, res, userDoc) => {
    const idProp = '_id';
    const { instanceID } = req.params;
    const newPlantProps = req.body;
    let myPlantsByID = [];
    if (userDoc.myPlantsByID) {
      myPlantsByID = userDoc.myPlantsByID;
    }

    const plantIndex = myPlantsByID.findIndex((cur) => cur[idProp].toString() === instanceID);

    if (plantIndex !== -1) {
      // Copy all valid properties in request body
      if (newPlantProps.name) {
        myPlantsByID[plantIndex].name = newPlantProps.name;
      }
      if (newPlantProps.location) {
        myPlantsByID[plantIndex].location = newPlantProps.location;
      }
      if (newPlantProps.image) {
        myPlantsByID[plantIndex].image = newPlantProps.image;
      }

      updateUserDocument(userDoc.userId, { myPlantsByID }).then(() => {
        console.log(`Updated plant with instanceID=${instanceID} for user ID ${userDoc.userId}.`);

        const responseObj = myPlantsByID[plantIndex];
        // Convert base64 image (if it is) to URL
        if (responseObj.image.base64) {
          // Rewrite plant to refer to server image URL
          delete responseObj.image.base64;
          responseObj.image.sourceURL = `${req.protocol}://${req.get('host')}${req.originalUrl}/image.jpg`;
          responseObj.image.authenticationRequired = true;
        } // TODO: This really needs refactored!

        // Rename '_id' to 'instanceID' in the response
        responseObj.instanceID = responseObj[idProp];
        delete responseObj[idProp];

        res.status(201).json(responseObj);
      }).catch((saveError) => {
        console.error(`Failed to update a plant in 'myplants' for user ID ${userDoc.userId}. Reason: ${saveError}`);
        res.status(500).json({});
      });
    } else {
      console.error(`Failed to update plant with instanceID=${instanceID} for user ID ${userDoc.userId}.`);
      res.status(404).json({});
    }
  });
};
