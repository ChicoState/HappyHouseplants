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
    res.send(docs);
  });
});

app.get('/tips/:tipID', (req, res) => {
  const tipQuery = { tipID: req.params.tipID };
  findDocuments('tips', tipQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).send('Tip not found');
    } else {
      res.send(docs[0]);
    }
  });
});

app.get('/users/:userId', (req, res) => {
  const userQuery = { userId: req.params.userId };
  findDocuments('Users', userQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).send('User not found');
    } else {
      // Don't send the whole 'user' document, that'll contain sensitive information!
      const user = docs[0];
      const publicUserInfo = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      };
      res.send(publicUserInfo);
    }
  });
});

app.get('/users/:userId/tips', (req, res) => {
  const userQuery = { userId: req.params.userId }; // TODO: Authenticate
  findDocuments('Users', userQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).send('User not found');
    } else {
      const user = docs[0];
      res.send(user.savedTipsByID);
    }
  });
});

app.get('/users/:userId/plants', (req, res) => {
  const userQuery = { userId: req.params.userId }; // TODO: Authenticate
  findDocuments('Users', userQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).send('User not found');
    } else {
      const user = docs[0];
      res.send(user.savedPlantsByID);
    }
  });
});

app.get('/mycalendar/notes', (req, res) => {
  const userId = 'MyUserID';// TODO: Obtain userId from session token
  const query = { userId };

  findOneDocument('Users', query).then((userDoc) => {
    const { calendarNotes = {/* Default no notes */} } = userDoc;
    res.send(calendarNotes);
  });
});

app.post('/mycalendar/notes/', (req, res) => {
  const userId = 'MyUserID';// TODO: Obtain userId from session token
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
      res.status(201).send();
    }).catch((saveError) => {
      console.error(`Failed to post a note (${JSON.stringify(note)}) to the calendar for user ID ${userId}. Reason: ${saveError}`);
      res.status(500).send();
    });
  });
});

app.get('/plants/', (req, res) => {
  const plantsQuery = {};
  findDocuments('Plants', plantsQuery).then((docs) => {
    res.send(docs);
  });
});

app.get('/plants/:plantID', (req, res) => {
  const userQuery = { plantID: req.params.plantID };
  findDocuments('Plants', userQuery).then((docs) => {
    if (docs.length < 1) {
      res.status(404).send('Plant not found');
    } else {
      res.send(docs[0]);
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
    res.send(`Failed for reason: ${reason}`);
  });
});

app.post('/login/', (req, res) => {
  const { username, password } = req.body;
  login(username, password).then((status) => {
    res.json(status);
  }).catch((reason) => {
    res.send(`Failed for reason: ${reason}`);
  });
});

app.get('/login_info', (req, res) => {
  authenticateUserRequest(req, res).then((userId) => {
    console.log(`Getting login info for user ID ${userId}...`);
    findOneDocument('Users', { userId }).then((user) => {
      console.log(`Got ${JSON.stringify(user)}`);
      res.json({
        userId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    });
  }).catch((error) => {
    console.error(`Failed to get login info due to error: ${error}`);
    res.json(null);
  });
});

app.listen(PORT, HOST, () => {
  console.log('Listening...');
});
