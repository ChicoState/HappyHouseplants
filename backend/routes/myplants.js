const {
  authGet,
  authPost,
  authPut,
  authDelete,
  updateUserDocument,
} = require('../api/auth');
const { findOneDocument } = require('../database/findDocuments');

/**
 * Rewrites a Plant object so it is readable by the client. This involves renaming the
 * `_id` property to `instanceID`, and changing base64 images to a URL instead (so we
 * don't waste bandwidth sending the images when they may not be needed).
 * @param {*} plant The raw owned Plant instance, directly from the database.
 * @param {*} req The Request object.
 * @returns {*} The plant, but in a format that is expected by the client.
 */
function rewritePlantForRequest(plant, req) {
  const ret = plant;
  const idProp = '_id';

  for (let i = 0; i < ret.images.length; i += 1) {
    if (ret.images[i].base64) {
      // Rewrite plant to refer to server image URL instead of sending the whole image now
      delete ret.images[i].base64;
      ret.images[i].sourceURL = `${req.protocol}://${req.get('host')}/myplants/${ret[idProp]}/image/${i}`;
      ret.images[i].authenticationRequired = true;
    }

    // Remove the _id property
    delete ret.images[i][idProp];
  }

  // Rename '_id' to 'instanceID'
  ret.instanceID = plant[idProp];
  delete ret[idProp];

  return ret;
}

module.exports = (app) => {
  authGet(app, '/myplants', (req, res, userDoc) => {
    let myPlantsByID = [];
    if (userDoc.myPlantsByID) {
      myPlantsByID = userDoc.myPlantsByID;
    }

    res.json(myPlantsByID.map((rawPlant) => rewritePlantForRequest(rawPlant, req)));
  }, true);

  authGet(app, '/myplants/:instanceID/image/:index', (req, res, userDoc) => {
    const { instanceID, index } = req.params;
    let myPlantsByID = [];
    if (userDoc.myPlantsByID) {
      myPlantsByID = userDoc.myPlantsByID;
    }

    const idProp = '_id';
    const plant = myPlantsByID.find((cur) => cur[idProp].toString() === instanceID.toString());
    if (plant && index >= 0 && index < plant.images.length && plant.images[index].base64) {
      res.json(plant.images[index].base64);
    } else {
      res.status(404).send();
    }
  }, true);

  authPost(app, '/myplants/:instanceID/image/', (req, res, userDoc) => {
    const { instanceID } = req.params;
    const { base64, date } = req.body.image;
    let myPlantsByID = [];
    if (userDoc.myPlantsByID) {
      myPlantsByID = userDoc.myPlantsByID;
    }

    const idProp = '_id';
    const plantIdx = myPlantsByID.findIndex(
      (cur) => cur[idProp].toString() === instanceID.toString(),
    );
    if (plantIdx !== -1) {
      myPlantsByID[plantIdx].images.push({
        base64,
        date,
      });

      updateUserDocument(userDoc.userId, { myPlantsByID }).then(() => {
        res.status(201).json({});
      }).catch((saveError) => {
        console.error(`Failed to update a plant picture for user ID ${userDoc.userId}. Reason: ${saveError}`);
        res.status(500).json({});
      });
    } else {
      res.status(404).send();
    }
  }, true);

  authPut(app, '/myplants/:instanceID/image/:index', (req, res, userDoc) => {
    const { instanceID, index } = req.params;
    const { base64, date } = req.body.image;
    let myPlantsByID = [];
    if (userDoc.myPlantsByID) {
      myPlantsByID = userDoc.myPlantsByID;
    }

    const idProp = '_id';
    const plantIdx = myPlantsByID.findIndex(
      (cur) => cur[idProp].toString() === instanceID.toString(),
    );
    if (plantIdx !== -1 && index >= 0 && index < myPlantsByID[plantIdx].images.length) {
      myPlantsByID[plantIdx].images[index] = {
        base64,
        date,
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

  authDelete(app, '/myplants/:instanceID/image/:index', (req, res, userDoc) => {
    const { instanceID, index } = req.params;
    let myPlantsByID = [];
    if (userDoc.myPlantsByID) {
      myPlantsByID = userDoc.myPlantsByID;
    }

    const idProp = '_id';
    const plantIdx = myPlantsByID.findIndex(
      (cur) => cur[idProp].toString() === instanceID.toString(),
    );
    if (plantIdx !== -1 && index >= 0 && index < myPlantsByID[plantIdx].images.length) {
      myPlantsByID[plantIdx].images.splice(index, 1);

      updateUserDocument(userDoc.userId, { myPlantsByID }).then(() => {
        res.status(200).json({});
      }).catch((saveError) => {
        console.error(`Failed to delete a plant picture for user ID ${userDoc.userId}. Reason: ${saveError}`);
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
      images,
    } = req.body;
    let myPlantsByID = [];
    if (userDoc.myPlantsByID) {
      myPlantsByID = userDoc.myPlantsByID;
    }

    // Only store known properties (don't allow client to store arbitrary data)
    const plant = {
      plantID,
      name,
      location,
      images,
    };
    myPlantsByID.push(plant);

    updateUserDocument(userDoc.userId, { myPlantsByID }).then(() => {
    // Need to refresh so the returned Plant object will include the assigned instanceID (_id).
      findOneDocument('Users', { userId: userDoc.userId })
        .then((newUserDoc) => {
          const addedPlant = newUserDoc.myPlantsByID[newUserDoc.myPlantsByID.length - 1];
          console.log(`Added plant ${plantID} to user ID ${userDoc.userId}'s owned plants`);
          res.status(201).json(rewritePlantForRequest(addedPlant, req));
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

      updateUserDocument(userDoc.userId, { myPlantsByID }).then(() => {
        console.log(`Updated plant with instanceID=${instanceID} for user ID ${userDoc.userId}.`);

        const responseObj = rewritePlantForRequest(myPlantsByID[plantIndex], req);
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
