require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const HOST = '0.0.0.0';
const PORT = '8080';
const { databaseConnection } = require('./database/mongooseConnect.js');
const { findDocuments, findOneDocument } = require('./database/findDocuments');
const { insertTestData } = require('./database/mockData/mockDatabase');
const { register, login, authenticateUserRequest } = require('./auth.js');
const { USERS } = require('./database/models/users.js');

function main() {
  console.log('Server starting...');
}

/**
 * TODO: we may want to change how often or when we connect to db
 */
databaseConnection.once('open', () => {
  main();
  insertTestData();
});

app.use(bodyParser.json()); // Needed so we can read the body of POSTs

app.get('/random_tips/', (req, res) => {
  const maxCount = req.query.count ? req.query.count : 10;
  const tipsQuery = {};
  findDocuments('tips', tipsQuery).then((docs) => {
    const shuffledDocs = docs;
    // Shuffle the documents
    for (let i = shuffledDocs.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const hold = docs[i];
      shuffledDocs[i] = docs[j];
      shuffledDocs[j] = hold;
    }
    const endIndex = Math.min(maxCount, shuffledDocs.length);
    res.json(shuffledDocs.slice(0, endIndex).map((tip) => tip.tipID));
  });
});

app.get('/tips/', (req, res) => {
  const tipsQuery = {};
  findDocuments('tips', tipsQuery).then((docs) => {
    res.json(docs);
  });
});

app.get('/tips/:tipID', (req, res) => {
  const tipQuery = { tipID: req.params.tipID };
  findDocuments('tips', tipQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).json({});
    } else {
      res.json(docs[0]);
    }
  });
});

app.get('/users/:userId', (req, res) => {
  const userQuery = { userId: req.params.userId };
  findDocuments('Users', userQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).json({});
    } else {
      // Don't send the whole 'user' document, that'll contain sensitive information!
      const user = docs[0];
      const publicUserInfo = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      };
      res.json(publicUserInfo);
    }
  });
});

app.get('/mytips', (req, res) => {
  authenticateUserRequest(req, res).then((userId) => {
    if (userId) {
      findOneDocument('Users', { userId }).then((user) => {
        res.json(user.savedTipsByID);
      });
    } else {
      res.status(403).json({});
    }
  });
});

app.get('/myplants', (req, res) => {
  authenticateUserRequest(req, res).then((userId) => {
    if (userId) {
      findOneDocument('Users', { userId }).then((userDoc) => {
        let myPlantsByID = [];
        if (userDoc.myPlantsByID) {
          myPlantsByID = userDoc.myPlantsByID;
        }

        res.json(myPlantsByID);
      });
    } else {
      res.status(403).json({});
    }
  });
});

app.get('/savedplants', (req, res) => {
  authenticateUserRequest(req, res).then((userId) => {
    if (userId) {
      findOneDocument('Users', { userId }).then((userDoc) => {
        let savedPlantsByID = [];
        if (userDoc.savedPlantsByID) {
          savedPlantsByID = userDoc.savedPlantsByID;
        }

        res.json(savedPlantsByID);
      });
    } else {
      res.status(403).json({});
    }
  });
});

app.post('/myplants', (req, res) => {
  authenticateUserRequest(req, res).then((userId) => {
    if (userId) {
      const query = { userId };
      const plant = req.body;
      findOneDocument('Users', query).then((userDoc) => {
        let myPlantsByID = [];
        if (userDoc.myPlantsByID) {
          myPlantsByID = userDoc.myPlantsByID;
        }

        myPlantsByID.push(plant);

        USERS.updateOne(query, { myPlantsByID }).then(() => {
          console.log(`Added plant ${JSON.stringify(plant)} to user ID ${userId}'s owned plants.`);
          res.status(201).json({});
        }).catch((saveError) => {
          console.error(`Failed to add a plant to 'myplants' for user ID ${userId}. Reason: ${saveError}`);
          res.status(500).json({});
        });
      });
    } else {
      res.status(403).json({});
    }
  });
});

app.post('/savedplants', (req, res) => {
  authenticateUserRequest(req, res).then((userId) => {
    if (userId) {
      const query = { userId };
      const plantID = req.body;
      findOneDocument('Users', query).then((userDoc) => {
        let savedPlantsByID = [];
        if (userDoc.savedPlantsByID) {
          savedPlantsByID = userDoc.savedPlantsByID;
        }

        savedPlantsByID.push(plantID);

        USERS.updateOne(query, { savedPlantsByID }).then(() => {
          console.log(`Added plant ID ${plantID} to user ID ${userId}'s saved plants.`);
          res.status(201).json({});
        }).catch((saveError) => {
          console.error(`Failed to add a plant to 'savedplants' for user ID ${userId}. Reason: ${saveError}`);
          res.status(500).json({});
        });
      });
    } else {
      res.status(403).json({});
    }
  });
});

app.delete('/myplants', (req, res) => {
  authenticateUserRequest(req, res).then((userId) => {
    if (userId) {
      const query = { userId };
      const plant = req.body;
      findOneDocument('Users', query).then((userDoc) => {
        let myPlantsByID = [];
        if (userDoc.myPlantsByID) {
          myPlantsByID = userDoc.myPlantsByID;
        }

        const index = myPlantsByID.indexOf(plant);
        if (index > -1) {
          myPlantsByID.splice(index, 1);
        }

        USERS.updateOne(query, { myPlantsByID }).then(() => {
          console.log(`Removed plant ${JSON.stringify(plant)} from user ID ${userId}'s owned plants.`);
          res.status(201).json({});
        }).catch((saveError) => {
          console.error(`Failed to remove a plant from 'myplants' for user ID ${userId}. Reason: ${saveError}`);
          res.status(500).json({});
        });
      });
    } else {
      res.status(403).json({});
    }
  });
});

app.delete('/savedplants', (req, res) => {
  authenticateUserRequest(req, res).then((userId) => {
    if (userId) {
      const query = { userId };
      const { plantID } = req.body;
      findOneDocument('Users', query).then((userDoc) => {
        let savedPlantsByID = [];
        if (userDoc.savedPlantsByID) {
          savedPlantsByID = userDoc.savedPlantsByID;
        }

        const newSavedPlantsByID = savedPlantsByID.filter((plant) => plant.plantID !== plantID);

        USERS.updateOne(query, { savedPlantsByID: newSavedPlantsByID }).then(() => {
          console.log(`Removed plant ${plantID} from user ID ${userId}'s saved plants.`);
          res.status(201).json({});
        }).catch((saveError) => {
          console.error(`Failed to remove a plant from 'savedplants' for user ID ${userId}. Reason: ${saveError}`);
          res.status(500).json({});
        });
      });
    } else {
      res.status(403).json({});
    }
  });
});

app.get('/mycalendar/notes', (req, res) => {
  authenticateUserRequest(req, res).then((userId) => {
    if (userId) {
      const query = { userId };
      findOneDocument('Users', query).then((userDoc) => {
        const { calendarNotes = {/* Default no notes */} } = userDoc;
        res.json(calendarNotes);
      });
    } else {
      res.status(403).json({});
    }
  });
});

app.post('/mycalendar/notes/', (req, res) => {
  authenticateUserRequest(req, res).then((userId) => {
    if (userId) {
      const query = { userId };
      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      const when = keys[0];
      const note = values[0];
      findOneDocument('Users', query).then((userDoc) => {
        const { calendarNotes = {/* Default no notes */} } = userDoc;

        if (calendarNotes[when]) {
          // Append to the existing date's notes
          calendarNotes[when].push(note);
        } else {
          // Create a new date:note pair
          calendarNotes[when] = [note];
        }
        USERS.updateOne(query, { calendarNotes }).then(() => {
          res.status(201).json({});
        }).catch((saveError) => {
          console.error(`Failed to post a note (${JSON.stringify(note)}) to the calendar for user ID ${userId}. Reason: ${saveError}`);
          res.status(500).json({});
        });
      });
    } else {
      res.status(403).json({});
    }
  });
});

app.get('/plants/', (req, res) => {
  const plantsQuery = {};
  findDocuments('Plants', plantsQuery).then((docs) => {
    res.json(docs);
  });
});

app.get('/plants/:plantID', (req, res) => {
  const userQuery = { plantID: req.params.plantID };
  findDocuments('Plants', userQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).json({});
    } else {
      res.json(docs[0]);
    }
  });
});

app.post('/register/', (req, res) => {
  const {
    username, password, firstName, lastName,
  } = req.body;
  register(username, password, firstName, lastName).then((status) => {
    res.json(status);
  }).catch((reason) => {
    console.error(`Failed to register a user due to an error: ${reason}`);
    res.json({});
  });
});

app.post('/login/', (req, res) => {
  const { username, password } = req.body;
  login(username, password).then((status) => {
    res.json(status);
  }).catch((reason) => {
    console.error(`Failed to login a user due to an error: ${reason}`);
    res.json({});
  });
});

app.get('/login_info', (req, res) => {
  authenticateUserRequest(req, res).then((userId) => {
    if (userId) {
      findOneDocument('Users', { userId }).then((user) => {
        res.json({
          userId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      });
    } else {
      // Not logged in, send null info
      res.json(null);
    }
  }).catch((error) => {
    console.error(`Failed to get login info due to error: ${error}`);
    res.json(null);
  });
});

app.listen(PORT, HOST, () => {
  console.log('Listening...');
});
